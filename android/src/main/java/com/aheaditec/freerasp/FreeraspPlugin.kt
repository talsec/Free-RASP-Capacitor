package com.aheaditec.freerasp

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
import com.aheaditec.talsec_security.security.api.ThreatListener
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import org.json.JSONArray
import java.lang.Exception

@CapacitorPlugin(name = "Freerasp")
class FreeraspPlugin : Plugin() {

    private val threatHandler = TalsecThreatHandler(this)
    private val listener = ThreatListener(threatHandler, threatHandler)
    private var registered = true

    @PluginMethod
    fun talsecStart(call: PluginCall) {
        val config = call.getObject("config")
        if (config == null) {
            call.reject("Missing config parameter in freeRASP Native Plugin")
            return
        }
        try {
            val talsecConfig = buildTalsecConfigThrowing(config)
            listener.registerListener(context)
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
            listener.unregisterListener(context)
            registered = false
        }
    }

    override fun handleOnResume() {
        super.handleOnResume()
        if (!registered) {
            registered = true
            listener.registerListener(context)
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
        call.resolve(JSObject().put("ids", Threat.getThreatValues()))
    }

    /**
     * Method to setup the message passing between native and React Native
     * @return list of [THREAT_CHANNEL_NAME, THREAT_CHANNEL_KEY]
     */
    @PluginMethod
    fun getThreatChannelData(call: PluginCall) {
        val channelData = JSONArray(
            (listOf(
                THREAT_CHANNEL_NAME, THREAT_CHANNEL_KEY, MALWARE_CHANNEL_KEY
            ))
        )
        call.resolve(JSObject().put("ids", channelData))
    }

    /**
     * We never send an invalid callback over our channel.
     * Therefore, if this happens, we want to kill the app.
     */
    @PluginMethod
    fun onInvalidCallback() {
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
                Talsec.blockScreenCapture(context, enable)
                call.resolve(JSObject().put("result", true))
            } catch (e: kotlin.Exception) {
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
        } catch (e: kotlin.Exception) {
            call.reject(
                "Error while checking if screen capture is blocked: ${e.message}",
                "IsScreenCaptureBlockedError"
            )
        }
    }

    internal fun notifyListeners(threat: Threat) {
        notifyListeners(THREAT_CHANNEL_NAME, JSObject().put(THREAT_CHANNEL_KEY, threat.value), true)
    }

    internal fun notifyMalware(suspiciousApps: MutableList<SuspiciousAppInfo>) {
        // Perform the malware encoding on a background thread
        backgroundHandler.post {

            val encodedSuspiciousApps = suspiciousApps.toEncodedJSArray(context)
            mainHandler.post {
                val params = JSObject()
                    .put(THREAT_CHANNEL_KEY, Threat.Malware.value)
                    .put(MALWARE_CHANNEL_KEY, encodedSuspiciousApps)
                notifyListeners(THREAT_CHANNEL_NAME, params, true)
            }
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
        private val THREAT_CHANNEL_NAME = (10000..999999999).random()
            .toString() // name of the channel over which threat callbacks are sent
        private val THREAT_CHANNEL_KEY = (10000..999999999).random()
            .toString() // key of the argument map under which threats are expected
        private val MALWARE_CHANNEL_KEY = (10000..999999999).random()
            .toString() // key of the argument map under which malware data is expected
        private val backgroundHandlerThread = HandlerThread("BackgroundThread").apply { start() }
        private val backgroundHandler = Handler(backgroundHandlerThread.looper)
        private val mainHandler = Handler(Looper.getMainLooper())

        internal var talsecStarted = false
    }
}