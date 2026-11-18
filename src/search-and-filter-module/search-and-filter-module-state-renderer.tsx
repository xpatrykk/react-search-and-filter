import { makeStore } from "@quickstate/core";
import { useMemo } from "react";

import { createInitialState, type SearchAndFilterModuleState } from "../store";

import { SearchAndFilterModuleRenderer } from "./search-and-filter-module-renderer";

import type { DesktopFiltersDisplayMode } from "../desktop-filters-display-mode";
import type { SearchAndFilterModuleWithStateProps } from "../types";

interface SearchAndFilterModuleStateRendererProps<Item> {
  state: SearchAndFilterModuleWithStateProps<Item>["state"];
  desktopFiltersDisplayMode: DesktopFiltersDisplayMode;
}

export const SearchAndFilterModuleStateRenderer = <Item,>({
  state,
  desktopFiltersDisplayMode,
}: SearchAndFilterModuleStateRendererProps<Item>) => {
  const store = useMemo(
    () =>
      makeStore<SearchAndFilterModuleState<Item>>({
        initialState: createInitialState<Item>({ state }),
      }),
    [state],
  );

  return (
    <SearchAndFilterModuleRenderer
      store={store}
      desktopFiltersDisplayMode={desktopFiltersDisplayMode}
    />
  );
};
