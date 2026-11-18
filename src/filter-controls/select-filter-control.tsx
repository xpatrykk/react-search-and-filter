import { encodeSelectOptionValue } from "./filter-control-helpers/encode-select-option-value";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useSearchAndFilterModuleStoreContext } from "../store";

import { decodeSelectOptionValue } from "./filter-control-helpers";

import type { SelectFilter } from "../types";

interface SelectFilterProps {
  filter: SelectFilter;
}

export const SelectFilterControl = ({ filter }: SelectFilterProps) => {
  const { handleFilterChange, selectDataLoadingStatus } =
    useSearchAndFilterModuleStoreContext();

  const { loading } = selectDataLoadingStatus();
  const value =
    filter.value == null ? "" : encodeSelectOptionValue(filter.value);

  const setFilterValue = (nextValue: string) => {
    const decodedValue = decodeSelectOptionValue(filter.options, nextValue);

    if (decodedValue === null) {
      return;
    }

    return void handleFilterChange(filter.key, decodedValue);
  };

  return (
    <Select
      disabled={loading}
      value={value}
      onValueChange={(value) => {
        setFilterValue(value);
      }}
    >
      <SelectTrigger width="full" aria-label={filter.label || undefined}>
        <SelectValue placeholder={filter.placeholder || filter.label} />
      </SelectTrigger>
      <SelectContent>
        {filter.options.map((option) => (
          <SelectItem
            key={encodeSelectOptionValue(option.value)}
            value={encodeSelectOptionValue(option.value)}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
