import { Talsec } from '../nativeModules';
/**
 * Terminates the app. Used when the native channel reports an unexpected callback.
 */
export const onInvalidCallback = () => {
    Talsec.onInvalidCallback();
};
//# sourceMappingURL=internal.js.map