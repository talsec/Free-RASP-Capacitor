import type { FreeraspPlugin, FreeraspConfig, NativeEventEmitterActions } from './definitions';
declare const Freerasp: FreeraspPlugin;
declare const setThreatListeners: <T extends NativeEventEmitterActions>(callbacks: T & Record<Exclude<keyof T, keyof NativeEventEmitterActions>, []>) => Promise<void>;
declare const removeThreatListeners: () => void;
declare const startFreeRASP: <T extends NativeEventEmitterActions>(config: FreeraspConfig, reactions: T & Record<Exclude<keyof T, keyof NativeEventEmitterActions>, []>) => Promise<boolean>;
export * from './definitions';
export { Freerasp, startFreeRASP, setThreatListeners, removeThreatListeners };
