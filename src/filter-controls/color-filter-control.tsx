import { useSearchAndFilterModuleStoreContext } from "../store";

import { ColorSwatchButton } from "./color-filter-control/color-swatch-button";
import { SelectedColorChips } from "./color-filter-control/selected-color-chips";
import { toggleMultiSelectValue } from "./filter-control-helpers";

import type { ColorFilter } from "../types";

interface ColorFilterControlProps {
  filter: ColorFilter;
}

interface SelectedColorChipsProps {
  options: ColorFilter["options"];
  selectedValues: Set<string>;
}

interface ColorSwatchButtonProps {
  checked: boolean;
  disabled: boolean;
  option: ColorFilter["options"][number];
  onClick: () => void;
}
export type { ColorSwatchButtonProps, SelectedColorChipsProps };

export const ColorFilterControl = ({ filter }: ColorFilterControlProps) => {
  const { handleFilterChange, selectDataLoadingStatus } =
    useSearchAndFilterModuleStoreContext();

  const { loading } = selectDataLoadingStatus();
  const selectedValues = new Set(filter.value ?? []);

  const handleToggleOption = (value: string) => {
    return void handleFilterChange(
      filter.key,
      toggleMultiSelectValue<string>(filter.value, value),
    );
  };

  return (
    <div className="space-y-3">
      <SelectedColorChips
        options={filter.options}
        selectedValues={selectedValues}
      />

      <div className="flex flex-wrap gap-3">
        {filter.options.map((option) => {
          const checked = selectedValues.has(option.value);

          return (
            <ColorSwatchButton
              key={option.value.toString()}
              checked={checked}
              disabled={loading}
              option={option}
              onClick={() => handleToggleOption(option.value)}
            />
          );
        })}
      </div>
    </div>
  );
};
