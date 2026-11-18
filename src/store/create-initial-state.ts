import {
  defaultSearchAndFilterMainContainerId,
  defaultSearchAndFilterResultsContainerClassName,
} from "./defaults";
import {
  normalizeFilters,
  normalizeSearchFilter,
  normalizeSortFilter,
} from "./filter-state-helpers";

import type { SearchAndFilterModuleWithStateProps } from "../types";
import type { SearchAndFilterModuleState } from "./state";

export const createInitialState = <Item>({
  state,
}: Pick<
  SearchAndFilterModuleWithStateProps<Item>,
  "state"
>): SearchAndFilterModuleState<Item> => {
  const {
    filters,
    itemsPerPage,
    page,
    searchFilter,
    sortFilter,
    ...restState
  } = state;
  if (
    state.results &&
    (!Number.isSafeInteger(state.results.total) || state.results.total < 0)
  )
    throw new RangeError("results.total must be a nonnegative safe integer");

  return {
    status: "loaded",
    onError: null,
    results: {
      data: [],
      total: 0,
    },
    renderNoResults: null,
    resultsContainerElement: "div",
    resultItemElement: "div",
    mobileFiltersOpen: false,
    mainContainerId: defaultSearchAndFilterMainContainerId,
    scrollRequestCount: 0,
    hideFilters: false,
    resultsContainerClassName: defaultSearchAndFilterResultsContainerClassName,
    resultsLeadContent: null,
    resultsLeadContentClassName: null,
    resultsInsertion: null,
    ...restState,
    filters: normalizeFilters(filters),
    itemsPerPage:
      typeof itemsPerPage === "number" &&
      Number.isSafeInteger(Math.trunc(itemsPerPage)) &&
      itemsPerPage >= 1
        ? Math.trunc(itemsPerPage)
        : 25,
    page:
      typeof page === "number" &&
      Number.isSafeInteger(Math.trunc(page)) &&
      page >= 1
        ? Math.trunc(page)
        : 1,
    sortFilter: normalizeSortFilter(sortFilter),
    searchFilter: normalizeSearchFilter(searchFilter),
  };
};
