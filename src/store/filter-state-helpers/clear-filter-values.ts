import { cloneFilter } from "./clone-filter";

import type { Filter } from "../../types";

export const clearFilterValues = (filters: Array<Filter>): Array<Filter> =>
  filters.map((filter) => ({
    ...cloneFilter(filter),
    value: null,
  }));
