import { useMessages } from "./messages";
import { clsx } from "clsx";

import { Spinner } from "./ui/spinner";

import type { ReactNode } from "react";

interface ModuleLoadingShellProps {
  children: ReactNode;
  loading: boolean;
  className?: string;
  contentClassName?: string;
  loadingContentClassName?: string;
  overlayClassName?: string;
}

export const ModuleLoadingShell = ({
  children,
  loading,
  className,
  contentClassName,
  loadingContentClassName = "pointer-events-none opacity-55",
  overlayClassName,
}: ModuleLoadingShellProps) => {
  const t = useMessages();
  return (
    <div
      className={clsx("relative", className)}
      aria-busy={loading || undefined}
    >
      <div
        className={clsx(
          "transition-opacity duration-300 ease-in-out",
          contentClassName,
          loading ? loadingContentClassName : "opacity-100",
        )}
      >
        {children}
      </div>
      {loading && (
        <div className={overlayClassName}>
          <Spinner label={t("loading")} />
        </div>
      )}
    </div>
  );
};
