import type { PluginListenerHandle } from '@capacitor/core';

import { getThreatChannelData, prepareThreatMapping } from '../../channels/threat';
import { Threat } from '../../models/threat';
import type { ThreatEventActions } from '../../types/types';
import { parseMalwareData } from '../../utils/malware';
import { onInvalidCallback } from '../methods/native';
import { Talsec } from '../nativeModules';

let eventsListener: PluginListenerHandle | null = null;

let threatChannel: string | null = null;
let threatKey: string | null = null;
let threatMalwareKey: string | null = null;

let isInitializing = false;
let isMappingPrepared = false;

export const registerThreatListener = async (config: ThreatEventActions): Promise<void> => {
  if (isInitializing) {
    return;
  }
  isInitializing = true;

  await removeThreatListener();

  if (!threatChannel || !threatKey || !threatMalwareKey) {
    [threatChannel, threatKey, threatMalwareKey] = await getThreatChannelData();
  }

  if (!isMappingPrepared) {
    await prepareThreatMapping();
    isMappingPrepared = true;
  }

  if (!threatChannel) {
    onInvalidCallback();
  }

  eventsListener = await Talsec.addListener(threatChannel, async (event: any) => {
    if (!threatKey || !threatMalwareKey) {
      onInvalidCallback();
      return;
    }
    switch (event[threatKey]) {
      case Threat.PrivilegedAccess.value:
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
        config.malware?.(await parseMalwareData(event[threatMalwareKey]));
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
      case Threat.UnsecureWifi.value:
        config.unsecureWifi?.();
        break;
      case Threat.Automation.value:
        config.automation?.();
        break;
      default:
        onInvalidCallback();
        break;
    }
  });
  isInitializing = false;
};

export const removeThreatListener = async (): Promise<void> => {
  if (!eventsListener || !threatChannel) {
    return;
  }
  await eventsListener.remove();
  eventsListener = null;
  await Talsec.removeListenerForEvent({ eventName: threatChannel })
};
