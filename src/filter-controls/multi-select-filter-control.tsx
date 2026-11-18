import { encodeSelectOptionValue } from "./filter-control-helpers/encode-select-option-value";
import { Checkbox } from "../ui/checkbox";

import { useSearchAndFilterModuleStoreContext } from "../store";

import {
  hasSelectedOption,
  setCheckedMultiSelectValue,
} from "./filter-control-helpers";

import type { MultiSelectFilter } from "../types";
import type { CheckedState } from "@radix-ui/react-checkbox";

interface MultiSelectFilterControlProps {
  filter: MultiSelectFilter;
}

export const MultiSelectFilterControl = ({
  filter,
}: MultiSelectFilterControlProps) => {
  const { handleFilterChange, selectDataLoadingStatus } =
    useSearchAndFilterModuleStoreContext();

  const { loading } = selectDataLoadingStatus();

  const handleToggleOption = (
    checked: CheckedState,
    value: string | number,
  ) => {
    const nextValue = setCheckedMultiSelectValue(
      filter.value as Array<typeof value> | null | undefined,
      value,
      checked,
    ) as MultiSelectFilter["value"];

    return void handleFilterChange(filter.key, nextValue);
  };

  return (
    <div className="space-y-2">
      {filter.options.map((option) => {
        const checked = hasSelectedOption(filter.value, option.value);

        return (
          <div
            key={encodeSelectOptionValue(option.value)}
            className="flex items-center space-x-2"
          >
            <Checkbox
              disabled={loading}
              label={option.label}
              checked={checked}
              onCheckedChange={(checked) => {
                handleToggleOption(checked, option.value);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
