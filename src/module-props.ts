import type { SearchAndFilterAppearanceProps } from "./messages";
import type { DesktopFiltersDisplayMode } from "./desktop-filters-display-mode";
import type { SearchAndFilterModuleState } from "./store/state";
import type { Store } from "@quickstate/core";

export interface SearchAndFilterModuleWithStoreProps<
  Item,
> extends SearchAndFilterAppearanceProps {
  mode: "store";
  store: Store<SearchAndFilterModuleState<Item>>;
  desktopFiltersDisplayMode?: DesktopFiltersDisplayMode;
}

export interface SearchAndFilterModuleWithStateProps<
  Item,
> extends SearchAndFilterAppearanceProps {
  mode?: "state";
  desktopFiltersDisplayMode?: DesktopFiltersDisplayMode;
  state: Omit<
    Partial<SearchAndFilterModuleState<Item>>,
    "onDataFetch" | "onRenderResultItem" | "getResultItemKey"
  > &
    Pick<
      SearchAndFilterModuleState<Item>,
      "onDataFetch" | "onRenderResultItem" | "getResultItemKey"
    >;
}

export type SearchAndFilterModuleProps<Item> =
  | SearchAndFilterModuleWithStoreProps<Item>
  | SearchAndFilterModuleWithStateProps<Item>;
