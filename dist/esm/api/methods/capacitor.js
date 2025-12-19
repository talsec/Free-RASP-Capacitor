import { registerRaspExecutionStateListener } from '../listeners/raspExecutionState';
import { registerThreatListener } from '../listeners/threat';
import { Talsec } from '../nativeModules';
export const startFreeRASP = async (config, actions, raspExecutionStateActions) => {
    await registerThreatListener(actions);
    if (raspExecutionStateActions) {
        await registerRaspExecutionStateListener(raspExecutionStateActions);
    }
    return Talsec.talsecStart({ config });
};
//# sourceMappingURL=capacitor.js.map