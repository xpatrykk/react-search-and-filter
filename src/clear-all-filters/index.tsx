"use client";

import { clsx } from "clsx";
import { FilterX } from "lucide-react";

import { useMessages } from "../messages";
import { Button } from "../ui/button";

import { useSearchAndFilterModuleStoreContext } from "../store";

import { resolveClearAllFiltersVisibilityClassName } from "./presenter";

export const ClearAllFilters = () => {
  const t = useMessages();
  const {
    selectAnyFilterSelected,
    selectDataLoadingStatus,
    clearSelectedFilters,
  } = useSearchAndFilterModuleStoreContext();

  const { loading } = selectDataLoadingStatus();
  const anyFilterSelected = selectAnyFilterSelected();

  return (
    <div
      className={clsx(
        "bg-background sticky bottom-0 flex justify-center overflow-hidden py-3 pt-4  transition-all duration-300 ease-in-out",
        resolveClearAllFiltersVisibilityClassName(anyFilterSelected),
      )}
    >
      <Button
        disabled={!anyFilterSelected || loading}
        variant="secondary"
        className="w-full"
        onClick={clearSelectedFilters}
      >
        <FilterX className="mr-2 h-4 w-4" aria-hidden="true" />
        {t("clearAll")}
      </Button>
    </div>
  );
};
