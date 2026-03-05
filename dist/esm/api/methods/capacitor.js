import { registerRaspExecutionStateListener } from '../listeners/raspExecutionState';
import { registerThreatListener } from '../listeners/threat';
import { Talsec } from '../nativeModules';
let isRaspStarted = false;
export const startFreeRASP = async (config, actions, raspExecutionStateActions) => {
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
//# sourceMappingURL=capacitor.js.map