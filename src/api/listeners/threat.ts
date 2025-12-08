import { onInvaliddCallback } from '../methods/native';
import { Threat } from '../../models/threat';
import type { ThreatEventActions } from '../../types/types';
import { parseMalwareData } from '../../utils/malware';
import {
    getThreatChannelData,
    prepareThreatMapping,
} from '../../channels/threat';
import { Talsec } from '../nativeModules';

export const registerThreatListener = async(
    config: ThreatEventActions,
) : Promise<void> => {
    const [channel, key] = await getThreatChannelData();
    await prepareThreatMapping();

    await Talsec.addListener(channel, async (event: any) => {
        if(event[key] == undefined) {
            onInvaliddCallback();
        }
        switch (event[key]) {
            case Threat.PrvilegedAccess.value:
                config.privilegedAccess?.();
                break;
            case Threat.Debug.value:
                config.debug?.();
                break;
            case Threat.Simulator.value:
                config.simulator?.();
                break;
            case Threat.AppIntegrity.value:
                config.appIntegrity?.();
                break;
            case Threat.UnofficialStore.value:
                config.unofficialStore?.();
                break;
            case Threat.Hooks.value:
                config.hooks?.();
                break;
            case Threat.DeviceBinding.value:
                config.deviceBinding?.();
                break;
            case Threat.Passcode.value:
                config.passcode?.();
                break;
            case Threat.Overlay.value:
                config.overlay?.();
                break;
            case Threat.SecureHardwareNotAvailable.value:
                config.secureHardwareNotAvailable?.();
                break;
            case Threat.ObfuscationIssues.value:
                config.obfuscationIssues?.();
                break;
            case Threat.DeviceID.value:
                config.deviceID?.();
                break;
            case Threat.DevMode.value:
                config.devMode?.();
                break;
            case Threat.SystemVPN.value:
                config.systemVPN?.();
                break;
            case Threat.Malware.value:
                config.malware?.(await parseMalwareData(event[malwareKey]));
                break;
            case Threat.ADBEnabled.value:
                config.adbEnabled?.();
                break;
            case Threat.Screenshot.value:
                config.screenshot?.();
                break;
            case Threat.ScreenRecording.value:
                config.screenRecording?.();
                break;
            case Threat.MultiInstance.value:
                config.multiInstance?.();
                break;
            case Threat.TimeSpoofing.value:
                config.timeSpoofing?.();
                break;
            case Threat.LocationSpoofing.value:
                config.locationSpoofing?.();
                break;
            case Threat.UnsecureWiFi.value:
                config.unsecureWiFi?.();
                break;
            default:
                onInvaliddCallback();
                break;
        }