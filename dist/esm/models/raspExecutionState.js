export class RaspExecutionState {
    constructor(value) {
        this.value = value;
    }
    static getValues() {
        return [
            this.AllChecksFinished,
        ];
    }
}
RaspExecutionState.AllChecksFinished = new RaspExecutionState(0);
//# sourceMappingURL=raspExecutionState.js.map