import * as SheetPrimitive from "@radix-ui/react-dialog";
import React from "react";

export const Sheet = ({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Root>) => {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
};
