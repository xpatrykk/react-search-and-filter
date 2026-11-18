import type { OnDataFetchSuccessResult } from "../store";
import type { OnDataFetchResult } from "../types";

export const isSuccessResult = <Item>(
  result: OnDataFetchResult<Item>,
): result is OnDataFetchSuccessResult<Item> =>
  typeof result === "object" &&
  Boolean(result) &&
  "data" in result &&
  Array.isArray(result.data) &&
  "total" in result &&
  typeof result.total === "number" &&
  Number.isFinite(result.total) &&
  Number.isSafeInteger(result.total) &&
  result.total >= 0;
