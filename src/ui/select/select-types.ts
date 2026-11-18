import * as SelectPrimitive from "@radix-ui/react-select";
import React from "react";

export type SelectTriggerProps = React.ComponentProps<
  typeof SelectPrimitive.Trigger
> & {
  size?: "sm" | "default";
  width?: "fit" | "full";
};
