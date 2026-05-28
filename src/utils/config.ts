import type {
  ScanScope,
  ReasonMode,
  SuspiciousAppDetectionConfig,
  TalsecAndroidConfig,
  TalsecConfig,
} from '../types/types';

export const DEFAULT_SCAN_SCOPE: ScanScope = {
  scopeType: 'SIDELOADED_ONLY',
};
export const DEFAULT_REASON_MODE: ReasonMode = 'HIGHEST_CONFIDENCE';

export const withDetectionDefaults = (config: SuspiciousAppDetectionConfig): SuspiciousAppDetectionConfig => ({
  ...config,
  scanScope: config.scanScope ?? DEFAULT_SCAN_SCOPE,
  reasonMode: config.reasonMode ?? DEFAULT_REASON_MODE,
});

export const normalizeAndroidConfig = (androidConfig: TalsecAndroidConfig): TalsecAndroidConfig => {
  if (!androidConfig.suspiciousAppDetectionConfig) {
    return androidConfig;
  }
  return {
    ...androidConfig,
    suspiciousAppDetectionConfig: withDetectionDefaults(androidConfig.suspiciousAppDetectionConfig),
  };
};

export const withDefaults = (config: TalsecConfig): TalsecConfig => {
  if (!config.androidConfig) {
    return config;
  }
  return {
    ...config,
    androidConfig: normalizeAndroidConfig(config.androidConfig),
  };
};
