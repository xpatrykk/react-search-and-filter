import type {
  SearchAndFilterModuleProps,
  SearchAndFilterModuleWithStoreProps,
} from "../types";

export const isStoreProps = <Item>(
  props: SearchAndFilterModuleProps<Item>,
): props is SearchAndFilterModuleWithStoreProps<Item> => props.mode === "store";
