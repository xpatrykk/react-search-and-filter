import type { FilterOptionValue } from "../../types";
export const encodeSelectOptionValue = (value: FilterOptionValue): string =>
  JSON.stringify([typeof value, value]);
