export interface TalsecPlugin {
    talsecStart(options: {
        config: TalsecConfig;
    }): Promise<{
        started: boolean;
    }>;
    addListener(listner: string, callback: any): any;
    onInvalidCallback(): void;
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
export declare type TalsecConfig = {
    androidConfig?: TalsecAndroidConfig;
    iosConfig?: TalsecIosConfig;
    watcherMail: string;
    isProd?: boolean;
    killOnBypass?: boolean;
};
export declare type TalsecAndroidConfig = {
    packageName: string;
    certificateHashes: string[];
    supportedAlternativeStores?: string[];
    malwareConfig?: TalsecMalwareConfig;
};
export declare type TalsecIosConfig = {
    appBundleId: string;
    appTeamId: string;
};
export declare type TalsecMalwareConfig = {
    blacklistedHashes?: string[];
    blacklistedPackageNames?: string[];
    suspiciousPermissions?: string[][];
    whitelistedInstallationSources?: string[];
};
export declare type SuspiciousAppInfo = {
    packageInfo: PackageInfo;
    reason: string;
    permissions?: string[];
};
export declare type PackageInfo = {
    packageName: string;
    appName?: string;
    version?: string;
    appIcon?: string;
    installerStore?: string;
};
export declare type ThreatEventActions = {
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
};
export declare type NativeEvent = {
    [key: string]: number | string[] | undefined;
};
export declare type RaspExecutionStateEventActions = {
    allChecksFinished?: () => any;
};
