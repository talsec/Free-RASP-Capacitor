import { Capacitor } from '@capacitor/core';

import { Talsec } from '../nativeModules';

export const addToWhitelist = async (packageName: string): Promise<boolean> => {
  if (Capacitor.getPlatform() === 'ios') {
    return Promise.reject('Malware detection is not available on iOS');
  }
  const { result } = await Talsec.addToWhitelist({ packageName });
  return result;
};

export const blockScreenCapture = async (enable: boolean): Promise<boolean> => {
  const { result } = await Talsec.blockScreenCapture({ enable });
  return result;
};

export const isScreenCaptureBlocked = async (): Promise<boolean> => {
  const { result } = await Talsec.isScreenCaptureBlocked();
  return result;
};

export const storeExternalId = async (data: string): Promise<boolean> => {
  const { result } = await Talsec.storeExternalId({ data });
  return result;
};

export const getAppIcon = async (packageName: string): Promise<string> => {
  if (Capacitor.getPlatform() === 'ios') {
    return Promise.reject('App icon retrieval for Malware detection is not available on iOS');
  }
  const { result } = await Talsec.getAppIcon({ packageName });
  return result;
};

export const onInvalidCallback = (): void => {
  Talsec.onInvalidCallback();
};
