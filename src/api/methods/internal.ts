import { Talsec } from '../nativeModules';

/**
 * Terminates the app. Used when the native channel reports an unexpected callback.
 */
export const onInvalidCallback = (): void => {
  Talsec.onInvalidCallback();
};
