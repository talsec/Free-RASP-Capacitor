import { onInvalidCallback } from '../methods/native';
import { RaspExecutionState } from '../../models/raspExecutionState';
import { getRaspExecutionStateChannelData, prepareRaspExecutionStateMapping, } from '../../channels/raspExecutionState';
import { Talsec } from '../nativeModules';
export const registerRaspExecutionStateListener = async (config) => {
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
//# sourceMappingURL=raspExecutionState.js.map