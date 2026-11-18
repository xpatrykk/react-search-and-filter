import React from "react";

import { cn } from "../shared/cn";

export const CheckboxLabel = ({
  className,
  ...props
}: React.ComponentProps<"label">) => (
  <label
    className={cn(
      "text-sm select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 [a]:underline [a]:text-blue-600",
      className,
    )}
    {...props}
  />
);
