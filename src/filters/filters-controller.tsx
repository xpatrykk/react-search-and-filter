import { useId } from "react";

import { Typography } from "../ui/typography";

import { useSearchAndFilterModuleStoreContext } from "../store";

import { renderFilterContent } from "./filters-controller/render-filter-content";

export const FiltersController = () => {
  const filtersId = useId();

  const { useSelectValue } = useSearchAndFilterModuleStoreContext();

  const filters = useSelectValue("filters");

  return (
    <div className="flex min-w-0 flex-col gap-6">
      {filters.map((filter) => {
        const key = `${filtersId}-${filter.type}-${filter.key}`;

        return (
          <div
            key={key}
            className="min-w-0 border-b border-border pb-6 last:border-b-0 last:pb-0"
          >
            {filter.label && (
              <Typography mb="4" className="font-medium" variant="subtitle">
                {filter.label}
              </Typography>
            )}
            <div>{renderFilterContent(filter)}</div>
          </div>
        );
      })}
    </div>
  );
};
