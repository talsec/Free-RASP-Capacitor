import { Capacitor } from "@capacitor/core";

export interface FreeraspPlugin {
  addListener(listener: string, callback: (event: any) => void): any;
  talsecStart(options: { config: FreeraspConfig }): Promise<{ started: boolean }>;
  onInvalidCallback(): void;
  getThreatIdentifiers(): Promise<{ ids: number[] }>;
  getThreatChannelData(): Promise<{ ids: [string, string] }>;
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

export class Threat {
  value: number;

  static AppIntegrity = new Threat(0);
  static PrivilegedAccess = new Threat(0);
  static Debug = new Threat(0);
  static Hooks = new Threat(0);
  static Passcode = new Threat(0);
  static Simulator = new Threat(0);
  static SecureHardwareNotAvailable = new Threat(0);
  static DeviceBinding = new Threat(0);
  static DeviceID = new Threat(0);
  static UnofficialStore = new Threat(0);
  static Overlay = new Threat(0);
  static ObfuscationIssues = new Threat(0);

  constructor(value: number) {
    this.value = value;
  }

  static getValues(): Threat[] {
    return Capacitor.getPlatform() === 'android'
      ? [
          this.AppIntegrity,
          this.PrivilegedAccess,
          this.Debug,
          this.Hooks,
          this.Passcode,
          this.Simulator,
          this.SecureHardwareNotAvailable,
          this.DeviceBinding,
          this.UnofficialStore,
          this.Overlay,
          this.ObfuscationIssues,
        ]
      : [
          this.AppIntegrity,
          this.PrivilegedAccess,
          this.Debug,
          this.Hooks,
          this.Passcode,
          this.Simulator,
          this.SecureHardwareNotAvailable,
          this.DeviceBinding,
          this.DeviceID,
          this.UnofficialStore,
        ];
  }
}
