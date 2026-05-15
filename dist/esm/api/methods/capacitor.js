import { registerRaspExecutionStateListener } from '../listeners/raspExecutionState';
import { registerThreatListener } from '../listeners/threat';
import { Talsec } from '../nativeModules';
const DEFAULT_MALWARE_SCAN_SCOPE = {
    scanScope: 'SIDELOADED_ONLY',
};
const DEFAULT_REASON_MODE = 'HIGHEST_CONFIDENCE';
const withSuspiciousAppDetectionDefaults = (config) => {
    var _a, _b;
    return (Object.assign(Object.assign({}, config), { malwareScanScope: (_a = config.malwareScanScope) !== null && _a !== void 0 ? _a : DEFAULT_MALWARE_SCAN_SCOPE, reasonMode: (_b = config.reasonMode) !== null && _b !== void 0 ? _b : DEFAULT_REASON_MODE }));
};
const normalizeAndroidConfig = (androidConfig) => {
    if (!androidConfig.suspiciousAppDetectionConfig) {
        return androidConfig;
    }
    return Object.assign(Object.assign({}, androidConfig), { suspiciousAppDetectionConfig: withSuspiciousAppDetectionDefaults(androidConfig.suspiciousAppDetectionConfig) });
};
const normalizeConfig = (config) => {
    if (!config.androidConfig) {
        return config;
    }
    return Object.assign(Object.assign({}, config), { androidConfig: normalizeAndroidConfig(config.androidConfig) });
};
let isRaspStarted = false;
export const startFreeRASP = async (config, actions, raspExecutionStateActions) => {
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
//# sourceMappingURL=capacitor.js.map