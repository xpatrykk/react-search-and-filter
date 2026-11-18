import { encodeSelectOptionValue } from "./encode-select-option-value";
import type { FilterOptionValue } from "../../types";

export const decodeSelectOptionValue = <Value extends FilterOptionValue>(
  options: Array<{ value: Value }>,
  rawValue: string,
): Value | null => {
  const matchedOption = options.find(
    (option) => encodeSelectOptionValue(option.value) === rawValue,
  );

  return matchedOption ? matchedOption.value : null;
};
