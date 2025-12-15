import { onInvalidCallback } from './api/methods/native';
import { Talsec } from './api/nativeModules';
import { registerThreatListener } from './api/listeners/threat';
import { registerRaspExecutionStateListener } from './api/listeners/raspExecutionState';
import { TalsecConfig, ThreatEventActions, RaspExecutionStateEventActions } from './types/types';

export const startFreeRASP = async (config: TalsecConfig, actions: ThreatEventActions, raspExecutionStateActions?: RaspExecutionStateEventActions) => {
    await registerThreatListener(actions);
    if (raspExecutionStateActions) {
        await registerRaspExecutionStateListener(raspExecutionStateActions);
    }
    return Talsec.talsecStart({ config });
};

export * from './types/types';
export * from './api/methods/native';
export * from './api/listeners/threat';
export * from './api/listeners/raspExecutionState';
export { onInvalidCallback as abortApp};
