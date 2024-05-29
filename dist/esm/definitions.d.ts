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
        ids: [string, string];
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
};
export type IOSConfig = {
    appBundleId: string;
    appTeamId: string;
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
    constructor(value: number);
    static getValues(): Threat[];
}
