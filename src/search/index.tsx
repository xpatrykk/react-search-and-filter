import { useCallback } from "react";
import { useMessages } from "../messages";
import { Input } from "../ui/input";

import { useSearchAndFilterModuleStoreContext } from "../store";

import { useDebouncedSearchController } from "./use-debounced-search-controller";

export const Search = () => {
  const t = useMessages();
  const { useSelectValue, handleSearch } =
    useSearchAndFilterModuleStoreContext();
  const searchFilter = useSelectValue("searchFilter");
  const onSearch = useCallback(
    (value: string) => {
      void handleSearch(value);
    },
    [handleSearch],
  );
  const { localValue, setLocalValue } = useDebouncedSearchController({
    value: searchFilter?.value,
    onSearch,
  });

  if (!searchFilter) {
    return null;
  }

  return (
    <Input
      type="text"
      aria-label={t("searchLabel")}
      placeholder={searchFilter.placeholder || t("searchPlaceholder")}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
    />
  );
};
