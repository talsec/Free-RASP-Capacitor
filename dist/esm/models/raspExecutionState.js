import { Capacitor } from '@capacitor/core';
export class RaspExecutionState {
    constructor(value) {
        this.value = value;
    }
    static getValues() {
        return Capacitor.getPlatform() === 'android'
            ? [this.FastChecksFinished, this.CriticalChecksFinished, this.PostponedChecksFinished]
            : [this.FastChecksFinished];
    }
}
RaspExecutionState.FastChecksFinished = new RaspExecutionState(0);
RaspExecutionState.CriticalChecksFinished = new RaspExecutionState(0);
RaspExecutionState.PostponedChecksFinished = new RaspExecutionState(0);
//# sourceMappingURL=raspExecutionState.js.map