import { cloneFilter } from "./clone-filter";

import type { Filter } from "../../types";

export const cloneFilters = (filters: Array<Filter>): Array<Filter> =>
  filters.map((filter) => cloneFilter(filter));
