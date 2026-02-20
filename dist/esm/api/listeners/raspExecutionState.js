import { getRaspExecutionStateChannelData, prepareRaspExecutionStateMapping } from '../../channels/raspExecutionState';
import { RaspExecutionState } from '../../models/raspExecutionState';
import { onInvalidCallback } from '../methods/native';
import { Talsec } from '../nativeModules';
let eventsListener = null;
let isInitializing = false;
export const registerRaspExecutionStateListener = async (config) => {
    if (isInitializing) {
        return;
    }
    isInitializing = true;
    if (eventsListener) {
        await eventsListener.remove();
        eventsListener = null;
    }
    const [channel, key] = await getRaspExecutionStateChannelData();
    await prepareRaspExecutionStateMapping();
    eventsListener = await Talsec.addListener(channel, async (event) => {
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
    isInitializing = false;
};
export const removeRaspExecutionStateListener = async () => {
    if (eventsListener) {
        await eventsListener.remove();
        eventsListener = null;
    }
};
//# sourceMappingURL=raspExecutionState.js.map