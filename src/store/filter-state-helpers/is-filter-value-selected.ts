import type { FilterValue } from "../../types";

export const isFilterValueSelected = (
  value: FilterValue | null | undefined,
): boolean => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return value !== null && value !== undefined;
};
