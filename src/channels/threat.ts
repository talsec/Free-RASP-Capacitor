import { getThreatCount, itemsHaveType } from '../utils/utils';
import { Threat } from '../models/threat';
import { onInvalidCallback } from '../api/methods/native';
import { Talsec } from '../api/nativeModules';
import { Capacitor } from '@capacitor/core';

export const getThreatIdentifiers = async() : Promise<number[]> => {
    const { ids } = await Talsec.getThreatIdentifiers();
    if(
        ids.length !== getThreatCount() ||
        !itemsHaveType(ids, 'number')
    ) {
        console.error(`Threat count mismatch: Native ${ids.length} vs JS ${getThreatCount()}. Items are numbers: ${itemsHaveType(ids, 'number')}`);
        // onInvalidCallback();
    }
    return ids;
};

export const getThreatChannelData = async () : Promise<[string, string, string]> => {
    const dataLength = Capacitor.getPlatform() === 'ios' ? 2 : 3;
    const { ids } = await Talsec.getThreatChannelData();
    if(
        ids.length !== dataLength ||
        !itemsHaveType(ids, 'string')
    ) {
        onInvalidCallback();
    }
    return ids;
};

export const prepareThreatMapping = async (): Promise<void> => {
    const newValues = await getThreatIdentifiers();
    const threats = Threat.getValues();

    try {
        threats.map((threat, index) => {
            threat.value = newValues[index];
        });
    } catch (err) {
        console.error('Could not map Talsec threats', err);

    }
};
