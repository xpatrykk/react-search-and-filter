import * as SelectPrimitive from "@radix-ui/react-select";
import React from "react";

import { cn } from "../../shared/cn";

export const SelectLabel = ({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) => {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(" px-2 py-1.5 text-base", className)}
      {...props}
    />
  );
};
