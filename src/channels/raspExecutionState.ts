import { getRaspExecutionStateCount, itemsHaveType } from '../utils/utils';
import { onInvalidCallback } from '../api/methods/native';
import { RaspExecutionState } from '../models/raspExecutionState';
import { Talsec } from '../api/nativeModules';

export const getRaspExecutionStateIdentifiers = async() : Promise<number[]> => {
    const { ids } = await Talsec.getRaspExecutionStateIdentifiers();
    if(
        ids.length !== getRaspExecutionStateCount() ||
        !itemsHaveType(ids, 'number')
    ) {
        onInvalidCallback();
    }
    return ids;
};

export const getRaspExecutionStateChannelData = async() : Promise<[string, string]> => {
    const dataLength = 2;
    const { ids } = await Talsec.getRaspExecutionStateChannelData();
    if(
        ids.length !== dataLength ||
        !itemsHaveType(ids, 'string')
    ) {
        onInvalidCallback();
    }
    return ids;
};

export const prepareRaspExecutionStateMapping = async (): Promise<void> => {
    const newValues = await getRaspExecutionStateIdentifiers();
    const threats = RaspExecutionState.getValues();
    threats.map((threat, index) => {
        threat.value = newValues[index]!;
    });
};