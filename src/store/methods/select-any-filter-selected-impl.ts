import { isFilterValueSelected } from "../filter-state-helpers";

import type { SearchAndFilterModuleState } from "../state";
import type { Store } from "@quickstate/core";

export const selectAnyFilterSelectedImpl = <Item>(
  store: Store<SearchAndFilterModuleState<Item>>,
) =>
  store.createSelector(({ filters, searchFilter }): boolean => {
    return (
      filters.some(({ value }) => isFilterValueSelected(value)) ||
      isFilterValueSelected(searchFilter?.value)
    );
  });
