import { Capacitor } from '@capacitor/core';

export interface FreeraspPlugin {
  addListener(listener: string, callback: (event: any) => void): any;
  talsecStart(options: {
    config: FreeraspConfig;
  }): Promise<{ started: boolean }>;
  onInvalidCallback(): void;
  getThreatIdentifiers(): Promise<{ ids: number[] }>;
  getThreatChannelData(): Promise<{ ids: [string, string, string] }>;
  addToWhitelist(options: {
    packageName: string;
  }): Promise<{ result: boolean }>;
  getAppIcon(options: { packageName: string }): Promise<{ result: string }>;
}

export type FreeraspConfig = {
  androidConfig?: AndroidConfig;
  iosConfig?: IOSConfig;
  watcherMail: string;
  isProd?: boolean;
};

export type AndroidConfig = {
  packageName: string;
  certificateHashes: string[];
  supportedAlternativeStores?: string[];
  malwareConfig?: MalwareConfig;
};

export type IOSConfig = {
  appBundleId: string;
  appTeamId: string;
};

export type MalwareConfig = {
  blacklistedHashes?: string[];
  blacklistedPackageNames?: string[];
  suspiciousPermissions?: string[][];
  whitelistedInstallationSources?: string[];
};

export type SuspiciousAppInfo = {
  packageInfo: PackageInfo;
  reason: string;
};

export type PackageInfo = {
  packageName: string;
  appName?: string;
  version?: string;
  appIcon?: string;
  installerStore?: string;
};

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
  devMode?: () => any;
  systemVPN?: () => any;
  malware?: (suspiciousApps: SuspiciousAppInfo[]) => any;
  adbEnabled?: () => any;
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
  static SystemVPN = new Threat(0);
  static DeviceBinding = new Threat(0);
  static DeviceID = new Threat(0);
  static UnofficialStore = new Threat(0);
  static Overlay = new Threat(0);
  static ObfuscationIssues = new Threat(0);
  static DevMode = new Threat(0);
  static Malware = new Threat(0);
  static ADBEnabled = new Threat(0);

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
          this.SystemVPN,
          this.DeviceBinding,
          this.UnofficialStore,
          this.Overlay,
          this.ObfuscationIssues,
          this.DevMode,
          this.Malware,
          this.ADBEnabled,
        ]
      : [
          this.AppIntegrity,
          this.PrivilegedAccess,
          this.Debug,
          this.Hooks,
          this.Passcode,
          this.Simulator,
          this.SecureHardwareNotAvailable,
          this.SystemVPN,
          this.DeviceBinding,
          this.DeviceID,
          this.UnofficialStore,
        ];
  }
}
