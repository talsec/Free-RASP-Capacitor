package app.talsec.rasp.capacitor

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Context
import android.os.Build
import android.os.Handler
import android.os.HandlerThread
import android.os.Looper
import app.talsec.rasp.security.api.SuspiciousAppInfo
import app.talsec.rasp.security.api.Talsec
import app.talsec.rasp.security.api.TalsecConfig
import app.talsec.rasp.security.api.TalsecMode
import app.talsec.rasp.security.api.ThreatListener.CallState
import app.talsec.rasp.capacitor.dispatchers.ExecutionStateDispatcher
import app.talsec.rasp.capacitor.dispatchers.ThreatDispatcher
import app.talsec.rasp.capacitor.utils.Utils
import app.talsec.rasp.capacitor.utils.getArraySafe
import app.talsec.rasp.capacitor.utils.toEncodedJSArray
import app.talsec.rasp.capacitor.utils.toSuspiciousAppDetectionConfig
import app.talsec.rasp.capacitor.events.BaseRaspEvent
import app.talsec.rasp.capacitor.events.RaspExecutionStateEvent
import app.talsec.rasp.capacitor.events.ThreatEvent
import app.talsec.rasp.capacitor.interfaces.PluginExecutionStateListener
import app.talsec.rasp.capacitor.interfaces.PluginThreatListener
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import org.json.JSONArray
import java.lang.ref.WeakReference

typealias CapacitorCallback = (String, JSObject) -> Unit

@CapacitorPlugin(name = "Freerasp")
class FreeraspPlugin : Plugin() {

    override fun load() {
        initializeEventKeys()
        super.load()
    }

    @PluginMethod
    fun talsecStart(call: PluginCall) {
        if (talsecStarted) {
            call.resolve(JSObject().put("started", true))
            return
        }

        val config = call.getObject("config")
        if (config == null) {
            call.reject("Missing config parameter in freeRASP Native Plugin")
            return
        }
        try {
            val talsecConfig = buildTalsecConfigThrowing(config)
            PluginThreatHandler.registerSDKListener(context)

            bridge.activity.runOnUiThread {
                Talsec.start(context, talsecConfig, TalsecMode.BACKGROUND)
                mainHandler.post {
                    talsecStarted = true
                    // This code must be called only AFTER Talsec.start
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
                        ScreenProtector.register(activity)
                    }
                    call.resolve(JSObject().put("started", true))
                }
            }

        } catch (e: Exception) {
            call.reject(
                "Error during Talsec Native plugin initialization - ${e.message}",
                "TalsecInitializationError",
                e
            )
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_NONE)
    override fun addListener(call: PluginCall) {
        val eventName = call.getString("eventName")
        val pluginCallback: CapacitorCallback = { eventName, data ->
            notifyListeners(eventName, data, true)
        }
        if (eventName == ThreatEvent.CHANNEL_NAME) {
            ThreatDispatcher.registerListener(PluginListener(context, pluginCallback))
        }
        if (eventName == RaspExecutionStateEvent.CHANNEL_NAME) {
            ExecutionStateDispatcher.registerListener(PluginListener(context, pluginCallback))
        }
        super.addListener(call)
    }

    @PluginMethod(returnType = PluginMethod.RETURN_NONE)
    fun removeListenerForEvent(call: PluginCall) {
        val eventName = call.getString("eventName")
        if (eventName == ThreatEvent.CHANNEL_NAME) {
            ThreatDispatcher.unregisterListener()
        }
        if (eventName == RaspExecutionStateEvent.CHANNEL_NAME) {
            ExecutionStateDispatcher.unregisterListener()
        }
    }

