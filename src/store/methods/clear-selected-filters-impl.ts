import { clearSelectedFilterData } from "../filter-state-helpers";

import { fetchDataService } from "./fetch-data-service";

import type { SearchAndFilterModuleState } from "../state";
import type { Store } from "@quickstate/core";

export const clearSelectedFiltersImpl = <Item>(
  store: Store<SearchAndFilterModuleState<Item>>,
) =>
  fetchDataService<Item, "clearFilters">(
    (state) => {
      const clearedData = clearSelectedFilterData({
        filters: state.filters,
        searchFilter: state.searchFilter,
      });

      state.filters = clearedData.filters;
      state.searchFilter = clearedData.searchFilter;
      state.page = 1;
    },
    (requestData) => {
      const clearedData = clearSelectedFilterData({
        filters: requestData.filters,
        searchFilter: requestData.searchFilter,
      });

      return {
        ...requestData,
        page: 1,
        filters: clearedData.filters,
        searchFilter: clearedData.searchFilter,
      };
    },
  )(store);
