import type {
  SearchAndFilterModuleLoadingStatus,
  SearchAndFilterModuleState,
} from "../state";
import type { Store } from "@quickstate/core";

export const selectDataLoadingStatusImpl = <Item>(
  store: Store<SearchAndFilterModuleState<Item>>,
) =>
  store.createSelector(({ status }): SearchAndFilterModuleLoadingStatus => {
    const loading = status === "loading";
    const error = status === "error";

    return {
      status,
      loading,
      error,
    };
  });
