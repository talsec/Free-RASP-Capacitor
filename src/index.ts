import { Capacitor, registerPlugin } from '@capacitor/core';

import type {
  FreeraspPlugin,
  FreeraspConfig,
  NativeEventEmitterActions,
  SuspiciousAppInfo,
  PackageInfo,
} from './definitions';
import { Threat } from './definitions';
import { getThreatCount, itemsHaveType } from './utils';

const activeListeners: any[] = [];

const Freerasp = registerPlugin<FreeraspPlugin>('Freerasp', {});

const onInvalidCallback = (): void => {
  Freerasp.onInvalidCallback();
};

const getThreatIdentifiers = async (): Promise<number[]> => {
  const { ids } = await Freerasp.getThreatIdentifiers();
  if (ids.length !== getThreatCount() || !itemsHaveType(ids, 'number')) {
    onInvalidCallback();
  }
  return ids;
};

const getThreatChannelData = async (): Promise<[string, string, string]> => {
  const dataLength = Capacitor.getPlatform() === 'ios' ? 2 : 3;
  const { ids } = await Freerasp.getThreatChannelData();
  if (ids.length !== dataLength || !itemsHaveType(ids, 'string')) {
    onInvalidCallback();
  }
  return ids;
};

const prepareMapping = async (): Promise<void> => {
  const newValues = await getThreatIdentifiers();
  const threats = Threat.getValues();

  threats.map((threat, index) => {
    threat.value = newValues[index];
  });
};

// parses base64-encoded malware data to SuspiciousAppInfo[]
const parseMalwareData = async (
  data: string[],
): Promise<SuspiciousAppInfo[]> => {
  return new Promise((resolve, reject) => {
    try {
      const suspiciousAppData = data.map(entry => toSuspiciousAppInfo(entry));
      resolve(suspiciousAppData);
    } catch (error: any) {
      reject(`Parsing app data failed: ${error}`);
    }
  });
};

const toSuspiciousAppInfo = (base64Value: string): SuspiciousAppInfo => {
  const data = JSON.parse(atob(base64Value));
  const packageInfo = data.packageInfo as PackageInfo;
  return { packageInfo, reason: data.reason } as SuspiciousAppInfo;
};

const setThreatListeners = async <T extends NativeEventEmitterActions>(
  callbacks: T & Record<Exclude<keyof T, keyof NativeEventEmitterActions>, []>,
): Promise<void> => {
  const [channel, key, malwareKey] = await getThreatChannelData();
  await prepareMapping();

  await Freerasp.addListener(channel, async (event: any) => {
    if (event[key] === undefined) {
      onInvalidCallback();
    }
    switch (event[key]) {
      case Threat.PrivilegedAccess.value:
        callbacks.privilegedAccess?.();
        break;
      case Threat.Debug.value:
        callbacks.debug?.();
        break;
      case Threat.Simulator.value:
        callbacks.simulator?.();
        break;
      case Threat.AppIntegrity.value:
        callbacks.appIntegrity?.();
        break;
      case Threat.UnofficialStore.value:
        callbacks.unofficialStore?.();
        break;
      case Threat.Hooks.value:
        callbacks.hooks?.();
        break;
      case Threat.DeviceBinding.value:
        callbacks.deviceBinding?.();
        break;
      case Threat.Passcode.value:
        callbacks.passcode?.();
        break;
      case Threat.SecureHardwareNotAvailable.value:
        callbacks.secureHardwareNotAvailable?.();
        break;
      case Threat.ObfuscationIssues.value:
        callbacks.obfuscationIssues?.();
        break;
      case Threat.DeviceID.value:
        callbacks.deviceID?.();
        break;
      case Threat.DevMode.value:
        callbacks.devMode?.();
        break;
      case Threat.SystemVPN.value:
        callbacks.systemVPN?.();
        break;
      case Threat.Malware.value:
        callbacks.malware?.(await parseMalwareData(event[malwareKey]));
        break;
      case Threat.ADBEnabled.value:
        callbacks.adbEnabled?.();
        break;
      case Threat.Screenshot.value:
        callbacks.screenshot?.();
        break;
      case Threat.ScreenRecording.value:
        callbacks.screenRecording?.();
        break;
      default:
        onInvalidCallback();
        break;
    }
  });
};

const removeThreatListeners = (): void => {
  activeListeners.forEach(listener => listener.remove());
};

const startFreeRASP = async <T extends NativeEventEmitterActions>(
  config: FreeraspConfig,
  reactions: T & Record<Exclude<keyof T, keyof NativeEventEmitterActions>, []>,
): Promise<boolean> => {
  await setThreatListeners(reactions);
  try {
    const { started } = await Freerasp.talsecStart({ config });
    return started;
  } catch (e: any) {
    console.error(`${e.code}: ${e.message}`);
    return Promise.reject(`${e.code}: ${e.message}`);
  }
};

const addToWhitelist = async (packageName: string): Promise<boolean> => {
  if (Capacitor.getPlatform() === 'ios') {
    return Promise.reject('Malware detection not available on iOS');
  }
  const { result } = await Freerasp.addToWhitelist({ packageName });
  return result;
};

const getAppIcon = async (packageName: string): Promise<string> => {
  if (Capacitor.getPlatform() === 'ios') {
    return Promise.reject(
      'App icon retrieval for Malware detection not available on iOS',
    );
  }
  const { result } = await Freerasp.getAppIcon({ packageName });
  return result;
};

const blockScreenCapture = async (enable: boolean): Promise<boolean> => {
  const { result } = await Freerasp.blockScreenCapture({ enable });
  return result;
};

const isScreenCaptureBlocked = async (): Promise<boolean> => {
  const { result } = await Freerasp.isScreenCaptureBlocked();
  return result;
};

const storeExternalId = async (data: string): Promise<boolean> => {
  const { result } = await Freerasp.storeExternalId({ data });
  return result;
};

export * from './definitions';
export {
  Freerasp,
  startFreeRASP,
  setThreatListeners,
  removeThreatListeners,
  addToWhitelist,
  getAppIcon,
  blockScreenCapture,
  isScreenCaptureBlocked,
  storeExternalId,
};
