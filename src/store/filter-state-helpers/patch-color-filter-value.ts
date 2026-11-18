import { cloneFilter } from "./clone-filter";
import { hasMatchingOptionValues } from "./has-matching-option-values";

import type { Filter } from "../../types";

export const patchColorFilterValue = (
  filter: Extract<Filter, { type: "color" }>,
  value: Filter["value"],
): Filter => ({
  ...cloneFilter(filter),
  value:
    value === null || hasMatchingOptionValues(filter.options, value)
      ? value
      : filter.value,
});
