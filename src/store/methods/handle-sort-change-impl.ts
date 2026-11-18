import { fetchDataService } from "./fetch-data-service";
import { resolveSortValue } from "./handle-sort-change-impl/resolve-sort-value";

import type { SearchAndFilterModuleState } from "../state";
import type { Store } from "@quickstate/core";

export const handleSortChangeImpl = <Item>(
  store: Store<SearchAndFilterModuleState<Item>>,
) =>
  fetchDataService<Item, "sort">(
    (state, { parameters }) => {
      const [value] = parameters;

      if (state.sortFilter) {
        const nextValue = resolveSortValue(state.sortFilter.options, value);

        if (nextValue !== null) {
          state.sortFilter.value = nextValue;
        }
      }

      state.page = 1;
    },
    (requestData, parameters) => {
      const [value] = parameters;
      const nextValue = requestData.sortFilter
        ? resolveSortValue(requestData.sortFilter.options, value)
        : null;

      return {
        ...requestData,
        page: 1,
        sortFilter: requestData.sortFilter
          ? {
              ...requestData.sortFilter,
              value: nextValue ?? requestData.sortFilter.value,
            }
          : requestData.sortFilter,
      };
    },
  )(store);
