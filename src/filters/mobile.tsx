import { clsx } from "clsx";
import { Filter } from "lucide-react";

import { useMessages } from "../messages";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

import { mainToolbarControlClassName } from "../main-toolbar-control-class-name";

import { FilterSheetHeader } from "./filter-sheet-header";
import { Filters } from "./filters";
import { useMobileFiltersSheet } from "./use-mobile-filters-sheet";

interface FiltersMobileProps {
  desktopVisible?: boolean;
}

export const FiltersMobile = ({
  desktopVisible = false,
}: FiltersMobileProps) => {
  const t = useMessages();
  const { mobileFiltersOpen, setMobileFiltersOpen } = useMobileFiltersSheet();

  return (
    <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={clsx(
            mainToolbarControlClassName,
            "w-fit max-w-full justify-start lg:w-auto",
            !desktopVisible && "xl:hidden",
          )}
        >
          <Filter className="size-3.5" aria-hidden="true" />
          {t("filtersTitle")}
        </Button>
      </SheetTrigger>
      <SheetContent
        withClose={false}
        side="left"
        className="flex flex-col gap-0 rounded-r-3xl p-0"
        aria-describedby={undefined}
      >
        <FilterSheetHeader
          title={t("filtersTitle")}
          closeAriaLabel={t("closeFilters")}
          onClose={() => setMobileFiltersOpen(false)}
        />
        <div className="min-w-0 flex-1 overflow-y-auto p-5">
          <Filters />
        </div>
      </SheetContent>
    </Sheet>
  );
};
