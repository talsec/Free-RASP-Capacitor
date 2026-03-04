import type { PluginListenerHandle } from '@capacitor/core';

import { getRaspExecutionStateChannelData, prepareRaspExecutionStateMapping } from '../../channels/raspExecutionState';
import { RaspExecutionState } from '../../models/raspExecutionState';
import type { RaspExecutionStateEventActions } from '../../types/types';
import { onInvalidCallback } from '../methods/native';
import { Talsec } from '../nativeModules';

let eventsListener: PluginListenerHandle | null = null;
let executionStateChannel: string | null = null;
let executionStateKey: string | null = null;

let isInitializing = false;
let isMappingPrepared = false;

export const registerRaspExecutionStateListener = async (config: RaspExecutionStateEventActions): Promise<void> => {
  if (isInitializing) {
    return;
  }
  isInitializing = true;

  await removeRaspExecutionStateListener();

  if (!executionStateChannel || !executionStateKey) {
    [executionStateChannel, executionStateKey] = await getRaspExecutionStateChannelData();
  }

  if (!isMappingPrepared) {
    await prepareRaspExecutionStateMapping();
    isMappingPrepared = true;
  }

  if (!executionStateChannel) {
    onInvalidCallback();
    return;
  }

  eventsListener = await Talsec.addListener(executionStateChannel, async (event: any) => {
    if (!executionStateKey) {
      onInvalidCallback();
      return;
    }

    switch (event[executionStateKey]) {
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
  if (!eventsListener || !executionStateChannel) {
    return;
  }
  await eventsListener.remove();
  eventsListener = null;
  await Talsec.removeListenerForEvent({ eventName: executionStateChannel })
};
