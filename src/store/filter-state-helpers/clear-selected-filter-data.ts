import { clearFilterValues } from "./clear-filter-values";

import type { Filter, SearchFilter } from "../../types";

interface ClearSelectedFilterDataArgs {
  filters: Array<Filter>;
  searchFilter: SearchFilter | null | undefined;
}

export const clearSelectedFilterData = ({
  filters,
  searchFilter,
}: ClearSelectedFilterDataArgs) => ({
  filters: clearFilterValues(filters),
  searchFilter: searchFilter
    ? {
        ...searchFilter,
        value: null,
      }
    : (searchFilter ?? null),
});
