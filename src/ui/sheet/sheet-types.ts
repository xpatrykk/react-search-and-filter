import * as SheetPrimitive from "@radix-ui/react-dialog";
import React from "react";

export type SheetContentProps = React.ComponentProps<
  typeof SheetPrimitive.Content
> & {
  side?: "top" | "right" | "bottom" | "left";
  withClose?: boolean;
  overlayClassName?: string;
};
