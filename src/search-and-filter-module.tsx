"use client";

import { SettingsProvider } from "./messages";

import { defaultDesktopFiltersDisplayMode } from "./desktop-filters-display-mode";
import { isStoreProps } from "./search-and-filter-module/is-store-props";
import { SearchAndFilterModuleRenderer } from "./search-and-filter-module/search-and-filter-module-renderer";
import { SearchAndFilterModuleStateRenderer } from "./search-and-filter-module/search-and-filter-module-state-renderer";

import type { SearchAndFilterModuleProps } from "./types";

export const SearchAndFilterModule = <Item,>(
  props: SearchAndFilterModuleProps<Item>,
) => {
  const { desktopFiltersDisplayMode = defaultDesktopFiltersDisplayMode } =
    props;

  if (isStoreProps(props)) {
    const { store } = props;

    return (
      <SettingsProvider {...props}>
        <SearchAndFilterModuleRenderer
          store={store}
          desktopFiltersDisplayMode={desktopFiltersDisplayMode}
        />
      </SettingsProvider>
    );
  }

  const { state } = props;

  return (
    <SettingsProvider {...props}>
      <SearchAndFilterModuleStateRenderer
        state={state}
        desktopFiltersDisplayMode={desktopFiltersDisplayMode}
      />
    </SettingsProvider>
  );
};
