import { TalsecConfig, ThreatEventActions, RaspExecutionStateEventActions } from '../../types/types';
export declare const startFreeRASP: (config: TalsecConfig, actions: ThreatEventActions, raspExecutionStateActions?: RaspExecutionStateEventActions) => Promise<{
    started: boolean;
}>;
