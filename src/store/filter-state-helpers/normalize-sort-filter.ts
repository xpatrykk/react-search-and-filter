import type { SortFilter } from "../../types";

export const normalizeSortFilter = (
  sortFilter: SortFilter | null | undefined,
): SortFilter | null => {
  if (!sortFilter) {
    return null;
  }

  const resolvedValue = sortFilter.options.find(
    (option) => option.value === sortFilter.value,
  )?.value;

  return {
    ...sortFilter,
    value: resolvedValue ?? sortFilter.options[0]?.value ?? null,
  };
};
