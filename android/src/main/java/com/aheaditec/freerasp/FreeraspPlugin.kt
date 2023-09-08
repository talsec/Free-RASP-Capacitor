package com.aheaditec.freerasp

import com.aheaditec.talsec_security.security.api.Talsec
import com.aheaditec.talsec_security.security.api.TalsecConfig
import com.aheaditec.talsec_security.security.api.ThreatListener
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import java.lang.Exception

@CapacitorPlugin(name = "Freerasp")
class FreeraspPlugin : Plugin(), ThreatListener.DeviceState, ThreatListener.ThreatDetected {

    private val listener = ThreatListener(this, this)
    private var registered = true
    private val emptyData = JSObject()

    @PluginMethod()
    fun talsecStart(call: PluginCall) {
        val config = call.getObject("config")
        if (config == null) {
            call.reject("Missing config parameter in freeRASP Native Plugin")
            return
        }
        try {
            val talsecConfig = parseTalsecConfigThrowing(config)
            listener.registerListener(context)
            Talsec.start(context, talsecConfig)
            call.resolve(JSObject().put("started", true))
        } catch (e: Exception) {
            call.reject("Error during Talsec Native plugin initialization - ${e.message}", null, e)
        }
    }

    override fun handleOnPause() {
        super.handleOnPause()
        listener.unregisterListener(context)
        registered = false
    }

    override fun handleOnResume() {
        super.handleOnResume()
        if (!registered) {
            registered = true
            listener.registerListener(context)
        }
    }

    override fun onRootDetected() {
        notifyListeners("privilegedAccess", emptyData, true)
    }

    override fun onDebuggerDetected() {
        notifyListeners("debug", emptyData, true)
    }

    override fun onEmulatorDetected() {
        notifyListeners("simulator", emptyData, true)
    }

    override fun onTamperDetected() {
        notifyListeners("appIntegrity", emptyData, true)
    }

    override fun onUntrustedInstallationSourceDetected() {
        notifyListeners("unofficialStore", emptyData, true)
    }

    override fun onHookDetected() {
        notifyListeners("hooks", emptyData, true)
    }

    override fun onDeviceBindingDetected() {
        notifyListeners("deviceBinding", emptyData, true)
    }

    override fun onUnlockedDeviceDetected() {
        notifyListeners("passcode", emptyData, true)
    }

    override fun onHardwareBackedKeystoreNotAvailableDetected() {
        notifyListeners("secureHardwareNotAvailable", emptyData, true)
    }

   override fun onObfuscationIssuesDetected() {
       notifyListeners("obfuscationIssues", emptyData, true)
   }

    private fun parseTalsecConfigThrowing(configJson: JSObject): TalsecConfig {
        val androidConfig = configJson.getJSONObject("androidConfig")
        val packageName = androidConfig.getString("packageName")
        val certificateHashes = mutableListOf<String>()
        val hashes = androidConfig.getJSONArray("certificateHashes")
        if (hashes.length() == 0) {
            throw IllegalArgumentException("At least 1 certificate hash is required.")
        }
        for (i in 0 until hashes.length()) {
            certificateHashes.add(hashes.getString(i))
        }
        val watcherMail = configJson.getString("watcherMail")
        val alternativeStores = mutableListOf<String>()
        if (androidConfig.has("supportedAlternativeStores")) {
            val stores = androidConfig.getJSONArray("supportedAlternativeStores")
            for (i in 0 until stores.length()) {
                alternativeStores.add(stores.getString(i))
            }
        }
        val isProd = configJson.getBool("isProd") ?: true

        return TalsecConfig(
            packageName,
            certificateHashes.toTypedArray(),
            watcherMail,
            alternativeStores.toTypedArray(),
            isProd
        )
    }
}