    override fun handleOnPause() {
        super.handleOnPause()
        ThreatDispatcher.onPause()
        ExecutionStateDispatcher.onPause()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            ScreenProtector.unregister(activity)
        }
        if (activity.isFinishing) {
            stopOngoingCallDetectionInternal()
            ThreatDispatcher.unregisterListener()
            ExecutionStateDispatcher.unregisterListener()
            PluginThreatHandler.unregisterSDKListener(context)
        }
    }

    override fun handleOnResume() {
        super.handleOnResume()
        ThreatDispatcher.onResume()
        ExecutionStateDispatcher.onResume()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            ScreenProtector.register(activity)
        }
    }

    override fun handleOnDestroy() {
        super.handleOnDestroy()
        backgroundHandlerThread.quitSafely()
    }

    // Trigger lazy initialization of the freeRASP events
    private fun initializeEventKeys() {
        ThreatEvent.ALL_EVENTS
        RaspExecutionStateEvent.ALL_EVENTS
    }

    /**
     * Method to get the random identifiers of callbacks
     */
    @PluginMethod
    fun getThreatIdentifiers(call: PluginCall) {
        call.resolve(JSObject().put("ids", ThreatEvent.ALL_EVENTS))
    }

    /**
     * Method to get the random identifiers of callbacks
     */
    @PluginMethod
    fun getRaspExecutionStateIdentifiers(call: PluginCall) {
        call.resolve(JSObject().put("ids", RaspExecutionStateEvent.ALL_EVENTS))
    }

    /**
     * Method to setup the message passing between native and Capacitor
     * @return list of [CHANNEL_NAME, CHANNEL_KEY, MALWARE_CHANNEL_KEY, CALL_STATE_CHANNEL_KEY]
     */
    @PluginMethod
    fun getThreatChannelData(call: PluginCall) {
        val channelData = JSONArray(
            (listOf(
                ThreatEvent.CHANNEL_NAME,
                ThreatEvent.CHANNEL_KEY,
                ThreatEvent.MALWARE_CHANNEL_KEY,
                ThreatEvent.CALL_STATE_CHANNEL_KEY
            ))
        )
        call.resolve(JSObject().put("ids", channelData))
    }

    /**
     * Method to setup the execution state message passing between native and Capacitor
     * @return list of [CHANNEL_NAME, CHANNEL_KEY]
     */
    @PluginMethod
    fun getRaspExecutionStateChannelData(call: PluginCall) {
        val channelData = JSONArray(
            (listOf(
                RaspExecutionStateEvent.CHANNEL_NAME, RaspExecutionStateEvent.CHANNEL_KEY
            ))
        )
        call.resolve(JSObject().put("ids", channelData))
    }

    /**
     * We never send an invalid callback over our channel.
     * Therefore, if this happens, we want to kill the app.
     */
    @PluginMethod
    fun onInvalidCallback(call: PluginCall) {
        android.os.Process.killProcess(android.os.Process.myPid())
    }

    /**
     * Add app with given package name to Talsec Malware Whitelist
     * @param packageName - package name of the whitelisted app
     * @return true if successful
     */
    @PluginMethod
    fun addToWhitelist(call: PluginCall) {
        val packageName = call.getString("packageName")
        if (packageName.isNullOrEmpty()) {
            call.reject(
                "Package name argument is missing or empty in the call",
                "MissingArgumentError"
            )
            return
        }
        Talsec.addToWhitelist(context, packageName)
        call.resolve(JSObject().put("result", true))
    }

    /**
     * Method retrieves app icon for the given parameter
     * @param packageName package name of the app we want to retrieve icon for
     * @return PNG with app icon encoded as a base64 string
     */
    @PluginMethod
    fun getAppIcon(call: PluginCall) {
        val packageName = call.getString("packageName")
        if (packageName.isNullOrEmpty()) {
            call.reject(
                "Package name argument is missing or empty in the call",
                "MissingArgumentError"
            )
            return
        }
        // Perform the app icon encoding on a background thread
        backgroundHandler.post {
            val encodedData = Utils.getAppIconAsBase64String(context, packageName)
            mainHandler.post { call.resolve(JSObject().put("result", encodedData)) }
        }
    }

    /**
     * Method to set screen capture state
     * @param enable Pass `true` to block screen capture, `false` to enable it
     */
    @PluginMethod
    fun blockScreenCapture(call: PluginCall) {
        val enable = call.getBoolean("enable") ?: run {
            call.reject(
                "Enable argument is missing or not a boolean.", "MissingArgumentError"
            )
            return
        }

        activity?.runOnUiThread {
            try {
                Talsec.blockScreenCapture(activity, enable)
                call.resolve(JSObject().put("result", true))
            } catch (e: Exception) {
                call.reject(
                    "Error while setting screen capture: ${e.message}", "BlockScreenCaptureError"
                )
            }
        } ?: run {
            call.reject("Cannot block screen capture, activity is null.", "BlockScreenCaptureError")
        }
    }

    /**
     * Method to check if screen capturing is currently blocked
     */
    @PluginMethod
    fun isScreenCaptureBlocked(call: PluginCall) {
        val currentActivity = activity ?: run {
            call.reject(
                "Cannot check screen capture state, activity is null.",
                "IsScreenCaptureBlockedError"
            )
            return
        }
        try {
            val isBlocked = Talsec.isScreenCaptureBlocked(currentActivity)
            call.resolve(JSObject().put("result", isBlocked))
        } catch (e: Exception) {
            call.reject(
                "Error while checking if screen capture is blocked: ${e.message}",
                "IsScreenCaptureBlockedError"
            )
        }
    }

    /**
     * Method to block accessibility services from reading or controlling the screen
     * @param enable Pass `true` to block screen control, `false` to enable it
     */
    @PluginMethod
    fun blockScreenControl(call: PluginCall) {
        val enable = call.getBoolean("enable") ?: run {
            call.reject(
                "Enable argument is missing or not a boolean.", "MissingArgumentError"
            )
            return
        }

        activity?.runOnUiThread {
            try {
                Talsec.blockScreenControl(activity, enable)
                call.resolve(JSObject().put("result", true))
            } catch (e: Exception) {
                call.reject(
                    "Error while setting screen control: ${e.message}", "BlockScreenControlError"
                )
            }
        } ?: run {
            call.reject("Cannot block screen control, activity is null.", "BlockScreenControlError")
        }
    }

    /**
     * Method to check if screen control is currently blocked
     */
    @PluginMethod
    fun isScreenControlBlocked(call: PluginCall) {
        val currentActivity = activity ?: run {
            call.reject(
                "Cannot check screen control state, activity is null.",
                "IsScreenControlBlockedError"
            )
            return
        }
        try {
            call.resolve(JSObject().put("result", Talsec.isScreenControlBlocked(currentActivity)))
        } catch (e: Exception) {
            call.reject(
                "Error while checking if screen control is blocked: ${e.message}",
                "IsScreenControlBlockedError"
            )
        }
    }

    /**
     * Method to hide overlay windows of other apps over the activity.
     * Requires Android 12+ and the HIDE_OVERLAY_WINDOWS permission.
     * @param enable Pass `true` to hide overlay windows, `false` to show them
     * @return whether the request was applied
     */
    // Missing permission is suppressed because the decision to use the overlay API is made
    // by developer, and not enforced by the library.
    @SuppressLint("MissingPermission")
    @PluginMethod
    fun blockOverlayWindows(call: PluginCall) {
        val enable = call.getBoolean("enable") ?: run {
            call.reject(
                "Enable argument is missing or not a boolean.", "MissingArgumentError"
            )
            return
        }

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
            call.resolve(JSObject().put("result", false))
            return
        }

        activity?.runOnUiThread {
            try {
                call.resolve(JSObject().put("result", Talsec.blockOverlayWindows(activity, enable)))
            } catch (e: Exception) {
                call.reject(
                    "Error while setting overlay windows: ${e.message}", "BlockOverlayWindowsError"
                )
            }
        } ?: run {
            call.reject("Cannot block overlay windows, activity is null.", "BlockOverlayWindowsError")
        }
    }

    /**
     * Method to check if overlay windows of other apps are currently hidden
     */
    @PluginMethod
    fun isOverlayWindowsBlocked(call: PluginCall) {
        val currentActivity = activity ?: run {
            call.reject(
                "Cannot check overlay windows state, activity is null.",
                "IsOverlayWindowsBlockedError"
            )
            return
        }
        try {
            call.resolve(JSObject().put("result", Talsec.isOverlayWindowsBlocked(currentActivity)))
        } catch (e: Exception) {
            call.reject(
                "Error while checking if overlay windows are blocked: ${e.message}",
                "IsOverlayWindowsBlockedError"
            )
        }
    }

    /**
     * Method to start the ongoing call (cellular and VoIP) detection for the current activity
     */
    @PluginMethod
    fun startOngoingCallDetection(call: PluginCall) {
        val currentActivity = activity ?: run {
            call.reject(
                "Cannot start ongoing call detection, activity is null.",
                "OngoingCallDetectionError"
            )
            return
        }
        try {
            if (ongoingCallActivity?.get() !== currentActivity) {
                stopOngoingCallDetectionInternal()
                Talsec.startOngoingCallDetection(currentActivity)
                ongoingCallActivity = WeakReference(currentActivity)
            }
            call.resolve(JSObject().put("result", true))
        } catch (e: Exception) {
            call.reject(
                "Error while starting ongoing call detection: ${e.message}",
                "OngoingCallDetectionError"
            )
        }
    }

    /**
     * Method to stop the ongoing call detection
     */
    @PluginMethod
    fun stopOngoingCallDetection(call: PluginCall) {
        try {
            stopOngoingCallDetectionInternal()
            call.resolve(JSObject().put("result", true))
        } catch (e: Exception) {
            call.reject(
                "Error while stopping ongoing call detection: ${e.message}",
                "OngoingCallDetectionError"
            )
        }
    }

    private fun stopOngoingCallDetectionInternal() {
        ongoingCallActivity?.get()?.let { Talsec.stopOngoingCallDetection(it) }
        ongoingCallActivity = null
    }

    @PluginMethod
    fun storeExternalId(call: PluginCall) {
        val externalId = call.getString("data")
        if (externalId.isNullOrEmpty()) {
            call.reject(
                "External ID not provided", "MissingArgumentError"
            )
            return
        }
        try {
            Talsec.storeExternalId(context, externalId)
            call.resolve(JSObject().put("result", true))
        } catch (e: Exception) {
            call.reject(
                "Error during storeExternalId operation in freeRASP Native Plugin",
                "NativePluginError"
            )
            return
        }
    }

    @PluginMethod
    fun removeExternalId(call: PluginCall) {
        try {
            Talsec.removeExternalId(context)
            call.resolve(JSObject().put("result", true))
        } catch (e: Exception) {
            call.reject(
                "Error during removeExternalId operation in freeRASP Native Plugin",
                "NativePluginError"
            )
            return
        }
    }

    private fun buildTalsecConfigThrowing(configJson: JSObject): TalsecConfig {
        val androidConfig = configJson.getJSONObject("androidConfig")
        val packageName = androidConfig.getString("packageName")
        val certificateHashes = androidConfig.getArraySafe("certificateHashes")
        val talsecBuilder = TalsecConfig.Builder(packageName, certificateHashes)
            .watcherMail(configJson.getString("watcherMail"))
            .supportedAlternativeStores(androidConfig.getArraySafe("supportedAlternativeStores"))
            .prod(configJson.getBool("isProd") ?: true)
            .killOnBypass(configJson.getBool("killOnBypass") ?: false)

        if (androidConfig.has("suspiciousAppDetectionConfig")) {
            talsecBuilder.suspiciousAppDetection(
                androidConfig.getJSONObject("suspiciousAppDetectionConfig").toSuspiciousAppDetectionConfig()
            )
        }

        return talsecBuilder.build()
    }


    companion object {
        private val backgroundHandlerThread = HandlerThread("BackgroundThread").apply { start() }
        private val backgroundHandler = Handler(backgroundHandlerThread.looper)
        private val mainHandler = Handler(Looper.getMainLooper())

        internal var talsecStarted = false

        // Ongoing call detection is registered per activity
        private var ongoingCallActivity: WeakReference<Activity>? = null
    }

    internal class PluginListener(
        private val context: Context,
        private val pluginCallback: CapacitorCallback
    ) : PluginThreatListener, PluginExecutionStateListener {
        override fun threatDetected(threatEventType: ThreatEvent) {
            notifyEvent(threatEventType, pluginCallback)
        }

        override fun malwareDetected(suspiciousApps: MutableList<SuspiciousAppInfo>) {
            notifyMalware(suspiciousApps, context, pluginCallback)
        }

        override fun ongoingCallDetected(state: CallState) {
            val params = JSObject()
                .put(ThreatEvent.CHANNEL_KEY, ThreatEvent.OngoingCall.value)
                .put(ThreatEvent.CALL_STATE_CHANNEL_KEY, state.name)
            pluginCallback(ThreatEvent.CHANNEL_NAME, params)
        }

        override fun raspExecutionStateChanged(event: RaspExecutionStateEvent) {
            notifyEvent(event, pluginCallback)
        }

        private fun notifyEvent(
            event: BaseRaspEvent,
            notifyListenersCallback: CapacitorCallback
        ) {
            val params = JSObject().put(event.channelKey, event.value)
            notifyListenersCallback(event.channelName, params)
        }

        private fun notifyMalware(
            suspiciousApps: MutableList<SuspiciousAppInfo>,
            context: Context,
            notifyListenersCallback: CapacitorCallback
        ) {
            // Perform the malware encoding on a background thread
            backgroundHandler.post {

                val encodedSuspiciousApps = suspiciousApps.toEncodedJSArray(context)
                mainHandler.post {
                    val params = JSObject()
                        .put(ThreatEvent.CHANNEL_KEY, ThreatEvent.Malware.value)
                        .put(ThreatEvent.MALWARE_CHANNEL_KEY, encodedSuspiciousApps)
                    notifyListenersCallback.invoke(ThreatEvent.CHANNEL_NAME, params)
                }

            }
        }
    }
}