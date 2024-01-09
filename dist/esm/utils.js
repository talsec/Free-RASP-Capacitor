import { Threat } from './definitions';
export const getThreatCount = () => {
    return Threat.getValues().length;
};
export const itemsHaveType = (data, desiredType) => {
    return data.every(item => typeof item === desiredType);
};
//# sourceMappingURL=utils.js.map