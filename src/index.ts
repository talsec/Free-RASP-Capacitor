import { registerPlugin } from '@capacitor/core';

import type { FreeraspPlugin, FreeraspConfig, NativeEventEmitterActions } from './definitions';
import { Threat } from './definitions';
import { getThreatCount, itemsHaveType } from './utils';

const activeListeners: any[] = [];

const Freerasp = registerPlugin<FreeraspPlugin>('Freerasp', {
  web: () => import('./web').then(m => new m.FreeraspWeb()),
});

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

const getThreatChannelData = async (): Promise<[string, string]> => {
  const { ids } = await Freerasp.getThreatChannelData();
  if (ids.length !== 2 || !itemsHaveType(ids, 'string')) {
    onInvalidCallback();
  }
  return ids;
};

const prepareMapping = async (): Promise<void> => {
  const newValues = await getThreatIdentifiers();
  const threats = Threat.getValues();

  threats.map((threat, index) => {
    threat.value = newValues[index]!;
  });
};

const setThreatListeners = async <T extends NativeEventEmitterActions>(
  callbacks: T & Record<Exclude<keyof T, keyof NativeEventEmitterActions>, []>
) => {
    const [channel, key] = await getThreatChannelData();
    await prepareMapping();

    await Freerasp.addListener(channel, (event: any) => {
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
      default:
        onInvalidCallback();
        break;
    }
  });
};

const removeThreatListeners = () => {
  activeListeners.forEach((listener) => listener.remove());
};

const startFreeRASP = async <T extends NativeEventEmitterActions>(config: FreeraspConfig, reactions:  T & Record<Exclude<keyof T, keyof NativeEventEmitterActions>, []>) => {
  
  await setThreatListeners(reactions);
  const { started } = await Freerasp.talsecStart({config})

  return started
}

export * from './definitions';
export { Freerasp, startFreeRASP, setThreatListeners, removeThreatListeners };
