import type { TalsecConfig, ThreatEventActions, RaspExecutionStateEventActions } from '../../types/types';
import { registerRaspExecutionStateListener } from '../listeners/raspExecutionState';
import { registerThreatListener } from '../listeners/threat';
import { Talsec } from '../nativeModules';

let isRaspStarted = false;

export const startFreeRASP = async (
  config: TalsecConfig,
  actions: ThreatEventActions,
  raspExecutionStateActions?: RaspExecutionStateEventActions,
): Promise<{ started: boolean }> => {
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
