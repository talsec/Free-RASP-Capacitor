import { onInvalidCallback } from './api/methods/native';
import { TalsecConfig, ThreatEventActions, RaspExecutionStateEventActions } from './types/types';
export declare const startFreeRASP: (config: TalsecConfig, actions: ThreatEventActions, raspExecutionStateActions?: RaspExecutionStateEventActions | undefined) => Promise<{
    started: boolean;
}>;
export * from './types/types';
export * from './api/methods/native';
export * from './api/listeners/threat';
export * from './api/listeners/raspExecutionState';
export { onInvalidCallback as abortApp };
