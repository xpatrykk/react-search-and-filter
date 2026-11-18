import { Checkbox } from "../ui/checkbox";

import { useSearchAndFilterModuleStoreContext } from "../store";

import { normalizeBooleanFilterValue } from "./filter-control-helpers";

import type { BooleanFilter } from "../types";

interface BooleanFilterControlProps {
  filter: BooleanFilter;
}

export const BooleanFilterControl = ({ filter }: BooleanFilterControlProps) => {
  const { handleFilterChange, selectDataLoadingStatus } =
    useSearchAndFilterModuleStoreContext();

  const { loading } = selectDataLoadingStatus();

  return (
    <Checkbox
      disabled={loading}
      label={filter.label}
      checked={filter.value ?? false}
      onCheckedChange={(checked) => {
        return void handleFilterChange(
          filter.key,
          normalizeBooleanFilterValue(checked),
        );
      }}
    />
  );
};
