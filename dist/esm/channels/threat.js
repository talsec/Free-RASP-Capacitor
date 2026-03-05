import { onInvalidCallback } from '../api/methods/native';
import { Talsec } from '../api/nativeModules';
import { Threat } from '../models/threat';
import { getThreatCount, itemsHaveType } from '../utils/utils';
export const getThreatIdentifiers = async () => {
    const { ids } = await Talsec.getThreatIdentifiers();
    if (ids.length !== getThreatCount() || !itemsHaveType(ids, 'number')) {
        onInvalidCallback();
    }
    return ids;
};
export const getThreatChannelData = async () => {
    const { ids } = await Talsec.getThreatChannelData();
    if (ids.length !== 3 || !itemsHaveType(ids, 'string')) {
        onInvalidCallback();
    }
    return ids;
};
export const prepareThreatMapping = async () => {
    const newValues = await getThreatIdentifiers();
    const threats = Threat.getValues();
    try {
        threats.map((threat, index) => {
            threat.value = newValues[index];
        });
    }
    catch (err) {
        console.error('Could not map Talsec threats', err);
    }
};
//# sourceMappingURL=threat.js.map