'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@capacitor/core');

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
        return core.Capacitor.getPlatform() === 'android' ? [
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

// parses base64-encoded malware data to SuspiciousAppInfo[]
const parseMalwareData = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            const suspiciousAppData = data.map(entry => toSuspiciousAppInfo(entry));
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

class RaspExecutionState {
    constructor(value) {
        this.value = value;
    }
    static getValues() {
        return [
            this.AllChecksFinished,
        ];
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
    return data.every(item => typeof item === expectedType);
};

const getThreatIdentifiers = async () => {
    const { ids } = await Talsec.getThreatIdentifiers();
    if (ids.length !== getThreatCount() ||
        !itemsHaveType(ids, 'number')) {
        console.error(`Threat count mismatch: Native ${ids.length} vs JS ${getThreatCount()}. Items are numbers: ${itemsHaveType(ids, 'number')}`);
        // onInvalidCallback();
    }
    return ids;
};
const getThreatChannelData = async () => {
    const dataLength = core.Capacitor.getPlatform() === 'ios' ? 2 : 3;
    const { ids } = await Talsec.getThreatChannelData();
    if (ids.length !== dataLength ||
        !itemsHaveType(ids, 'string')) {
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

const registerThreatListener = async (config) => {
    const [channel, key, malwareKey] = await getThreatChannelData();
    await prepareThreatMapping();
    await Talsec.addListener(channel, async (event) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        if (event[key] == undefined) {
            onInvalidCallback();
        }
        switch (event[key]) {
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
                (_p = config.malware) === null || _p === void 0 ? void 0 : _p.call(config, await parseMalwareData(event[malwareKey]));
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
            default:
                onInvalidCallback();
                break;
        }
    });
};

const getRaspExecutionStateIdentifiers = async () => {
    const { ids } = await Talsec.getRaspExecutionStateIdentifiers();
    if (ids.length !== getRaspExecutionStateCount() ||
        !itemsHaveType(ids, 'number')) {
        onInvalidCallback();
    }
    return ids;
};
const getRaspExecutionStateChannelData = async () => {
    const dataLength = 2;
    const { ids } = await Talsec.getRaspExecutionStateChannelData();
    if (ids.length !== dataLength ||
        !itemsHaveType(ids, 'string')) {
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

const registerRaspExecutionStateListener = async (config) => {
    const [channel, key] = await getRaspExecutionStateChannelData();
    await prepareRaspExecutionStateMapping();
    await Talsec.addListener(channel, async (event) => {
        var _a;
        if (event[key] == undefined) {
            onInvalidCallback();
        }
        switch (event[key]) {
            case RaspExecutionState.AllChecksFinished.value:
                (_a = config.allChecksFinished) === null || _a === void 0 ? void 0 : _a.call(config);
                break;
            default:
                onInvalidCallback();
                break;
        }
    });
};

const startFreeRASP = async (config, actions, raspExecutionStateActions) => {
    await registerThreatListener(actions);
    if (raspExecutionStateActions) {
        await registerRaspExecutionStateListener(raspExecutionStateActions);
    }
    return Talsec.talsecStart({ config });
};

exports.abortApp = onInvalidCallback;
exports.addToWhitelist = addToWhitelist;
exports.blockScreenCapture = blockScreenCapture;
exports.getAppIcon = getAppIcon;
exports.isScreenCaptureBlocked = isScreenCaptureBlocked;
exports.onInvalidCallback = onInvalidCallback;
exports.registerRaspExecutionStateListener = registerRaspExecutionStateListener;
exports.registerThreatListener = registerThreatListener;
exports.startFreeRASP = startFreeRASP;
exports.storeExternalId = storeExternalId;
//# sourceMappingURL=plugin.cjs.js.map
