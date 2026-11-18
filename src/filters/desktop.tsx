import { useMessages } from "../messages";

import { Filters } from "./filters";

export const FiltersDesktop = () => {
  const t = useMessages();
  return (
    <aside
      aria-label={t("filtersTitle")}
      className="filters-sidebar-scrollbar max-h-[calc(100dvh-6rem)] overflow-x-hidden overflow-y-auto overscroll-y-contain"
    >
      <Filters />
    </aside>
  );
};
