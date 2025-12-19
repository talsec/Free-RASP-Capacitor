import { RaspExecutionState } from '../models/raspExecutionState';
import { Threat } from '../models/threat';
export const getThreatCount = () => {
    return Threat.getValues().length;
};
export const getRaspExecutionStateCount = () => {
    return RaspExecutionState.getValues().length;
};
export const itemsHaveType = (data, expectedType) => {
    return data.every((item) => typeof item === expectedType);
};
//# sourceMappingURL=utils.js.map