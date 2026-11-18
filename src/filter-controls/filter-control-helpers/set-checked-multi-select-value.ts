import { hasSelectedOption } from "./has-selected-option";
import { normalizeCheckedState } from "./normalize-checked-state";

import type { FilterOptionValue } from "../../types";
import type { CheckedState } from "@radix-ui/react-checkbox";

export const setCheckedMultiSelectValue = <Value extends FilterOptionValue>(
  currentValues: Array<Value> | null | undefined,
  value: Value,
  checked: CheckedState,
): Array<Value> | null => {
  const resolvedValues = currentValues ?? [];

  if (normalizeCheckedState(checked)) {
    return hasSelectedOption(resolvedValues, value)
      ? resolvedValues
      : [...resolvedValues, value];
  }

  const nextValues = resolvedValues.filter(
    (currentValue) => currentValue !== value,
  );

  return nextValues.length ? nextValues : null;
};
