package com.aheaditec.freerasp.events

import com.aheaditec.freerasp.utils.RandomGenerator
import org.json.JSONArray

/**
 * Sealed class to represent the error codes.
 *
 * Sealed classes are used because of obfuscation - enums classes are not obfuscated well enough.
 *
 * @property value integer value of the error code.
 */
internal sealed class ThreatEvent(override val value: Int) : BaseRaspEvent {
    override val channelName: String get() = CHANNEL_NAME
    override val channelKey: String get() = CHANNEL_KEY

    object AppIntegrity : ThreatEvent(RandomGenerator.next())
    object PrivilegedAccess : ThreatEvent(RandomGenerator.next())
    object Debug : ThreatEvent(RandomGenerator.next())
    object Hooks : ThreatEvent(RandomGenerator.next())
    object Passcode : ThreatEvent(RandomGenerator.next())
    object Simulator : ThreatEvent(RandomGenerator.next())
    object SecureHardwareNotAvailable : ThreatEvent(RandomGenerator.next())
    object DeviceBinding : ThreatEvent(RandomGenerator.next())
    object UnofficialStore : ThreatEvent(RandomGenerator.next())
    object ObfuscationIssues : ThreatEvent(RandomGenerator.next())
    object SystemVPN : ThreatEvent(RandomGenerator.next())
    object DevMode : ThreatEvent(RandomGenerator.next())
    object Malware : ThreatEvent(RandomGenerator.next())
    object ADBEnabled : ThreatEvent(RandomGenerator.next())
    object Screenshot : ThreatEvent(RandomGenerator.next())
    object ScreenRecording : ThreatEvent(RandomGenerator.next())
    object MultiInstance : ThreatEvent(RandomGenerator.next())
    object TimeSpoofing : ThreatEvent(RandomGenerator.next())
    object LocationSpoofing : ThreatEvent(RandomGenerator.next())
    object UnsecureWifi : ThreatEvent(RandomGenerator.next())

    companion object {

        internal val CHANNEL_NAME = RandomGenerator.next().toString()
        internal val CHANNEL_KEY = RandomGenerator.next().toString()
        internal val MALWARE_CHANNEL_KEY = RandomGenerator.next().toString()

        internal val ALL_EVENTS = JSONArray(
            listOf(
                AppIntegrity,
                PrivilegedAccess,
                Debug,
                Hooks,
                Passcode,
                Simulator,
                SecureHardwareNotAvailable,
                SystemVPN,
                DeviceBinding,
                UnofficialStore,
                ObfuscationIssues,
                DevMode,
                Malware,
                ADBEnabled,
                Screenshot,
                ScreenRecording,
                MultiInstance,
                TimeSpoofing,
                LocationSpoofing,
                UnsecureWifi
            ).map { it.value }
        )
    }
}
