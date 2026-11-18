import { clsx } from "clsx";

import { FiltersDesktop } from "./filters";

interface DesktopFiltersColumnProps {
  mainContainerId: string;
  loading: boolean;
}

export const DesktopFiltersColumn = ({
  loading,
}: DesktopFiltersColumnProps) => {
  return (
    <div
      className={clsx(
        "hidden min-w-0 transition-opacity duration-300 ease-in-out lg:col-span-2 xl:block",
        loading
          ? "pointer-events-none opacity-100 lg:opacity-55"
          : "opacity-100",
      )}
    >
      <div className="sticky top-20">
        <FiltersDesktop />
      </div>
    </div>
  );
};
