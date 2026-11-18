import { type ReactNode } from "react";

import { BooleanFilterControl } from "../../filter-controls/boolean-filter-control";
import { ColorFilterControl } from "../../filter-controls/color-filter-control";
import { MultiSelectButtonFilterControl } from "../../filter-controls/multi-select-button-filter-control";
import { MultiSelectFilterControl } from "../../filter-controls/multi-select-filter-control";
import { SelectFilterControl } from "../../filter-controls/select-filter-control";

import type { Filter } from "../../types";

const filterRenderers: {
  [Type in Filter["type"]]: (
    filter: Extract<Filter, { type: Type }>,
  ) => ReactNode;
} = {
  boolean: (filter) => <BooleanFilterControl filter={filter} />,
  "multi-select": (filter) => <MultiSelectFilterControl filter={filter} />,
  select: (filter) => <SelectFilterControl filter={filter} />,
  "multi-select-button": (filter) => (
    <MultiSelectButtonFilterControl filter={filter} />
  ),
  color: (filter) => <ColorFilterControl filter={filter} />,
};

export const renderFilterContent = (filter: Filter): ReactNode =>
  filterRenderers[filter.type](filter as never);
