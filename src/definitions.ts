export interface FreeraspPlugin {
  addListener(listener: string, callback: () => any): any;
  talsecStart(options: { config: FreeraspConfig }): Promise<{ started: boolean }>;
}

export type FreeraspConfig = {
  androidConfig?: AndroidConfig;
  iosConfig?: IOSConfig;
  watcherMail: string;
  isProd?: boolean;
}

export type AndroidConfig = {
  packageName: string;
  certificateHashes: string[];
  supportedAlternativeStores?: string[];
}

export type IOSConfig = {
  appBundleId: string;
  appTeamId: string;
}

export type NativeEventEmitterActions = {
  privilegedAccess?: () => any;
  debug?: () => any;
  simulator?: () => any;
  appIntegrity?: () => any;
  unofficialStore?: () => any;
  hooks?: () => any;
  deviceBinding?: () => any;
  deviceID?: () => any;
  passcode?: () => any;
  secureHardwareNotAvailable?: () => any;
  obfuscationIssues?: () => any;
};
