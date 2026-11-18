export const resolveClearAllFiltersVisibilityClassName = (
  visible: boolean,
): string =>
  visible
    ? "max-h-40 opacity-100"
    : "pointer-events-none max-h-0 select-none opacity-0";
