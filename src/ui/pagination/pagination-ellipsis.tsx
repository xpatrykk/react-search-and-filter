import { MoreHorizontalIcon } from "lucide-react";
import React from "react";

import { useMessages } from "../../messages";
import { cn } from "../../shared/cn";

export const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => {
  const t = useMessages();
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">{t("morePages")}</span>
    </span>
  );
};
