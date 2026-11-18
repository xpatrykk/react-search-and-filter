import { cloneFilter } from "./clone-filter";
import { patchBooleanFilterValue } from "./patch-boolean-filter-value";
import { patchColorFilterValue } from "./patch-color-filter-value";
import { patchMultiSelectFilterValue } from "./patch-multi-select-filter-value";
import { patchSelectFilterValue } from "./patch-select-filter-value";

import type { Filter } from "../../types";

export const patchSingleFilterValue = (
  filter: Filter,
  value: Filter["value"],
): Filter => {
  switch (filter.type) {
    case "boolean":
      return patchBooleanFilterValue(filter, value);
    case "select":
      return patchSelectFilterValue(filter, value);
    case "multi-select":
    case "multi-select-button":
      return patchMultiSelectFilterValue(filter, value);
    case "color":
      return patchColorFilterValue(filter, value);
    default:
      return cloneFilter(filter);
  }
};
