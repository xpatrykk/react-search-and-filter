import { useState, useEffect } from "react";

import { normalizeSearchFilterValue } from "../store/search-filter-value";

interface UseDebouncedSearchControllerArgs {
  value: string | null | undefined;
  onSearch: (value: string) => void;
}

export const useDebouncedSearchController = ({
  value,
  onSearch,
}: UseDebouncedSearchControllerArgs) => {
  const currentValue = value ?? "";
  const [draftState, setDraftState] = useState(() => ({
    localValue: currentValue,
    sourceValue: currentValue,
  }));
  if (draftState.sourceValue !== currentValue) {
    setDraftState({ localValue: currentValue, sourceValue: currentValue });
  }
  const localValue =
    draftState.sourceValue === currentValue
      ? draftState.localValue
      : currentValue;
  const setLocalValue = (nextValue: string) => {
    setDraftState({
      localValue: nextValue,
      sourceValue: currentValue,
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        normalizeSearchFilterValue(localValue) ===
        normalizeSearchFilterValue(value)
      ) {
        return;
      }

      onSearch(localValue);
    }, 500);
    return () => clearTimeout(timeout);
  }, [localValue, onSearch, value]);

  return {
    localValue,
    setLocalValue,
  };
};
