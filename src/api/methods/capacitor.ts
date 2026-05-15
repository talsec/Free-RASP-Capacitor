import type {
  MalwareScanScope,
  ReasonMode,
  RaspExecutionStateEventActions,
  SuspiciousAppDetectionConfig,
  TalsecAndroidConfig,
  TalsecConfig,
  ThreatEventActions,
} from '../../types/types';
import { registerRaspExecutionStateListener } from '../listeners/raspExecutionState';
import { registerThreatListener } from '../listeners/threat';
import { Talsec } from '../nativeModules';

const DEFAULT_MALWARE_SCAN_SCOPE: MalwareScanScope = {
  scanScope: 'SIDELOADED_ONLY',
};
const DEFAULT_REASON_MODE: ReasonMode = 'HIGHEST_CONFIDENCE';

const withSuspiciousAppDetectionDefaults = (config: SuspiciousAppDetectionConfig): SuspiciousAppDetectionConfig => ({
  ...config,
  malwareScanScope: config.malwareScanScope ?? DEFAULT_MALWARE_SCAN_SCOPE,
  reasonMode: config.reasonMode ?? DEFAULT_REASON_MODE,
});

const normalizeAndroidConfig = (androidConfig: TalsecAndroidConfig): TalsecAndroidConfig => {
  if (!androidConfig.suspiciousAppDetectionConfig) {
    return androidConfig;
  }
  return {
    ...androidConfig,
    suspiciousAppDetectionConfig: withSuspiciousAppDetectionDefaults(androidConfig.suspiciousAppDetectionConfig),
  };
};

const normalizeConfig = (config: TalsecConfig): TalsecConfig => {
  if (!config.androidConfig) {
    return config;
  }
  return {
    ...config,
    androidConfig: normalizeAndroidConfig(config.androidConfig),
  };
};

let isRaspStarted = false;

export const startFreeRASP = async (
  config: TalsecConfig,
  actions: ThreatEventActions,
  raspExecutionStateActions?: RaspExecutionStateEventActions,
): Promise<{ started: boolean }> => {
  await registerThreatListener(actions);
  if (raspExecutionStateActions) {
    await registerRaspExecutionStateListener(raspExecutionStateActions);
  }
  if (isRaspStarted) {
    return { started: true };
  }

  const response = await Talsec.talsecStart({ config: normalizeConfig(config) });
  isRaspStarted = true;

  return response;
};
