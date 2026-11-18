import { normalizeCheckedState } from "./normalize-checked-state";

import type { CheckedState } from "@radix-ui/react-checkbox";

export const normalizeBooleanFilterValue = (
  checked: CheckedState,
): boolean | null => (normalizeCheckedState(checked) ? true : null);
