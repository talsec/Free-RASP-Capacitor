/**
 * The only error type rejected by the freeRASP API.
 */
export class TalsecError extends Error {
    constructor(code, message) {
        super(message);
        this.name = 'TalsecError';
        this.code = code;
        Object.setPrototypeOf(this, TalsecError.prototype);
    }
}
/**
 * Runs a native call and rethrows any failure as a {@link TalsecError}.
 */
export const wrapNative = async (code, fn) => {
    var _a;
    try {
        return await fn();
    }
    catch (e) {
        if (e instanceof TalsecError) {
            throw e;
        }
        throw new TalsecError(code, (_a = e === null || e === void 0 ? void 0 : e.message) !== null && _a !== void 0 ? _a : String(e));
    }
};
/**
 * Rejects calls of Android-only features on iOS.
 */
export const unsupportedOnIos = (feature) => new TalsecError('unsupported-platform', `${feature} is not available on iOS`);
//# sourceMappingURL=errors.js.map