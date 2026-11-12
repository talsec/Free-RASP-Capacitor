import { Capacitor } from '@capacitor/core';
import { TalsecError, unsupportedOnIos, wrapNative } from '../../errors';
import { Talsec } from '../nativeModules';
const isIos = () => Capacitor.getPlatform() === 'ios';
/**
 * Android only. Adds an app to the malware whitelist, so it isn't reported as malware.
 */
export const addToWhitelist = async (packageName) => {
    if (isIos()) {
        throw unsupportedOnIos('Malware detection');
    }
    await wrapNative('malware-failure', () => Talsec.addToWhitelist({ packageName }));
};
/**
 * Blocks or unblocks screen capture of the app screen.
 */
export const blockScreenCapture = async (enable) => {
    await wrapNative('talsec-failure', () => Talsec.blockScreenCapture({ enable }));
};
/**
 * Returns whether screen capture of the app screen is blocked.
 */
export const isScreenCaptureBlocked = async () => {
    const { result } = await wrapNative('talsec-failure', () => Talsec.isScreenCaptureBlocked());
    return result;
};
/**
 * Android only. Prevents accessibility services from reading or controlling
 * the app screen.
 */
export const blockScreenControl = async (enable) => {
    if (isIos()) {
        throw unsupportedOnIos('Screen control blocking');
    }
    await wrapNative('talsec-failure', () => Talsec.blockScreenControl({ enable }));
};
/**
 * Android only. Returns whether screen control is blocked.
 */
export const isScreenControlBlocked = async () => {
    if (isIos()) {
        throw unsupportedOnIos('Screen control blocking');
    }
    const { result } = await wrapNative('talsec-failure', () => Talsec.isScreenControlBlocked());
    return result;
};
/**
 * Android only. Hides overlay windows of other apps over the app screen.
 * Requires Android 12+ and the `HIDE_OVERLAY_WINDOWS` permission.
 *
 * @returns whether the request was applied
 */
export const blockOverlayWindows = async (enable) => {
    if (isIos()) {
        throw unsupportedOnIos('Overlay windows blocking');
    }
    const { result } = await wrapNative('talsec-failure', () => Talsec.blockOverlayWindows({ enable }));
    return result;
};
/**
 * Android only. Returns whether overlay windows of other apps are hidden.
 */
export const isOverlayWindowsBlocked = async () => {
    if (isIos()) {
        throw unsupportedOnIos('Overlay windows blocking');
    }
    const { result } = await wrapNative('talsec-failure', () => Talsec.isOverlayWindowsBlocked());
    return result;
};
/**
 * Android only. Starts the ongoing call (cellular and VoIP) detection.
 * Call states are reported through the `ongoingCall` threat action.
 */
export const startOngoingCallDetection = async () => {
    if (isIos()) {
        throw unsupportedOnIos('Ongoing call detection');
    }
    await wrapNative('talsec-failure', () => Talsec.startOngoingCallDetection());
};
/**
 * Android only. Stops the ongoing call detection.
 */
export const stopOngoingCallDetection = async () => {
    if (isIos()) {
        throw unsupportedOnIos('Ongoing call detection');
    }
    await wrapNative('talsec-failure', () => Talsec.stopOngoingCallDetection());
};
/**
 * Stores an external ID, sent to the backend with the security logs.
 */
export const storeExternalId = async (data) => {
    await wrapNative('external-id-failure', () => Talsec.storeExternalId({ data }));
};
/**
 * Removes the stored external ID.
 */
export const removeExternalId = async () => {
    await wrapNative('external-id-failure', () => Talsec.removeExternalId());
};
/**
 * Android only. Returns the app icon of the given package as a base64-encoded PNG.
 */
export const getAppIcon = async (packageName) => {
    if (isIos()) {
        throw unsupportedOnIos('App icon retrieval for malware detection');
    }
    const { result } = await wrapNative('malware-failure', () => Talsec.getAppIcon({ packageName }));
    if (typeof result !== 'string') {
        throw new TalsecError('malware-failure', 'App icon is not available');
    }
    return result;
};
//# sourceMappingURL=native.js.map