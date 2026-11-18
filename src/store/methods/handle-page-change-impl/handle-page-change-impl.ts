import { fetchDataService } from "../fetch-data-service";

import { clampPage } from "./clamp-page";

import type { SearchAndFilterModuleState } from "../../state";
import type { Store } from "@quickstate/core";

export const handlePageChangeImpl = <Item>(
  store: Store<SearchAndFilterModuleState<Item>>,
) =>
  fetchDataService<Item, "pageChange">(
    (state, { parameters }) => {
      const [requestedPage] = parameters;

      state.page = clampPage(
        requestedPage,
        state.results.total,
        state.itemsPerPage,
      );
      state.scrollRequestCount += 1;
    },
    (requestData, parameters) => {
      const [requestedPage] = parameters;

      return {
        ...requestData,
        page: clampPage(
          requestedPage,
          store.getState().results.total,
          requestData.itemsPerPage,
        ),
      };
    },
  )(store);
