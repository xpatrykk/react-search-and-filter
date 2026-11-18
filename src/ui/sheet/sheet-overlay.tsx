import * as SheetPrimitive from "@radix-ui/react-dialog";
import React from "react";

import { cn } from "../../shared/cn";

export const SheetOverlay = ({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) => {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200 fixed inset-0 z-50 bg-black/50",
        className,
      )}
      {...props}
    />
  );
};
