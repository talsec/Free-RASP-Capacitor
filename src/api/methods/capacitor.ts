import { Talsec } from '../nativeModules';
import { registerThreatListener } from '../listeners/threat';
import { registerRaspExecutionStateListener } from '../listeners/raspExecutionState';
import { TalsecConfig, ThreatEventActions, RaspExecutionStateEventActions } from '../../types/types';

export const startFreeRASP = async (config: TalsecConfig, actions: ThreatEventActions, raspExecutionStateActions?: RaspExecutionStateEventActions) => {
    await registerThreatListener(actions);
    if (raspExecutionStateActions) {
        await registerRaspExecutionStateListener(raspExecutionStateActions);
    }
    return Talsec.talsecStart({ config });
};
