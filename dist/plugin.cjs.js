'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@capacitor/core');

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
                this.Overlay,
                this.ObfuscationIssues,
                this.DevMode,
                this.Malware,
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
Threat.Overlay = new Threat(0);
Threat.ObfuscationIssues = new Threat(0);
Threat.DevMode = new Threat(0);
Threat.Malware = new Threat(0);

const getThreatCount = () => {
    return Threat.getValues().length;
};
const itemsHaveType = (data, desiredType) => {
    return data.every(item => typeof item === desiredType);
};

const activeListeners = [];
const Freerasp = core.registerPlugin('Freerasp', {});
const onInvalidCallback = () => {
    Freerasp.onInvalidCallback();
};
const getThreatIdentifiers = async () => {
    const { ids } = await Freerasp.getThreatIdentifiers();
    if (ids.length !== getThreatCount() || !itemsHaveType(ids, 'number')) {
        onInvalidCallback();
    }
    return ids;
};
const getThreatChannelData = async () => {
    const dataLength = core.Capacitor.getPlatform() === 'ios' ? 2 : 3;
    const { ids } = await Freerasp.getThreatChannelData();
    if (ids.length !== dataLength || !itemsHaveType(ids, 'string')) {
        onInvalidCallback();
    }
    return ids;
};
const prepareMapping = async () => {
    const newValues = await getThreatIdentifiers();
    const threats = Threat.getValues();
    threats.map((threat, index) => {
        threat.value = newValues[index];
    });
};
// parses base64-encoded malware data to SuspiciousAppInfo[]
const parseMalwareData = (data) => {
    return data.map(entry => toSuspiciousAppInfo(entry));
};
const toSuspiciousAppInfo = (base64Value) => {
    const data = JSON.parse(atob(base64Value));
    const packageInfo = data.packageInfo;
    return { packageInfo, reason: data.reason };
};
const setThreatListeners = async (callbacks) => {
    const [channel, key, malwareKey] = await getThreatChannelData();
    await prepareMapping();
    await Freerasp.addListener(channel, (event) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        if (event[key] === undefined) {
            onInvalidCallback();
        }
        switch (event[key]) {
            case Threat.PrivilegedAccess.value:
                (_a = callbacks.privilegedAccess) === null || _a === void 0 ? void 0 : _a.call(callbacks);
                break;
            case Threat.Debug.value:
                (_b = callbacks.debug) === null || _b === void 0 ? void 0 : _b.call(callbacks);
                break;
            case Threat.Simulator.value:
                (_c = callbacks.simulator) === null || _c === void 0 ? void 0 : _c.call(callbacks);
                break;
            case Threat.AppIntegrity.value:
                (_d = callbacks.appIntegrity) === null || _d === void 0 ? void 0 : _d.call(callbacks);
                break;
            case Threat.UnofficialStore.value:
                (_e = callbacks.unofficialStore) === null || _e === void 0 ? void 0 : _e.call(callbacks);
                break;
            case Threat.Hooks.value:
                (_f = callbacks.hooks) === null || _f === void 0 ? void 0 : _f.call(callbacks);
                break;
            case Threat.DeviceBinding.value:
                (_g = callbacks.deviceBinding) === null || _g === void 0 ? void 0 : _g.call(callbacks);
                break;
            case Threat.Passcode.value:
                (_h = callbacks.passcode) === null || _h === void 0 ? void 0 : _h.call(callbacks);
                break;
            case Threat.SecureHardwareNotAvailable.value:
                (_j = callbacks.secureHardwareNotAvailable) === null || _j === void 0 ? void 0 : _j.call(callbacks);
                break;
            case Threat.ObfuscationIssues.value:
                (_k = callbacks.obfuscationIssues) === null || _k === void 0 ? void 0 : _k.call(callbacks);
                break;
            case Threat.DeviceID.value:
                (_l = callbacks.deviceID) === null || _l === void 0 ? void 0 : _l.call(callbacks);
                break;
            case Threat.DevMode.value:
                (_m = callbacks.devMode) === null || _m === void 0 ? void 0 : _m.call(callbacks);
                break;
            case Threat.SystemVPN.value:
                (_o = callbacks.systemVPN) === null || _o === void 0 ? void 0 : _o.call(callbacks);
                break;
            case Threat.Malware.value:
                (_p = callbacks.malware) === null || _p === void 0 ? void 0 : _p.call(callbacks, parseMalwareData(event[malwareKey]));
                break;
            default:
                onInvalidCallback();
                break;
        }
    });
};
const removeThreatListeners = () => {
    activeListeners.forEach(listener => listener.remove());
};
const startFreeRASP = async (config, reactions) => {
    await setThreatListeners(reactions);
    try {
        const { started } = await Freerasp.talsecStart({ config });
        return started;
    }
    catch (e) {
        console.error(`${e.code}: ${e.message}`);
        return Promise.reject(`${e.code}: ${e.message}`);
    }
};
const addToWhitelist = async (packageName) => {
    if (core.Capacitor.getPlatform() === 'ios') {
        return Promise.reject('Malware detection not available on iOS');
    }
    const { result } = await Freerasp.addToWhitelist({ packageName });
    return result;
};

exports.Freerasp = Freerasp;
exports.Threat = Threat;
exports.addToWhitelist = addToWhitelist;
exports.removeThreatListeners = removeThreatListeners;
exports.setThreatListeners = setThreatListeners;
exports.startFreeRASP = startFreeRASP;
//# sourceMappingURL=plugin.cjs.js.map
