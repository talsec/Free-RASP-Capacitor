import { Talsec } from '../nativeModules';
import { registerThreatListener } from '../listeners/threat';
import { registerRaspExecutionStateListener } from '../listeners/raspExecutionState';
export const startFreeRASP = async (config, actions, raspExecutionStateActions) => {
    await registerThreatListener(actions);
    if (raspExecutionStateActions) {
        await registerRaspExecutionStateListener(raspExecutionStateActions);
    }
    return Talsec.talsecStart({ config });
};
//# sourceMappingURL=capacitor.js.map