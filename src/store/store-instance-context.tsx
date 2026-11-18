"use client";

import React, { createContext, type ReactNode, useMemo } from "react";

import {
  createStoreMethods,
  type CreateStoreMethods,
} from "./create-store-methods";

import type { SearchAndFilterModuleState } from "./state";
import type { Store } from "@quickstate/core";

const SearchAndFilterModuleStoreContext = createContext<
  CreateStoreMethods<unknown> | undefined
>(undefined);

interface SearchAndFilterModuleStoreProviderProps<Item> {
  children: ReactNode;
  store: Store<SearchAndFilterModuleState<Item>>;
}

export function SearchAndFilterModuleStoreProvider<Item>({
  children,
  store,
}: SearchAndFilterModuleStoreProviderProps<Item>) {
  const storeMethods = useMemo(
    () => createStoreMethods<Item>({ store }),
    [store],
  );

  const { Provider } = store;

  return (
    <SearchAndFilterModuleStoreContext.Provider value={storeMethods}>
      <Provider>{children}</Provider>
    </SearchAndFilterModuleStoreContext.Provider>
  );
}

export { SearchAndFilterModuleStoreContext };
export { useSearchAndFilterModuleStoreContext } from "./store-instance-context/use-search-and-filter-module-store-context";
