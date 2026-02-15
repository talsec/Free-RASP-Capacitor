import type { PluginListenerHandle } from '@capacitor/core';

import { getRaspExecutionStateChannelData, prepareRaspExecutionStateMapping } from '../../channels/raspExecutionState';
import { RaspExecutionState } from '../../models/raspExecutionState';
import type { RaspExecutionStateEventActions } from '../../types/types';
import { onInvalidCallback } from '../methods/native';
import { Talsec } from '../nativeModules';

let eventsListener: PluginListenerHandle | null = null;
let isInitializing = false;

export const registerRaspExecutionStateListener = async (config: RaspExecutionStateEventActions): Promise<void> => {
  if (isInitializing) {
    return;
  }
  isInitializing = true;

  if (eventsListener) {
    await eventsListener.remove();
    eventsListener = null;
  }

  const [channel, key] = await getRaspExecutionStateChannelData();
  await prepareRaspExecutionStateMapping();

  eventsListener = await Talsec.addListener(channel, async (event: any) => {
    if (event[key] == undefined) {
      onInvalidCallback();
    }
    switch (event[key]) {
      case RaspExecutionState.AllChecksFinished.value:
        config.allChecksFinished?.();
        break;
      default:
        onInvalidCallback();
        break;
    }
  });
  isInitializing = false;
};

export const removeRaspExecutionStateListener = async (): Promise<void> => {
  if (eventsListener) {
    await eventsListener.remove();
    eventsListener = null;
  }
};
