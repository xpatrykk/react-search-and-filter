import { useContext } from "react";

import { ensureContextValue } from "../../shared/ensure-context-value";

import { SearchAndFilterModuleStoreContext } from "../store-instance-context";

import type { CreateStoreMethods } from "../create-store-methods";

export const useSearchAndFilterModuleStoreContext = <
  Item,
>(): CreateStoreMethods<Item> => {
  return ensureContextValue(
    useContext(SearchAndFilterModuleStoreContext) as
      | CreateStoreMethods<Item>
      | undefined,
    "useSearchAndFilterModuleStoreContext",
    "SearchAndFilterModuleStoreProvider",
  );
};
