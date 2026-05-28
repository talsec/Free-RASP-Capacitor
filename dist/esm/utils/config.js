export const DEFAULT_SCAN_SCOPE = {
    scopeType: 'SIDELOADED_ONLY',
};
export const DEFAULT_REASON_MODE = 'HIGHEST_CONFIDENCE';
export const withDetectionDefaults = (config) => {
    var _a, _b;
    return (Object.assign(Object.assign({}, config), { scanScope: (_a = config.scanScope) !== null && _a !== void 0 ? _a : DEFAULT_SCAN_SCOPE, reasonMode: (_b = config.reasonMode) !== null && _b !== void 0 ? _b : DEFAULT_REASON_MODE }));
};
export const normalizeAndroidConfig = (androidConfig) => {
    if (!androidConfig.suspiciousAppDetectionConfig) {
        return androidConfig;
    }
    return Object.assign(Object.assign({}, androidConfig), { suspiciousAppDetectionConfig: withDetectionDefaults(androidConfig.suspiciousAppDetectionConfig) });
};
export const withDefaults = (config) => {
    if (!config.androidConfig) {
        return config;
    }
    return Object.assign(Object.assign({}, config), { androidConfig: normalizeAndroidConfig(config.androidConfig) });
};
//# sourceMappingURL=config.js.map