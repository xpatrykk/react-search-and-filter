import { encodeSelectOptionValue } from "../filter-controls/filter-control-helpers/encode-select-option-value";
import { useMessages } from "../messages";
import { SlidersHorizontal } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { decodeSelectOptionValue } from "../filter-controls/filter-control-helpers";
import { mainToolbarControlClassName } from "../main-toolbar-control-class-name";
import { useSearchAndFilterModuleStoreContext } from "../store";

export const Sorting = () => {
  const t = useMessages();
  const { useSelectValue, handleSort, selectDataLoadingStatus } =
    useSearchAndFilterModuleStoreContext();

  const sortFilter = useSelectValue("sortFilter");
  const { loading } = selectDataLoadingStatus();

  if (!sortFilter) {
    return null;
  }

  return (
    <div className="min-w-0 flex-1 sm:flex-none">
      <Select
        disabled={loading}
        value={
          sortFilter.value == null
            ? ""
            : encodeSelectOptionValue(sortFilter.value)
        }
        onValueChange={(value) => {
          const decodedValue = decodeSelectOptionValue(
            sortFilter.options,
            value,
          );

          if (decodedValue === null) {
            return;
          }

          void handleSort(decodedValue);
        }}
      >
        <SelectTrigger
          className={`${mainToolbarControlClassName} w-full min-w-0 max-w-full sm:w-fit [&_[data-slot=select-value]]:block [&_[data-slot=select-value]]:truncate [&_[data-slot=select-value]]:text-left`}
          aria-label={sortFilter.label || t("sortLabel")}
        >
          <SlidersHorizontal
            className="hidden size-3.5 sm:block"
            aria-hidden="true"
          />
          <SelectValue
            placeholder={sortFilter.placeholder || sortFilter.label}
          />
        </SelectTrigger>
        <SelectContent>
          {sortFilter.options.map((option) => (
            <SelectItem
              key={encodeSelectOptionValue(option.value)}
              value={encodeSelectOptionValue(option.value)}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
