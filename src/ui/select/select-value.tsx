import * as SelectPrimitive from "@radix-ui/react-select";
import React from "react";

export const SelectValue = ({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) => {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
};
