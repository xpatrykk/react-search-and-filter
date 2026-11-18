import { hasSelectedOption } from "./has-selected-option";

import type { FilterOptionValue } from "../../types";

export const toggleMultiSelectValue = <Value extends FilterOptionValue>(
  currentValues: Array<Value> | null | undefined,
  value: Value,
): Array<Value> | null => {
  const resolvedValues = currentValues ?? [];
  const nextValues = hasSelectedOption(resolvedValues, value)
    ? resolvedValues.filter((currentValue) => currentValue !== value)
    : [...resolvedValues, value];

  return nextValues.length ? nextValues : null;
};
