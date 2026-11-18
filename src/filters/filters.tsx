import { ClearAllFilters } from "../clear-all-filters";
import { ModuleLoadingShell } from "../module-loading-shell";
import { Search } from "../search";
import { useSearchAndFilterModuleStoreContext } from "../store";

import { FiltersController } from "./filters-controller";

export const Filters = () => {
  const { selectDataLoadingStatus } = useSearchAndFilterModuleStoreContext();

  const { loading } = selectDataLoadingStatus();

  return (
    <ModuleLoadingShell
      loading={loading}
      contentClassName="flex flex-col gap-6 select-none"
      loadingContentClassName="pointer-events-none opacity-55 lg:opacity-100"
      overlayClassName="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-300 ease-in-out lg:hidden"
    >
      <div className="flex flex-col gap-4">
        <Search />
        <FiltersController />
      </div>
      <ClearAllFilters />
    </ModuleLoadingShell>
  );
};
