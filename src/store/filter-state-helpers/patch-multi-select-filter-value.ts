import { cloneFilter } from "./clone-filter";
import { hasMatchingOptionValues } from "./has-matching-option-values";

import type { Filter } from "../../types";

export const patchMultiSelectFilterValue = (
  filter: Extract<Filter, { type: "multi-select" | "multi-select-button" }>,
  value: Filter["value"],
): Filter => ({
  ...cloneFilter(filter),
  value:
    value === null || hasMatchingOptionValues(filter.options, value)
      ? value
      : filter.value,
});
