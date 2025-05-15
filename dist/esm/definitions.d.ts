export interface FreeraspPlugin {
    addListener(listener: string, callback: (event: any) => void): any;
    talsecStart(options: {
        config: FreeraspConfig;
    }): Promise<{
        started: boolean;
    }>;
    onInvalidCallback(): void;
    getThreatIdentifiers(): Promise<{
        ids: number[];
    }>;
    getThreatChannelData(): Promise<{
        ids: [string, string, string];
    }>;
    addToWhitelist(options: {
        packageName: string;
    }): Promise<{
        result: boolean;
    }>;
    getAppIcon(options: {
        packageName: string;
    }): Promise<{
        result: string;
    }>;
    blockScreenCapture(options: {
        enable: boolean;
    }): Promise<{
        result: boolean;
    }>;
    isScreenCaptureBlocked(): Promise<{
        result: boolean;
    }>;
    storeExternalId(options: {
        data: string;
    }): Promise<{
        result: boolean;
    }>;
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
    screenshot?: () => any;
    screenRecording?: () => any;
};
export declare class Threat {
    value: number;
    static AppIntegrity: Threat;
    static PrivilegedAccess: Threat;
    static Debug: Threat;
    static Hooks: Threat;
    static Passcode: Threat;
    static Simulator: Threat;
    static SecureHardwareNotAvailable: Threat;
    static SystemVPN: Threat;
    static DeviceBinding: Threat;
    static DeviceID: Threat;
    static UnofficialStore: Threat;
    static Overlay: Threat;
    static ObfuscationIssues: Threat;
    static DevMode: Threat;
    static Malware: Threat;
    static ADBEnabled: Threat;
    static Screenshot: Threat;
    static ScreenRecording: Threat;
    constructor(value: number);
    static getValues(): Threat[];
}
