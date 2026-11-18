import { cloneFilterValue } from "./clone-filter-value";

import type { Filter } from "../../types";

export const cloneFilter = <FilterType extends Filter>(
  filter: FilterType,
): FilterType => ({
  ...filter,
  value: cloneFilterValue(filter.value),
});
