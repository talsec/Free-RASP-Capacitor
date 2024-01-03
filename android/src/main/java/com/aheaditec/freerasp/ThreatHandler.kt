package com.aheaditec.freerasp

import com.aheaditec.talsec_security.security.api.ThreatListener

internal object TalsecThreatHandler : ThreatListener.ThreatDetected, ThreatListener.DeviceState {

    override fun onRootDetected() {
        FreeraspPlugin.instance.notifyListeners(Threat.PrivilegedAccess)
    }

    override fun onDebuggerDetected() {
        FreeraspPlugin.instance.notifyListeners(Threat.Debug)
    }

    override fun onEmulatorDetected() {
        FreeraspPlugin.instance.notifyListeners(Threat.Simulator)
    }

    override fun onTamperDetected() {
        FreeraspPlugin.instance.notifyListeners(Threat.AppIntegrity)
    }

    override fun onUntrustedInstallationSourceDetected() {
        FreeraspPlugin.instance.notifyListeners(Threat.UnofficialStore)
    }

    override fun onHookDetected() {
        FreeraspPlugin.instance.notifyListeners(Threat.Hooks)
    }

    override fun onDeviceBindingDetected() {
        FreeraspPlugin.instance.notifyListeners(Threat.DeviceBinding)
    }

    override fun onObfuscationIssuesDetected() {
        FreeraspPlugin.instance.notifyListeners(Threat.ObfuscationIssues)
    }

    override fun onUnlockedDeviceDetected() {
        FreeraspPlugin.instance.notifyListeners(Threat.Passcode)
    }

    override fun onHardwareBackedKeystoreNotAvailableDetected() {
        FreeraspPlugin.instance.notifyListeners(Threat.SecureHardwareNotAvailable)
    }
}
