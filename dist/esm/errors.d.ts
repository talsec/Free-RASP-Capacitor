/**
 * Error codes of {@link TalsecError}, shared with the other freeRASP plugins.
 */
export type TalsecErrorCode = 'talsec-failure' | 'unsupported-platform' | 'configuration-exception' | 'external-id-failure' | 'malware-failure';
/**
 * The only error type rejected by the freeRASP API.
 */
export declare class TalsecError extends Error {
    readonly code: TalsecErrorCode;
    constructor(code: TalsecErrorCode, message?: string);
}
/**
 * Runs a native call and rethrows any failure as a {@link TalsecError}.
 */
export declare const wrapNative: <T>(code: TalsecErrorCode, fn: () => Promise<T>) => Promise<T>;
/**
 * Rejects calls of Android-only features on iOS.
 */
export declare const unsupportedOnIos: (feature: string) => TalsecError;
