import { cloneFilter } from "./clone-filter";
import { hasMatchingOptionValue } from "./has-matching-option-value";

import type { Filter } from "../../types";

export const patchSelectFilterValue = (
  filter: Extract<Filter, { type: "select" }>,
  value: Filter["value"],
): Filter => ({
  ...cloneFilter(filter),
  value:
    value === null ||
    (typeof value !== "boolean" &&
      !Array.isArray(value) &&
      hasMatchingOptionValue(filter.options, value))
      ? value
      : filter.value,
});
