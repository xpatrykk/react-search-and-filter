import { Main } from "../main";
import {
  SearchAndFilterModuleStoreProvider,
  type SearchAndFilterModuleState,
} from "../store";

import type { DesktopFiltersDisplayMode } from "../desktop-filters-display-mode";
import type { Store } from "@quickstate/core";

interface SearchAndFilterModuleRendererProps<Item> {
  store: Store<SearchAndFilterModuleState<Item>>;
  desktopFiltersDisplayMode: DesktopFiltersDisplayMode;
}

export const SearchAndFilterModuleRenderer = <Item,>({
  store,
  desktopFiltersDisplayMode,
}: SearchAndFilterModuleRendererProps<Item>) => (
  <SearchAndFilterModuleStoreProvider store={store}>
    <Main desktopFiltersDisplayMode={desktopFiltersDisplayMode} />
  </SearchAndFilterModuleStoreProvider>
);
