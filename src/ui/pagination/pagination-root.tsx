import { useMessages } from "../../messages";
import React from "react";

import { cn } from "../../shared/cn";

export const Pagination = ({
  className,
  ...props
}: React.ComponentProps<"nav">) => {
  const t = useMessages();
  return (
    <nav
      role="navigation"
      aria-label={t("paginationLabel")}
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
};
