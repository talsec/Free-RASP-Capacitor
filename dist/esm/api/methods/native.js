import { Capacitor } from '@capacitor/core';
import { Talsec } from '../nativeModules';
export const addToWhitelist = async (packageName) => {
    if (Capacitor.getPlatform() === 'ios') {
        return Promise.reject('Malware detection is not available on iOS');
    }
    const { result } = await Talsec.addToWhitelist({ packageName });
    return result;
};
export const blockScreenCapture = async (enable) => {
    const { result } = await Talsec.blockScreenCapture({ enable });
    return result;
};
export const isScreenCaptureBlocked = async () => {
    const { result } = await Talsec.isScreenCaptureBlocked();
    return result;
};
const androidOnly = (feature) => Promise.reject(`${feature} is not available on iOS`);
/**
 * Android only. Prevents accessibility services from reading or controlling
 * the app screen.
 */
export const blockScreenControl = async (enable) => {
    if (Capacitor.getPlatform() === 'ios') {
        return androidOnly('Screen control blocking');
    }
    const { result } = await Talsec.blockScreenControl({ enable });
    return result;
};
/**
 * Android only. Returns whether screen control is blocked.
 */
export const isScreenControlBlocked = async () => {
    if (Capacitor.getPlatform() === 'ios') {
        return androidOnly('Screen control blocking');
    }
    const { result } = await Talsec.isScreenControlBlocked();
    return result;
};
/**
 * Android only. Hides overlay windows of other apps over the app screen.
 * Requires Android 12+ and the `HIDE_OVERLAY_WINDOWS` permission.
 *
 * @returns whether the request was applied
 */
export const blockOverlayWindows = async (enable) => {
    if (Capacitor.getPlatform() === 'ios') {
        return androidOnly('Overlay windows blocking');
    }
    const { result } = await Talsec.blockOverlayWindows({ enable });
    return result;
};
/**
 * Android only. Returns whether overlay windows of other apps are hidden.
 */
export const isOverlayWindowsBlocked = async () => {
    if (Capacitor.getPlatform() === 'ios') {
        return androidOnly('Overlay windows blocking');
    }
    const { result } = await Talsec.isOverlayWindowsBlocked();
    return result;
};
/**
 * Android only. Starts the ongoing call (cellular and VoIP) detection.
 * Call states are reported through the `ongoingCall` threat action.
 */
export const startOngoingCallDetection = async () => {
    if (Capacitor.getPlatform() === 'ios') {
        return androidOnly('Ongoing call detection');
    }
    const { result } = await Talsec.startOngoingCallDetection();
    return result;
};
/**
 * Android only. Stops the ongoing call detection.
 */
export const stopOngoingCallDetection = async () => {
    if (Capacitor.getPlatform() === 'ios') {
        return androidOnly('Ongoing call detection');
    }
    const { result } = await Talsec.stopOngoingCallDetection();
    return result;
};
export const storeExternalId = async (data) => {
    const { result } = await Talsec.storeExternalId({ data });
    return result;
};
export const removeExternalId = async () => {
    const { result } = await Talsec.removeExternalId();
    return result;
};
export const getAppIcon = async (packageName) => {
    if (Capacitor.getPlatform() === 'ios') {
        return Promise.reject('App icon retrieval for Malware detection is not available on iOS');
    }
    const { result } = await Talsec.getAppIcon({ packageName });
    return result;
};
export const onInvalidCallback = () => {
    Talsec.onInvalidCallback();
};
//# sourceMappingURL=native.js.map