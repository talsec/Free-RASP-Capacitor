import { onInvalidCallback } from '../methods/native';
import { RaspExecutionStateEventActions } from '../../types/types';
import {
    getRaspExecutionStateChannelData,
    prepareRaspExecutionStateMapping,
} from '../../channels/raspExecutionState';
import { Talsec } from '../nativeModules';

export const registerRaspExecutionStateListener = async(
    config: RaspExecutionStateEventActions,
) : Promise<void> => {
    const [channel, key] = await getRaspExecutionStateChannelData();
    await prepareRaspExecutionStateMapping();

    await Talsec.addListener(channel, async (event: any) => {
        if(event[key] == undefined) {
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
};
