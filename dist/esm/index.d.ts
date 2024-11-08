import type { FreeraspPlugin, FreeraspConfig, NativeEventEmitterActions } from './definitions';
declare const Freerasp: FreeraspPlugin;
declare const setThreatListeners: <T extends NativeEventEmitterActions>(callbacks: T & Record<Exclude<keyof T, "privilegedAccess" | "debug" | "simulator" | "appIntegrity" | "unofficialStore" | "hooks" | "deviceBinding" | "deviceID" | "passcode" | "secureHardwareNotAvailable" | "obfuscationIssues" | "devMode" | "systemVPN" | "malware">, []>) => Promise<void>;
declare const removeThreatListeners: () => void;
declare const startFreeRASP: <T extends NativeEventEmitterActions>(config: FreeraspConfig, reactions: T & Record<Exclude<keyof T, "privilegedAccess" | "debug" | "simulator" | "appIntegrity" | "unofficialStore" | "hooks" | "deviceBinding" | "deviceID" | "passcode" | "secureHardwareNotAvailable" | "obfuscationIssues" | "devMode" | "systemVPN" | "malware">, []>) => Promise<boolean>;
declare const addToWhitelist: (packageName: string) => Promise<boolean>;
export * from './definitions';
export { Freerasp, startFreeRASP, setThreatListeners, removeThreatListeners, addToWhitelist, };
