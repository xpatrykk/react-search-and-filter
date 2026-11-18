import type { CheckedState } from "@radix-ui/react-checkbox";

export const normalizeCheckedState = (checked: CheckedState): boolean =>
  checked === true;
