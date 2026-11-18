import { normalizeSearchFilterValue } from "../search-filter-value";

import type { SearchFilter } from "../../types";

export const normalizeSearchFilter = (
  searchFilter: SearchFilter | null | undefined,
): SearchFilter | null =>
  searchFilter
    ? {
        ...searchFilter,
        value: normalizeSearchFilterValue(searchFilter.value),
      }
    : null;
