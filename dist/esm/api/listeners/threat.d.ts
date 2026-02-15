import type { ThreatEventActions } from '../../types/types';
export declare const registerThreatListener: (config: ThreatEventActions) => Promise<void>;
export declare const removeThreatListener: () => Promise<void>;
