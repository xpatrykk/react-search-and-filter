import type { Filter } from "../../types";

export const cloneFilterValue = (value: Filter["value"]): Filter["value"] => {
  if (Array.isArray(value)) {
    return [...value];
  }

  return value;
};
