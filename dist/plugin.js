var capacitorFreerasp = (function (exports, core) {
    'use strict';

    const Talsec = core.registerPlugin('Freerasp', {});

    const addToWhitelist = async (packageName) => {
        if (core.Capacitor.getPlatform() === 'ios') {
            return Promise.reject('Malware detection is not available on iOS');
        }
        const { result } = await Talsec.addToWhitelist({ packageName });
        return result;
    };
    const blockScreenCapture = async (enable) => {
        const { result } = await Talsec.blockScreenCapture({ enable });
        return result;
    };
    const isScreenCaptureBlocked = async () => {
        const { result } = await Talsec.isScreenCaptureBlocked();
        return result;
    };
    const storeExternalId = async (data) => {
        const { result } = await Talsec.storeExternalId({ data });
        return result;
    };
    const removeExternalId = async () => {
        const { result } = await Talsec.removeExternalId();
        return result;
    };
    const getAppIcon = async (packageName) => {
        if (core.Capacitor.getPlatform() === 'ios') {
            return Promise.reject('App icon retrieval for Malware detection is not available on iOS');
        }
        const { result } = await Talsec.getAppIcon({ packageName });
        return result;
    };
    const onInvalidCallback = () => {
        Talsec.onInvalidCallback();
    };

    class Threat {
        constructor(value) {
            this.value = value;
        }
        static getValues() {
            return core.Capacitor.getPlatform() === 'android'
                ? [
                    this.AppIntegrity,
                    this.PrivilegedAccess,
                    this.Debug,
                    this.Hooks,
                    this.Passcode,
                    this.Simulator,
                    this.SecureHardwareNotAvailable,
                    this.SystemVPN,
                    this.DeviceBinding,
                    this.UnofficialStore,
                    this.ObfuscationIssues,
                    this.DevMode,
                    this.Malware,
                    this.ADBEnabled,
                    this.Screenshot,
                    this.ScreenRecording,
                    this.MultiInstance,
                    this.TimeSpoofing,
                    this.LocationSpoofing,
                    this.UnsecureWifi,
                    this.Automation,
                ]
                : [
                    this.AppIntegrity,
                    this.PrivilegedAccess,
                    this.Debug,
                    this.Hooks,
                    this.Passcode,
                    this.Simulator,
                    this.SecureHardwareNotAvailable,
                    this.SystemVPN,
                    this.DeviceBinding,
                    this.DeviceID,
                    this.UnofficialStore,
                    this.Screenshot,
                    this.ScreenRecording,
                    this.TimeSpoofing,
                ];
        }
    }
    Threat.AppIntegrity = new Threat(0);
    Threat.PrivilegedAccess = new Threat(0);
    Threat.Debug = new Threat(0);
    Threat.Hooks = new Threat(0);
    Threat.Passcode = new Threat(0);
    Threat.Simulator = new Threat(0);
    Threat.SecureHardwareNotAvailable = new Threat(0);
    Threat.SystemVPN = new Threat(0);
    Threat.DeviceBinding = new Threat(0);
    Threat.DeviceID = new Threat(0);
    Threat.UnofficialStore = new Threat(0);
    Threat.ObfuscationIssues = new Threat(0);
    Threat.DevMode = new Threat(0);
    Threat.Malware = new Threat(0);
    Threat.ADBEnabled = new Threat(0);
    Threat.Screenshot = new Threat(0);
    Threat.ScreenRecording = new Threat(0);
    Threat.MultiInstance = new Threat(0);
    Threat.TimeSpoofing = new Threat(0);
    Threat.LocationSpoofing = new Threat(0);
    Threat.UnsecureWifi = new Threat(0);
    Threat.Automation = new Threat(0);

    class RaspExecutionState {
        constructor(value) {
            this.value = value;
        }
        static getValues() {
            return [this.AllChecksFinished];
        }
    }
    RaspExecutionState.AllChecksFinished = new RaspExecutionState(0);

    const getThreatCount = () => {
        return Threat.getValues().length;
    };
    const getRaspExecutionStateCount = () => {
        return RaspExecutionState.getValues().length;
    };
    const itemsHaveType = (data, expectedType) => {
        return data.every((item) => typeof item === expectedType);
    };

    const getThreatIdentifiers = async () => {
        const { ids } = await Talsec.getThreatIdentifiers();
        if (ids.length !== getThreatCount() || !itemsHaveType(ids, 'number')) {
            onInvalidCallback();
        }
        return ids;
    };
    const getThreatChannelData = async () => {
        const { ids } = await Talsec.getThreatChannelData();
        if (ids.length !== 3 || !itemsHaveType(ids, 'string')) {
            onInvalidCallback();
        }
        return ids;
    };
    const prepareThreatMapping = async () => {
        const newValues = await getThreatIdentifiers();
        const threats = Threat.getValues();
        try {
            threats.map((threat, index) => {
                threat.value = newValues[index];
            });
        }
        catch (err) {
            console.error('Could not map Talsec threats', err);
        }
    };

    // parses base64-encoded malware data to SuspiciousAppInfo[]
    const parseMalwareData = async (data) => {
        return new Promise((resolve, reject) => {
            try {
                const suspiciousAppData = data.map((entry) => toSuspiciousAppInfo(entry));
                resolve(suspiciousAppData);
            }
            catch (error) {
                reject(`Parsing app data failed: ${error}`);
            }
        });
    };
    const toSuspiciousAppInfo = (base64Value) => {
        const data = JSON.parse(atob(base64Value));
        const packageInfo = data.packageInfo;
        return {
            packageInfo,
            reason: data.reason,
            permissions: data.permissions,
        };
    };

    let eventsListener$1 = null;
    let threatChannel = null;
    let threatKey = null;
    let threatMalwareKey = null;
    let isInitializing$1 = false;
    let isMappingPrepared$1 = false;
    const registerThreatListener = async (config) => {
        if (isInitializing$1) {
            return;
        }
        isInitializing$1 = true;
        await removeThreatListener();
        if (!threatChannel || !threatKey || !threatMalwareKey) {
            [threatChannel, threatKey, threatMalwareKey] = await getThreatChannelData();
        }
        if (!isMappingPrepared$1) {
            await prepareThreatMapping();
            isMappingPrepared$1 = true;
        }
        if (!threatChannel) {
            onInvalidCallback();
            return;
        }
        eventsListener$1 = await Talsec.addListener(threatChannel, async (event) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
            if (!threatKey || !threatMalwareKey) {
                onInvalidCallback();
                return;
            }
            switch (event[threatKey]) {
                case Threat.PrivilegedAccess.value:
                    (_a = config.privilegedAccess) === null || _a === void 0 ? void 0 : _a.call(config);
                    break;
                case Threat.Debug.value:
                    (_b = config.debug) === null || _b === void 0 ? void 0 : _b.call(config);
                    break;
                case Threat.Simulator.value:
                    (_c = config.simulator) === null || _c === void 0 ? void 0 : _c.call(config);
                    break;
                case Threat.AppIntegrity.value:
                    (_d = config.appIntegrity) === null || _d === void 0 ? void 0 : _d.call(config);
                    break;
                case Threat.UnofficialStore.value:
                    (_e = config.unofficialStore) === null || _e === void 0 ? void 0 : _e.call(config);
                    break;
                case Threat.Hooks.value:
                    (_f = config.hooks) === null || _f === void 0 ? void 0 : _f.call(config);
                    break;
                case Threat.DeviceBinding.value:
                    (_g = config.deviceBinding) === null || _g === void 0 ? void 0 : _g.call(config);
                    break;
                case Threat.Passcode.value:
                    (_h = config.passcode) === null || _h === void 0 ? void 0 : _h.call(config);
                    break;
                case Threat.SecureHardwareNotAvailable.value:
                    (_j = config.secureHardwareNotAvailable) === null || _j === void 0 ? void 0 : _j.call(config);
                    break;
                case Threat.ObfuscationIssues.value:
                    (_k = config.obfuscationIssues) === null || _k === void 0 ? void 0 : _k.call(config);
                    break;
                case Threat.DeviceID.value:
                    (_l = config.deviceID) === null || _l === void 0 ? void 0 : _l.call(config);
                    break;
                case Threat.DevMode.value:
                    (_m = config.devMode) === null || _m === void 0 ? void 0 : _m.call(config);
                    break;
                case Threat.SystemVPN.value:
                    (_o = config.systemVPN) === null || _o === void 0 ? void 0 : _o.call(config);
                    break;
                case Threat.Malware.value:
                    (_p = config.malware) === null || _p === void 0 ? void 0 : _p.call(config, await parseMalwareData(event[threatMalwareKey]));
                    break;
                case Threat.ADBEnabled.value:
                    (_q = config.adbEnabled) === null || _q === void 0 ? void 0 : _q.call(config);
                    break;
                case Threat.Screenshot.value:
                    (_r = config.screenshot) === null || _r === void 0 ? void 0 : _r.call(config);
                    break;
                case Threat.ScreenRecording.value:
                    (_s = config.screenRecording) === null || _s === void 0 ? void 0 : _s.call(config);
                    break;
                case Threat.MultiInstance.value:
                    (_t = config.multiInstance) === null || _t === void 0 ? void 0 : _t.call(config);
                    break;
                case Threat.TimeSpoofing.value:
                    (_u = config.timeSpoofing) === null || _u === void 0 ? void 0 : _u.call(config);
                    break;
                case Threat.LocationSpoofing.value:
                    (_v = config.locationSpoofing) === null || _v === void 0 ? void 0 : _v.call(config);
                    break;
                case Threat.UnsecureWifi.value:
                    (_w = config.unsecureWifi) === null || _w === void 0 ? void 0 : _w.call(config);
                    break;
                case Threat.Automation.value:
                    (_x = config.automation) === null || _x === void 0 ? void 0 : _x.call(config);
                    break;
                default:
                    onInvalidCallback();
                    break;
            }
        });
        isInitializing$1 = false;
    };
    const removeThreatListener = async () => {
        if (!eventsListener$1 || !threatChannel) {
            return;
        }
        await eventsListener$1.remove();
        eventsListener$1 = null;
        await Talsec.removeListenerForEvent({ eventName: threatChannel });
    };

    const getRaspExecutionStateIdentifiers = async () => {
        const { ids } = await Talsec.getRaspExecutionStateIdentifiers();
        if (ids.length !== getRaspExecutionStateCount() || !itemsHaveType(ids, 'number')) {
            onInvalidCallback();
        }
        return ids;
    };
    const getRaspExecutionStateChannelData = async () => {
        const dataLength = 2;
        const { ids } = await Talsec.getRaspExecutionStateChannelData();
        if (ids.length !== dataLength || !itemsHaveType(ids, 'string')) {
            onInvalidCallback();
        }
        return ids;
    };
    const prepareRaspExecutionStateMapping = async () => {
        const newValues = await getRaspExecutionStateIdentifiers();
        const threats = RaspExecutionState.getValues();
        threats.map((threat, index) => {
            threat.value = newValues[index];
        });
    };

    let eventsListener = null;
    let executionStateChannel = null;
    let executionStateKey = null;
    let isInitializing = false;
    let isMappingPrepared = false;
    const registerRaspExecutionStateListener = async (config) => {
        if (isInitializing) {
            return;
        }
        isInitializing = true;
        await removeRaspExecutionStateListener();
        if (!executionStateChannel || !executionStateKey) {
            [executionStateChannel, executionStateKey] = await getRaspExecutionStateChannelData();
        }
        if (!isMappingPrepared) {
            await prepareRaspExecutionStateMapping();
            isMappingPrepared = true;
        }
        if (!executionStateChannel) {
            onInvalidCallback();
            return;
        }
        eventsListener = await Talsec.addListener(executionStateChannel, async (event) => {
            var _a;
            if (!executionStateKey) {
                onInvalidCallback();
                return;
            }
            switch (event[executionStateKey]) {
                case RaspExecutionState.AllChecksFinished.value:
                    (_a = config.allChecksFinished) === null || _a === void 0 ? void 0 : _a.call(config);
                    break;
                default:
                    onInvalidCallback();
                    break;
            }
        });
        isInitializing = false;
    };
    const removeRaspExecutionStateListener = async () => {
        if (!eventsListener || !executionStateChannel) {
            return;
        }
        await eventsListener.remove();
        eventsListener = null;
        await Talsec.removeListenerForEvent({ eventName: executionStateChannel });
    };

    let isRaspStarted = false;
    const startFreeRASP = async (config, actions, raspExecutionStateActions) => {
        await registerThreatListener(actions);
        if (raspExecutionStateActions) {
            await registerRaspExecutionStateListener(raspExecutionStateActions);
        }
        if (isRaspStarted) {
            return { started: true };
        }
        const response = await Talsec.talsecStart({ config });
        isRaspStarted = true;
        return response;
    };

    exports.abortApp = onInvalidCallback;
    exports.addToWhitelist = addToWhitelist;
    exports.blockScreenCapture = blockScreenCapture;
    exports.getAppIcon = getAppIcon;
    exports.isScreenCaptureBlocked = isScreenCaptureBlocked;
    exports.onInvalidCallback = onInvalidCallback;
    exports.registerRaspExecutionStateListener = registerRaspExecutionStateListener;
    exports.registerThreatListener = registerThreatListener;
    exports.removeExternalId = removeExternalId;
    exports.removeRaspExecutionStateListener = removeRaspExecutionStateListener;
    exports.removeThreatListener = removeThreatListener;
    exports.startFreeRASP = startFreeRASP;
    exports.storeExternalId = storeExternalId;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, capacitorExports);
//# sourceMappingURL=plugin.js.map
