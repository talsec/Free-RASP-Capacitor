import type { RaspExecutionStateEventActions } from '../../types/types';
export declare const registerRaspExecutionStateListener: (config: RaspExecutionStateEventActions) => Promise<void>;
export declare const removeRaspExecutionStateListener: () => Promise<void>;
