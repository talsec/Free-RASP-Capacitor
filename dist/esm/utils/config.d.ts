import type { ScanScope, ReasonMode, SuspiciousAppDetectionConfig, TalsecAndroidConfig, TalsecConfig } from '../types/types';
export declare const DEFAULT_SCAN_SCOPE: ScanScope;
export declare const DEFAULT_REASON_MODE: ReasonMode;
export declare const withDetectionDefaults: (config: SuspiciousAppDetectionConfig) => SuspiciousAppDetectionConfig;
export declare const normalizeAndroidConfig: (androidConfig: TalsecAndroidConfig) => TalsecAndroidConfig;
export declare const withDefaults: (config: TalsecConfig) => TalsecConfig;
