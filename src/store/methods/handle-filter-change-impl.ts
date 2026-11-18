import { patchFilterValue } from "../filter-state-helpers";

import { fetchDataService } from "./fetch-data-service";

import type { SearchAndFilterModuleState } from "../state";
import type { Store } from "@quickstate/core";

export const handleFilterChangeImpl = <Item>(
  store: Store<SearchAndFilterModuleState<Item>>,
) =>
  fetchDataService<Item, "filter">(
    (state, { parameters }) => {
      const [key, value] = parameters;
      state.filters = patchFilterValue(state.filters, key, value);
      state.page = 1;
    },
    (requestData, parameters) => {
      const [key, value] = parameters;

      return {
        ...requestData,
        page: 1,
        filters: patchFilterValue(requestData.filters, key, value),
      };
    },
  )(store);
