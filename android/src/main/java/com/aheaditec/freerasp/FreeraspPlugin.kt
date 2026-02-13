package com.aheaditec.freerasp

import android.content.Context
import android.os.Build
import android.os.Handler
import android.os.HandlerThread
import android.os.Looper
import com.aheaditec.freerasp.utils.Utils
import com.aheaditec.freerasp.utils.getArraySafe
import com.aheaditec.freerasp.utils.getNestedArraySafe
import com.aheaditec.freerasp.utils.toEncodedJSArray
import com.aheaditec.talsec_security.security.api.SuspiciousAppInfo
import com.aheaditec.talsec_security.security.api.Talsec
import com.aheaditec.talsec_security.security.api.TalsecConfig
import com.aheaditec.freerasp.events.BaseRaspEvent
import com.aheaditec.freerasp.events.RaspExecutionStateEvent
import com.aheaditec.freerasp.events.ThreatEvent
import com.aheaditec.freerasp.interfaces.PluginExecutionStateListener
import com.aheaditec.freerasp.interfaces.PluginThreatListener
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import org.json.JSONArray

@CapacitorPlugin(name = "Freerasp")
class FreeraspPlugin : Plugin() {

    private var registered = true

    override fun load() {
        super.load()
        pluginContext = context
        notifyListenersCallback = { eventName, data ->
            notifyListeners(eventName, data, true)
        }
    }

    @PluginMethod
    fun talsecStart(call: PluginCall) {
        val config = call.getObject("config")
        if (config == null) {
            call.reject("Missing config parameter in freeRASP Native Plugin")
            return
        }
        try {
            val talsecConfig = buildTalsecConfigThrowing(config)
            
            TalsecThreatHandler.threatDispatcher.listener = PluginListener
            TalsecThreatHandler.executionStateDispatcher.listener = PluginListener
            TalsecThreatHandler.registerListener(context)

            bridge.activity.runOnUiThread {
                Talsec.start(context, talsecConfig)
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

    override fun handleOnStart() {
        super.handleOnStart()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            ScreenProtector.register(activity)
        }
    }

    override fun handleOnPause() {
        super.handleOnPause()
        if (activity.isFinishing) {
            TalsecThreatHandler.unregisterListener(context)
            registered = false
        }
    }

    override fun handleOnResume() {
        super.handleOnResume()
        if (!registered) {
            registered = true
            TalsecThreatHandler.registerListener(context)
        }
    }

    override fun handleOnStop() {
        super.handleOnStop()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            ScreenProtector.unregister(activity)
        }
    }

    override fun handleOnDestroy() {
        super.handleOnDestroy()
        backgroundHandlerThread.quitSafely()
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
     * @return list of [CHANNEL_NAME, CHANNEL_KEY, MALWARE_CHANNEL_KEY]
     */
    @PluginMethod
    fun getThreatChannelData(call: PluginCall) {
        val channelData = JSONArray(
            (listOf(
                ThreatEvent.CHANNEL_NAME, ThreatEvent.CHANNEL_KEY, ThreatEvent.MALWARE_CHANNEL_KEY
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
        try {
            val isBlocked = Talsec.isScreenCaptureBlocked()
            call.resolve(JSObject().put("result", isBlocked))
        } catch (e: Exception) {
            call.reject(
                "Error while checking if screen capture is blocked: ${e.message}",
                "IsScreenCaptureBlockedError"
            )
        }
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

        if (androidConfig.has("malwareConfig")) {
            val malwareConfig = androidConfig.getJSONObject("malwareConfig")
            talsecBuilder.whitelistedInstallationSources(malwareConfig.getArraySafe("whitelistedInstallationSources"))
            talsecBuilder.blacklistedHashes(malwareConfig.getArraySafe("blacklistedHashes"))
            talsecBuilder.blacklistedPackageNames(malwareConfig.getArraySafe("blacklistedPackageNames"))
            talsecBuilder.suspiciousPermissions(malwareConfig.getNestedArraySafe("suspiciousPermissions"))
        }
        return talsecBuilder.build()
    }


    companion object {
        private val backgroundHandlerThread = HandlerThread("BackgroundThread").apply { start() }
        private val backgroundHandler = Handler(backgroundHandlerThread.looper)
        private val mainHandler = Handler(Looper.getMainLooper())

        internal var talsecStarted = false
        private var pluginContext: Context? = null
        private var notifyListenersCallback: ((String, JSObject) -> Unit)? = null

        internal fun notifyListeners(event: BaseRaspEvent) {
             val params = JSObject().put(event.channelKey, event.value)
             notifyListenersCallback?.invoke(event.channelName, params)
        }

        internal fun notifyMalware(suspiciousApps: MutableList<SuspiciousAppInfo>) {
            // Perform the malware encoding on a background thread
            backgroundHandler.post {
                pluginContext?.let { context ->
                    val encodedSuspiciousApps = suspiciousApps.toEncodedJSArray(context)
                    mainHandler.post {
                        val params = JSObject()
                            .put(ThreatEvent.CHANNEL_KEY, ThreatEvent.Malware.value)
                            .put(ThreatEvent.MALWARE_CHANNEL_KEY, encodedSuspiciousApps)
                        notifyListenersCallback?.invoke(ThreatEvent.CHANNEL_NAME, params)
                    }
                }
            }
        }
    }

    internal object PluginListener : PluginThreatListener, PluginExecutionStateListener {
        override fun threatDetected(threatEventType: ThreatEvent) {
            notifyListeners(threatEventType)
        }

        override fun malwareDetected(suspiciousApps: MutableList<SuspiciousAppInfo>) {
            notifyMalware(suspiciousApps)
        }

        override fun raspExecutionStateChanged(event: RaspExecutionStateEvent) {
            notifyListeners(event)
        }
    }
}