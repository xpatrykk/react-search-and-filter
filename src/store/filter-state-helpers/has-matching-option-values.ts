import { hasMatchingOptionValue } from "./has-matching-option-value";

import type { FilterOptionValue, FilterValue } from "../../types";

export const hasMatchingOptionValues = <OptionValue extends FilterOptionValue>(
  options: Array<{ value: OptionValue }>,
  value: FilterValue,
): value is Array<OptionValue> =>
  Array.isArray(value) &&
  value.every((entry): entry is OptionValue =>
    typeof entry === "string" || typeof entry === "number"
      ? hasMatchingOptionValue(options, entry)
      : false,
  );
