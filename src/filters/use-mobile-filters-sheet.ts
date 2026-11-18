import { useCallback } from "react";

import { useSearchAndFilterModuleStoreContext } from "../store";

export const useMobileFiltersSheet = () => {
  const { useSelectValue, setKeyValue } =
    useSearchAndFilterModuleStoreContext();

  const mobileFiltersOpen = useSelectValue("mobileFiltersOpen");

  const setMobileFiltersOpen = useCallback(
    (open: boolean) => {
      setKeyValue("mobileFiltersOpen", open);
    },
    [setKeyValue],
  );

  return {
    mobileFiltersOpen,
    setMobileFiltersOpen,
  };
};
