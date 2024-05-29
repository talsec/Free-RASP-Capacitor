import { registerPlugin } from '@capacitor/core';
import { Threat } from './definitions';
import { getThreatCount, itemsHaveType } from './utils';
const activeListeners = [];
const Freerasp = registerPlugin('Freerasp', {
    web: () => import('./web').then(m => new m.FreeraspWeb()),
});
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
    const { ids } = await Freerasp.getThreatChannelData();
    if (ids.length !== 2 || !itemsHaveType(ids, 'string')) {
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
const setThreatListeners = async (callbacks) => {
    const [channel, key] = await getThreatChannelData();
    await prepareMapping();
    await Freerasp.addListener(channel, (event) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
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
            default:
                onInvalidCallback();
                break;
        }
    });
};
const removeThreatListeners = () => {
    activeListeners.forEach((listener) => listener.remove());
};
const startFreeRASP = async (config, reactions) => {
    await setThreatListeners(reactions);
    const { started } = await Freerasp.talsecStart({ config });
    return started;
};
export * from './definitions';
export { Freerasp, startFreeRASP, setThreatListeners, removeThreatListeners };
//# sourceMappingURL=index.js.map