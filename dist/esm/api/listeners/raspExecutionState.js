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
export const removeRaspExecutionStateListener = async () => {
    if (!eventsListener || !executionStateChannel) {
        return;
    }
    await eventsListener.remove();
    eventsListener = null;
    await Talsec.removeListenerForEvent({ eventName: executionStateChannel });
};
//# sourceMappingURL=raspExecutionState.js.map