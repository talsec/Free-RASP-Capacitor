import { wrapNative } from '../../errors';
import { withDefaults } from '../../utils/config';
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
        return;
    }
    await wrapNative('talsec-failure', () => Talsec.talsecStart({ config: withDefaults(config) }));
    isRaspStarted = true;
};
//# sourceMappingURL=capacitor.js.map