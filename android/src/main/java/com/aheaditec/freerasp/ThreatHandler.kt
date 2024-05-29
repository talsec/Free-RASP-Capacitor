package com.aheaditec.freerasp

import com.aheaditec.talsec_security.security.api.ThreatListener

internal class TalsecThreatHandler(private val instance: FreeraspPlugin) :
    ThreatListener.ThreatDetected, ThreatListener.DeviceState {

    override fun onRootDetected() {
        instance.notifyListeners(Threat.PrivilegedAccess)
    }

    override fun onDebuggerDetected() {
        instance.notifyListeners(Threat.Debug)
    }

    override fun onEmulatorDetected() {
        instance.notifyListeners(Threat.Simulator)
    }

    override fun onTamperDetected() {
        instance.notifyListeners(Threat.AppIntegrity)
    }

    override fun onUntrustedInstallationSourceDetected() {
        instance.notifyListeners(Threat.UnofficialStore)
    }

    override fun onHookDetected() {
        instance.notifyListeners(Threat.Hooks)
    }

    override fun onDeviceBindingDetected() {
        instance.notifyListeners(Threat.DeviceBinding)
    }

    override fun onObfuscationIssuesDetected() {
        instance.notifyListeners(Threat.ObfuscationIssues)
    }

    override fun onUnlockedDeviceDetected() {
        instance.notifyListeners(Threat.Passcode)
    }

    override fun onHardwareBackedKeystoreNotAvailableDetected() {
        instance.notifyListeners(Threat.SecureHardwareNotAvailable)
    }

    override fun onDeveloperModeDetected() {
        instance.notifyListeners(Threat.DevMode)
    }

    override fun onSystemVPNDetected() {
        instance.notifyListeners(Threat.SystemVPN)
    }
}
