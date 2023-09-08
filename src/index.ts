import { Capacitor, registerPlugin } from '@capacitor/core';

import type { FreeraspPlugin, FreeraspConfig, NativeEventEmitterActions } from './definitions';

const activeListeners: any[] = [];

const Freerasp = registerPlugin<FreeraspPlugin>('Freerasp', {
  web: () => import('./web').then(m => new m.FreeraspWeb()),
});

const setThreatListeners = async <T extends NativeEventEmitterActions>(
  callbacks: T & Record<Exclude<keyof T, keyof NativeEventEmitterActions>, []>
) => {

  for (const [threat, action] of Object.entries(callbacks)) {
    if ((threat === 'obfuscationIssues' && Capacitor.getPlatform() === 'ios') || (action === undefined)) {
      continue;
    }
    const listener = await Freerasp.addListener(threat, action);
    activeListeners.push(listener);
  }
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
