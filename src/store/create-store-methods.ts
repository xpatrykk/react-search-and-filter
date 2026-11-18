import { retryLastRequest } from "./methods/fetch-data-service";
import { type Store } from "@quickstate/core";

import { clearSelectedFiltersImpl } from "./methods/clear-selected-filters-impl";
import { handleFilterChangeImpl } from "./methods/handle-filter-change-impl";
import { handlePageChangeImpl } from "./methods/handle-page-change-impl";
import { handleSearchImpl } from "./methods/handle-search-impl";
import { handleSortChangeImpl } from "./methods/handle-sort-change-impl";
import { selectAnyFilterSelectedImpl } from "./methods/select-any-filter-selected-impl";
import { selectDataLoadingStatusImpl } from "./methods/select-data-loading-status-impl";

import type { SearchAndFilterModuleState } from "./state";

interface CreateStoreMethodsProps<Item> {
  store: Store<SearchAndFilterModuleState<Item>>;
}

export const createStoreMethods = <Item>({
  store,
}: CreateStoreMethodsProps<Item>) => {
  const { useSelectValue, setKeyValue } = store;

  const handleFilterChange = handleFilterChangeImpl<Item>(store);
  const handleSort = handleSortChangeImpl<Item>(store);
  const handleSearch = handleSearchImpl<Item>(store);
  const handlePageChange = handlePageChangeImpl<Item>(store);
  const clearSelectedFilters = clearSelectedFiltersImpl<Item>(store);

  const selectAnyFilterSelected = selectAnyFilterSelectedImpl(store);
  const selectDataLoadingStatus = selectDataLoadingStatusImpl(store);

  return {
    handlePageChange,
    retry: () =>
      retryLastRequest(store) ?? handlePageChange(store.getState().page),
    handleFilterChange,
    handleSort,
    handleSearch,
    setKeyValue,
    useSelectValue,
    clearSelectedFilters,
    selectAnyFilterSelected,
    selectDataLoadingStatus,
  };
};

export type CreateStoreMethods<Item> = ReturnType<
  typeof createStoreMethods<Item>
>;
