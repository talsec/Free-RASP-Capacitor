/**
 * Android only. Adds an app to the malware whitelist, so it isn't reported as malware.
 */
export declare const addToWhitelist: (packageName: string) => Promise<void>;
/**
 * Blocks or unblocks screen capture of the app screen.
 */
export declare const blockScreenCapture: (enable: boolean) => Promise<void>;
/**
 * Returns whether screen capture of the app screen is blocked.
 */
export declare const isScreenCaptureBlocked: () => Promise<boolean>;
/**
 * Android only. Prevents accessibility services from reading or controlling
 * the app screen.
 */
export declare const blockScreenControl: (enable: boolean) => Promise<void>;
/**
 * Android only. Returns whether screen control is blocked.
 */
export declare const isScreenControlBlocked: () => Promise<boolean>;
/**
 * Android only. Hides overlay windows of other apps over the app screen.
 * Requires Android 12+ and the `HIDE_OVERLAY_WINDOWS` permission.
 *
 * @returns whether the request was applied
 */
export declare const blockOverlayWindows: (enable: boolean) => Promise<boolean>;
/**
 * Android only. Returns whether overlay windows of other apps are hidden.
 */
export declare const isOverlayWindowsBlocked: () => Promise<boolean>;
/**
 * Android only. Starts the ongoing call (cellular and VoIP) detection.
 * Call states are reported through the `ongoingCall` threat action.
 */
export declare const startOngoingCallDetection: () => Promise<void>;
/**
 * Android only. Stops the ongoing call detection.
 */
export declare const stopOngoingCallDetection: () => Promise<void>;
/**
 * Stores an external ID, sent to the backend with the security logs.
 */
export declare const storeExternalId: (data: string) => Promise<void>;
/**
 * Removes the stored external ID.
 */
export declare const removeExternalId: () => Promise<void>;
/**
 * Android only. Returns the app icon of the given package as a base64-encoded PNG.
 */
export declare const getAppIcon: (packageName: string) => Promise<string>;
