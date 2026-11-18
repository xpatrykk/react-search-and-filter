import * as SheetPrimitive from "@radix-ui/react-dialog";
import React from "react";

export const SheetTrigger = ({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) => {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
};
