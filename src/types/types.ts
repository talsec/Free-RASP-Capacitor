export interface TalsecPlugin {
  talsecStart(options: { config: TalsecConfig }): Promise<{ started: boolean }>;
  addListener(listener: string, callback: any): any;
  onInvalidCallback(): void;
  removeListenerForEvent(options: { eventName: string }): Promise<{ result: string }>;
  getThreatIdentifiers(): Promise<{ ids: number[] }>;
  getThreatChannelData(): Promise<{ ids: [string, string, string, string?] }>;
  getRaspExecutionStateIdentifiers(): Promise<{ ids: number[] }>;
  getRaspExecutionStateChannelData(): Promise<{ ids: [string, string] }>;
  storeExternalId(options: { data: string }): Promise<{ result: boolean }>;
  removeExternalId(): Promise<{ result: boolean }>;
  addToWhitelist(options: { packageName: string }): Promise<{ result: boolean }>;
  blockScreenCapture(options: { enable: boolean }): Promise<{ result: boolean }>;
  isScreenCaptureBlocked(): Promise<{ result: boolean }>;
  blockScreenControl(options: { enable: boolean }): Promise<{ result: boolean }>;
  isScreenControlBlocked(): Promise<{ result: boolean }>;
  blockOverlayWindows(options: { enable: boolean }): Promise<{ result: boolean }>;
  isOverlayWindowsBlocked(): Promise<{ result: boolean }>;
  startOngoingCallDetection(): Promise<{ result: boolean }>;
  stopOngoingCallDetection(): Promise<{ result: boolean }>;
  getAppIcon(options: { packageName: string }): Promise<{ result: string }>;
}

export type TalsecConfig = {
  androidConfig?: TalsecAndroidConfig;
  iosConfig?: TalsecIosConfig;
  watcherMail: string;
  isProd?: boolean;
  killOnBypass?: boolean;
};

export type TalsecAndroidConfig = {
  packageName: string;
  certificateHashes: string[];
  supportedAlternativeStores?: string[];
  suspiciousAppDetectionConfig?: SuspiciousAppDetectionConfig;
};

export type TalsecIosConfig = {
  appBundleId: string;
  appTeamId: string;
};

export type ScopeType =
  | 'SIDELOADED_ONLY'
  | 'SIDELOADED_AND_SYSTEM_EXCLUDE_OEM'
  | 'SIDELOADED_AND_OEM'
  | 'SIDELOADED_AND_SYSTEM_AND_OEM'
  | 'ALL';

export type ReasonMode = 'ALL' | 'HIGHEST_CONFIDENCE';

export type ScanScope = {
  scopeType: ScopeType;
  trustedInstallSources?: string[];
};

export type SuspiciousAppDetectionConfig = {
  packageNames?: string[];
  hashes?: string[];
  requestedPermissions?: string[][];
  grantedPermissions?: string[][];
  scanScope: ScanScope;
  reasonMode: ReasonMode;
};

export type SuspiciousAppInfo = {
  packageInfo: PackageInfo;
  reasons: string[];
  permissions?: string[];
};

export type PackageInfo = {
  packageName: string;
  appName?: string;
  version?: string;
  appIcon?: string;
  installerStore?: string;
};

/**
 * State of an ongoing call reported by the ongoing call detection.
 *
 * - `STARTED` - a call started while the detection was running
 * - `ONGOING` - a call was already in progress when the detection started
 * - `STOPPED` - a previously reported call has ended
 */
export type CallState = 'STARTED' | 'ONGOING' | 'STOPPED';

export type ThreatEventActions = {
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
  screenshot?: () => any;
  screenRecording?: () => any;
  multiInstance?: () => any;
  timeSpoofing?: () => any;
  locationSpoofing?: () => any;
  unsecureWifi?: () => any;
  automation?: () => any;
  bootloader?: () => any;
  /**
   * Android only. Requires `startOngoingCallDetection()`.
   */
  ongoingCall?: (state: CallState) => any;
};

export type NativeEvent = { [key: string]: number | string | string[] | undefined };

export type RaspExecutionStateEventActions = {
  /**
   * All standard checks have been completed. On Android, triggered after the
   * fast checks are completed, while the postponed checks still run.
   */
  allChecksFinished?: () => any;
  /**
   * Android only. The critical checks have been completed, before the
   * non-critical checks.
   */
  criticalChecksFinished?: () => any;
  /**
   * Android only. The postponed checks have been completed, which ends the
   * initial evaluation.
   */
  postponedChecksFinished?: () => any;
};
