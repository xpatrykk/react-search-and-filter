import * as SheetPrimitive from "@radix-ui/react-dialog";
import React from "react";

import { cn } from "../../shared/cn";

export const SheetTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) => {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  );
};
