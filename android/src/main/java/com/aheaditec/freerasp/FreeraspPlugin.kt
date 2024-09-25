package com.aheaditec.freerasp

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
            }
            Talsec.start(context, talsecConfig)
            call.resolve(JSObject().put("started", true))
        } catch (e: Exception) {
            call.reject("Error during Talsec Native plugin initialization - ${e.message}", "TalsecInitializationError", e)
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
                THREAT_CHANNEL_NAME, THREAT_CHANNEL_KEY
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

    internal fun notifyListeners(threat: Threat) {
        notifyListeners(THREAT_CHANNEL_NAME, JSObject().put(THREAT_CHANNEL_KEY, threat.value), true)
    }

    private fun buildTalsecConfigThrowing(configJson: JSObject): TalsecConfig {
        val androidConfig = configJson.getJSONObject("androidConfig")
        val packageName = androidConfig.getString("packageName")
        val certificateHashes = androidConfig.getArraySafe("certificateHashes")
        val talsecBuilder = TalsecConfig.Builder(packageName, certificateHashes)
            .watcherMail(config.getString("watcherMail"))
            .supportedAlternativeStores(androidConfig.getArraySafe("supportedAlternativeStores"))
            .prod(configJson.getBool("isProd") ?: true)

        return talsecBuilder.build()
    }

    companion object {
        private val THREAT_CHANNEL_NAME = (10000..999999999).random()
            .toString() // name of the channel over which threat callbacks are sent
        private val THREAT_CHANNEL_KEY = (10000..999999999).random()
            .toString() // key of the argument map under which threats are expected
    }
}