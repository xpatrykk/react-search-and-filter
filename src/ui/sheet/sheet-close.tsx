import * as SheetPrimitive from "@radix-ui/react-dialog";
import React from "react";

export const SheetClose = ({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) => {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
};
