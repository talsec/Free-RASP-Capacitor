/**
 * Error codes of {@link TalsecError}, shared with the other freeRASP plugins.
 */
export type TalsecErrorCode =
  | 'talsec-failure'
  | 'unsupported-platform'
  | 'configuration-exception'
  | 'external-id-failure'
  | 'malware-failure';

/**
 * The only error type rejected by the freeRASP API.
 */
export class TalsecError extends Error {
  readonly code: TalsecErrorCode;

  constructor(code: TalsecErrorCode, message?: string) {
    super(message);
    this.name = 'TalsecError';
    this.code = code;
    Object.setPrototypeOf(this, TalsecError.prototype);
  }
}

/**
 * Runs a native call and rethrows any failure as a {@link TalsecError}.
 */
export const wrapNative = async <T>(code: TalsecErrorCode, fn: () => Promise<T>): Promise<T> => {
  try {
    return await fn();
  } catch (e: any) {
    if (e instanceof TalsecError) {
      throw e;
    }
    throw new TalsecError(code, e?.message ?? String(e));
  }
};

/**
 * Rejects calls of Android-only features on iOS.
 */
export const unsupportedOnIos = (feature: string): TalsecError =>
  new TalsecError('unsupported-platform', `${feature} is not available on iOS`);
