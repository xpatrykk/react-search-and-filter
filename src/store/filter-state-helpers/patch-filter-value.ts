import { cloneFilter } from "./clone-filter";
import { patchSingleFilterValue } from "./patch-single-filter-value";

import type { Filter } from "../../types";

export const patchFilterValue = (
  filters: Array<Filter>,
  key: string,
  value: Filter["value"],
): Array<Filter> =>
  filters.map((filter) => {
    if (filter.key !== key) {
      return cloneFilter(filter);
    }

    return patchSingleFilterValue(filter, value);
  });
