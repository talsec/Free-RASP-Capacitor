export declare const addToWhitelist: (packageName: string) => Promise<boolean>;
export declare const blockScreenCapture: (enable: boolean) => Promise<boolean>;
export declare const isScreenCaptureBlocked: () => Promise<boolean>;
export declare const storeExternalId: (data: string) => Promise<boolean>;
export declare const removeExternalId: () => Promise<boolean>;
export declare const getAppIcon: (packageName: string) => Promise<string>;
export declare const onInvalidCallback: () => void;
