import { onInvalidCallback } from '../api/methods/native';
import { Talsec } from '../api/nativeModules';
import { RaspExecutionState } from '../models/raspExecutionState';
import { getRaspExecutionStateCount, itemsHaveType } from '../utils/utils';
export const getRaspExecutionStateIdentifiers = async () => {
    const { ids } = await Talsec.getRaspExecutionStateIdentifiers();
    if (ids.length !== getRaspExecutionStateCount() || !itemsHaveType(ids, 'number')) {
        onInvalidCallback();
    }
    return ids;
};
export const getRaspExecutionStateChannelData = async () => {
    const dataLength = 2;
    const { ids } = await Talsec.getRaspExecutionStateChannelData();
    if (ids.length !== dataLength || !itemsHaveType(ids, 'string')) {
        onInvalidCallback();
    }
    return ids;
};
export const prepareRaspExecutionStateMapping = async () => {
    const newValues = await getRaspExecutionStateIdentifiers();
    const threats = RaspExecutionState.getValues();
    threats.map((threat, index) => {
        threat.value = newValues[index];
    });
};
//# sourceMappingURL=raspExecutionState.js.map