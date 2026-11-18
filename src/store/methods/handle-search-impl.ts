import { normalizeSearchFilterValue } from "../search-filter-value";

import { fetchDataService } from "./fetch-data-service";

import type { SearchAndFilterModuleState } from "../state";
import type { Store } from "@quickstate/core";

export const handleSearchImpl = <Item>(
  store: Store<SearchAndFilterModuleState<Item>>,
) =>
  fetchDataService<Item, "search">(
    (state, { parameters }) => {
      const [value] = parameters;
      const normalizedValue = normalizeSearchFilterValue(value);

      if (state.searchFilter) {
        state.searchFilter.value = normalizedValue;
      }

      state.page = 1;
    },
    (requestData, parameters) => {
      const [value] = parameters;
      const normalizedValue = normalizeSearchFilterValue(value);

      return {
        ...requestData,
        page: 1,
        searchFilter: requestData.searchFilter
          ? {
              ...requestData.searchFilter,
              value: normalizedValue,
            }
          : requestData.searchFilter,
      };
    },
  )(store);
