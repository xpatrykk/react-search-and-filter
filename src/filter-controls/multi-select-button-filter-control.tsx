import { encodeSelectOptionValue } from "./filter-control-helpers/encode-select-option-value";
import { clsx } from "clsx";

import { Button } from "../ui/button";

import { useSearchAndFilterModuleStoreContext } from "../store";

import {
  hasSelectedOption,
  toggleMultiSelectValue,
} from "./filter-control-helpers";

import type { MultiSelectButtonFilter } from "../types";

interface MultiSelectButtonFilterControlProps {
  filter: MultiSelectButtonFilter;
}

export const MultiSelectButtonFilterControl = ({
  filter,
}: MultiSelectButtonFilterControlProps) => {
  const { handleFilterChange, selectDataLoadingStatus } =
    useSearchAndFilterModuleStoreContext();

  const { loading } = selectDataLoadingStatus();

  const handleToggleOption = (value: number | string) => {
    const nextValue = toggleMultiSelectValue(
      filter.value as Array<typeof value> | null | undefined,
      value,
    ) as MultiSelectButtonFilter["value"];

    return void handleFilterChange(filter.key, nextValue);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {filter.options.map((option) => {
        const checked = hasSelectedOption(filter.value, option.value);

        return (
          <div key={encodeSelectOptionValue(option.value)}>
            <Button
              type="button"
              disabled={loading}
              variant={checked ? "default" : "outline"}
              aria-pressed={checked}
              className={clsx(option.icon && "flex items-center gap-2")}
              onClick={() => handleToggleOption(option.value)}
            >
              {option.icon && (
                <option.icon className="h-4 w-4" aria-hidden="true" />
              )}
              {option.label}
            </Button>
          </div>
        );
      })}
    </div>
  );
};
