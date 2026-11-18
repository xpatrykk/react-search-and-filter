import { useId } from "react";
import { defaultSearchAndFilterMainContainerId } from "./store/defaults";
import { cn } from "./shared/cn";
import { Container } from "./ui/container";

import { DesktopFiltersColumn } from "./desktop-filters-column";
import {
  defaultDesktopFiltersDisplayMode,
  type DesktopFiltersDisplayMode,
} from "./desktop-filters-display-mode";
import { MainToolbar } from "./main-toolbar";
import { ModuleLoadingShell } from "./module-loading-shell";
import { Pagination } from "./pagination";
import { Results } from "./results";
import { useSearchAndFilterModuleStoreContext } from "./store";
import { useScrollToResults } from "./use-scroll-to-results";

interface MainProps {
  desktopFiltersDisplayMode?: DesktopFiltersDisplayMode;
}

export const Main = ({
  desktopFiltersDisplayMode = defaultDesktopFiltersDisplayMode,
}: MainProps) => {
  const { selectDataLoadingStatus, useSelectValue } =
    useSearchAndFilterModuleStoreContext();

  const generatedId = useId();
  const configuredId = useSelectValue("mainContainerId");
  const mainContainerId =
    configuredId === defaultSearchAndFilterMainContainerId
      ? `rsf-${generatedId}`
      : configuredId;
  const hideFilters = useSelectValue("hideFilters");
  const resultsLeadContent = useSelectValue("resultsLeadContent");
  const resultsLeadContentClassName = useSelectValue(
    "resultsLeadContentClassName",
  );
  const scrollRequestCount = useSelectValue("scrollRequestCount");

  const { loading } = selectDataLoadingStatus();

  useScrollToResults({ mainContainerId, scrollRequestCount });

  const showDesktopFiltersSidebar =
    !hideFilters && desktopFiltersDisplayMode === "sidebar";

  return (
    <Container
      id={mainContainerId}
      className="relative mb-6 grid min-w-0 grid-cols-1 gap-8 md:mb-10 xl:grid-cols-10 xl:gap-10"
    >
      {showDesktopFiltersSidebar && (
        <DesktopFiltersColumn
          mainContainerId={mainContainerId}
          loading={loading}
        />
      )}
      <ModuleLoadingShell
        loading={loading}
        className={
          showDesktopFiltersSidebar
            ? "min-w-0 lg:col-span-8"
            : "min-w-0 lg:col-span-10"
        }
        contentClassName="flex min-w-0 flex-col select-none"
        overlayClassName="sticky inset-x-0 bottom-16 top-0 flex h-full w-full items-center justify-center transition-opacity duration-300 ease-in-out"
      >
        <MainToolbar
          hideFilters={hideFilters}
          desktopFiltersDisplayMode={desktopFiltersDisplayMode}
        />
        {resultsLeadContent && (
          <div className={cn("mb-6", resultsLeadContentClassName)}>
            {resultsLeadContent}
          </div>
        )}
        <div className="mb-3 md:mb-6">
          <Results />
        </div>
        <Pagination />
      </ModuleLoadingShell>
    </Container>
  );
};
