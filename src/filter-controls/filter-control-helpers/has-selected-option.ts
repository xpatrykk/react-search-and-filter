import type { FilterOptionValue } from "../../types";

export const hasSelectedOption = <Value extends FilterOptionValue>(
  currentValues: Array<Value> | null | undefined,
  value: Value,
): boolean =>
  Boolean(currentValues?.some((currentValue) => currentValue === value));
