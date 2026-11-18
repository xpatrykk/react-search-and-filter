import { cloneFilters } from "./clone-filters";

import type { Filter } from "../../types";

export const normalizeFilters = (
  filters: Array<Filter> | null | undefined,
): Array<Filter> => cloneFilters(filters ?? []);
