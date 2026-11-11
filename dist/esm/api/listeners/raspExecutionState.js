import { getRaspExecutionStateChannelData, prepareRaspExecutionStateMapping } from '../../channels/raspExecutionState';
import { RaspExecutionState } from '../../models/raspExecutionState';
import { onInvalidCallback } from '../methods/native';
import { Talsec } from '../nativeModules';
let eventsListener = null;
let executionStateChannel = null;
let executionStateKey = null;
let isInitializing = false;
let isMappingPrepared = false;
export const registerRaspExecutionStateListener = async (config) => {
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
        var _a, _b, _c;
        if (!executionStateKey) {
            onInvalidCallback();
            return;
        }
        switch (event[executionStateKey]) {
            case RaspExecutionState.FastChecksFinished.value:
                (_a = config.fastChecksFinished) === null || _a === void 0 ? void 0 : _a.call(config);
                break;
            case RaspExecutionState.CriticalChecksFinished.value:
                (_b = config.criticalChecksFinished) === null || _b === void 0 ? void 0 : _b.call(config);
                break;
            case RaspExecutionState.PostponedChecksFinished.value:
                (_c = config.postponedChecksFinished) === null || _c === void 0 ? void 0 : _c.call(config);
                break;
            default:
                onInvalidCallback();
                break;
        }
    });
    isInitializing = false;
};
export const removeRaspExecutionStateListener = async () => {
    if (!eventsListener || !executionStateChannel) {
        return;
    }
    await eventsListener.remove();
    eventsListener = null;
    await Talsec.removeListenerForEvent({ eventName: executionStateChannel });
};
//# sourceMappingURL=raspExecutionState.js.map