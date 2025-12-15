import { onInvalidCallback } from '../methods/native';
import { Threat } from '../../models/threat';
import { parseMalwareData } from '../../utils/malware';
import { getThreatChannelData, prepareThreatMapping, } from '../../channels/threat';
import { Talsec } from '../nativeModules';
export const registerThreatListener = async (config) => {
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
//# sourceMappingURL=threat.js.map