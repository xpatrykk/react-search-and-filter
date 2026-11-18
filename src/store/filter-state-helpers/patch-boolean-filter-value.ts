import { cloneFilter } from "./clone-filter";

import type { Filter } from "../../types";

export const patchBooleanFilterValue = (
  filter: Extract<Filter, { type: "boolean" }>,
  value: Filter["value"],
): Filter => ({
  ...cloneFilter(filter),
  value: typeof value === "boolean" || value === null ? value : filter.value,
});
