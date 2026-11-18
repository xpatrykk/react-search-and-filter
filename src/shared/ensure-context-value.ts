export const ensureContextValue = <T>(
  value: T | undefined,
  hookName: string,
  providerName: string,
): T => {
  if (value === undefined)
    throw new Error(`${hookName} must be used inside ${providerName}`);
  return value;
};
