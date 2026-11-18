import {
  defaultDesktopFiltersDisplayMode,
  type DesktopFiltersDisplayMode,
} from "./desktop-filters-display-mode";
import { FiltersMobile } from "./filters";
import { ResultsCount } from "./results-count";
import { Sorting } from "./sorting";

interface MainToolbarProps {
  hideFilters: boolean;
  desktopFiltersDisplayMode?: DesktopFiltersDisplayMode;
}

export const MainToolbar = ({
  hideFilters,
  desktopFiltersDisplayMode = defaultDesktopFiltersDisplayMode,
}: MainToolbarProps) => {
  return (
    <div className="mb-6 grid min-w-0 grid-cols-2 items-center gap-x-2 gap-y-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-x-4">
      <div className="col-start-1 row-start-1 min-w-0 justify-self-start">
        {!hideFilters && (
          <FiltersMobile
            desktopVisible={desktopFiltersDisplayMode === "drawer"}
          />
        )}
      </div>
      <div className="col-span-2 col-start-1 row-start-2 min-w-0 text-center empty:hidden sm:col-span-1 sm:col-start-2 sm:row-start-1">
        <ResultsCount />
      </div>
      <div className="col-start-2 row-start-1 min-w-0 max-w-full justify-self-end sm:col-start-3">
        <Sorting />
      </div>
    </div>
  );
};
