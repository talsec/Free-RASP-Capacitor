export interface TalsecPlugin {
    talsecStart(options: {
        config: TalsecConfig;
    }): Promise<{
        started: boolean;
    }>;
    addListener(listener: string, callback: any): any;
    onInvalidCallback(): void;
    removeListenerForEvent(options: {
        eventName: string;
    }): Promise<{
        result: string;
    }>;
    getThreatIdentifiers(): Promise<{
        ids: number[];
    }>;
    getThreatChannelData(): Promise<{
        ids: [string, string, string];
    }>;
    getRaspExecutionStateIdentifiers(): Promise<{
        ids: number[];
    }>;
    getRaspExecutionStateChannelData(): Promise<{
        ids: [string, string];
    }>;
    storeExternalId(options: {
        data: string;
    }): Promise<{
        result: boolean;
    }>;
    removeExternalId(): Promise<{
        result: boolean;
    }>;
    addToWhitelist(options: {
        packageName: string;
    }): Promise<{
        result: boolean;
    }>;
    blockScreenCapture(options: {
        enable: boolean;
    }): Promise<{
        result: boolean;
    }>;
    isScreenCaptureBlocked(): Promise<{
        result: boolean;
    }>;
    getAppIcon(options: {
        packageName: string;
    }): Promise<{
        result: string;
    }>;
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
    malwareConfig?: TalsecMalwareConfig;
};
export type TalsecIosConfig = {
    appBundleId: string;
    appTeamId: string;
};
export type TalsecMalwareConfig = {
    blacklistedHashes?: string[];
    blacklistedPackageNames?: string[];
    suspiciousPermissions?: string[][];
    whitelistedInstallationSources?: string[];
};
export type SuspiciousAppInfo = {
    packageInfo: PackageInfo;
    reason: string;
    permissions?: string[];
};
export type PackageInfo = {
    packageName: string;
    appName?: string;
    version?: string;
    appIcon?: string;
    installerStore?: string;
};
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
};
export type NativeEvent = {
    [key: string]: number | string[] | undefined;
};
export type RaspExecutionStateEventActions = {
    allChecksFinished?: () => any;
};
