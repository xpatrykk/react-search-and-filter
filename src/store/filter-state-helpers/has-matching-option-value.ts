import type { FilterOptionValue } from "../../types";

export const hasMatchingOptionValue = <OptionValue extends FilterOptionValue>(
  options: Array<{ value: OptionValue }>,
  value: FilterOptionValue,
): value is OptionValue => options.some((option) => option.value === value);
