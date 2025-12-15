package com.aheaditec.freerasp

import com.aheaditec.talsec_security.security.api.SuspiciousAppInfo
import com.aheaditec.talsec_security.security.api.ThreatListener
import com.aheaditec.freerasp.events.RaspExecutionStateEvent
import com.aheaditec.freerasp.events.ThreatEvent

internal class TalsecThreatHandler(private val instance: FreeraspPlugin) :
    ThreatListener.ThreatDetected, ThreatListener.DeviceState, ThreatListener.RaspExecutionState() {

    override fun onRootDetected() {
        instance.notifyListeners(ThreatEvent.PrivilegedAccess)
    }

    override fun onDebuggerDetected() {
        instance.notifyListeners(ThreatEvent.Debug)
    }

    override fun onEmulatorDetected() {
        instance.notifyListeners(ThreatEvent.Simulator)
    }

    override fun onTamperDetected() {
        instance.notifyListeners(ThreatEvent.AppIntegrity)
    }

    override fun onUntrustedInstallationSourceDetected() {
        instance.notifyListeners(ThreatEvent.UnofficialStore)
    }

    override fun onHookDetected() {
        instance.notifyListeners(ThreatEvent.Hooks)
    }

    override fun onDeviceBindingDetected() {
        instance.notifyListeners(ThreatEvent.DeviceBinding)
    }

    override fun onObfuscationIssuesDetected() {
        instance.notifyListeners(ThreatEvent.ObfuscationIssues)
    }

    override fun onMalwareDetected(suspiciousAppInfos: MutableList<SuspiciousAppInfo>) {
        instance.notifyMalware(suspiciousAppInfos ?: mutableListOf())
    }

    override fun onUnlockedDeviceDetected() {
        instance.notifyListeners(ThreatEvent.Passcode)
    }

    override fun onHardwareBackedKeystoreNotAvailableDetected() {
        instance.notifyListeners(ThreatEvent.SecureHardwareNotAvailable)
    }

    override fun onDeveloperModeDetected() {
        instance.notifyListeners(ThreatEvent.DevMode)
    }

    override fun onADBEnabledDetected() {
        instance.notifyListeners(ThreatEvent.ADBEnabled)
    }

    override fun onSystemVPNDetected() {
        instance.notifyListeners(ThreatEvent.SystemVPN)
    }

    override fun onScreenshotDetected() {
        instance.notifyListeners(ThreatEvent.Screenshot)
    }

    override fun onScreenRecordingDetected() {
        instance.notifyListeners(ThreatEvent.ScreenRecording)
    }

    override fun onMultiInstanceDetected() {
        instance.notifyListeners(ThreatEvent.MultiInstance)
    }

    override fun onUnsecureWifiDetected() {
        instance.notifyListeners(ThreatEvent.UnsecureWifi)
    }

    override fun onTimeSpoofingDetected() {
        instance.notifyListeners(ThreatEvent.TimeSpoofing)
    }

    override fun onLocationSpoofingDetected() {
        instance.notifyListeners(ThreatEvent.LocationSpoofing)
    }

    override fun onAllChecksFinished() {
        instance.notifyListeners(RaspExecutionStateEvent.AllChecksFinished)
    }
}
