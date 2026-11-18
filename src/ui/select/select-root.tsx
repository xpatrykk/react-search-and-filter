import * as SelectPrimitive from "@radix-ui/react-select";
import React from "react";

export const Select = ({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) => {
  const normalizedProps =
    "value" in props
      ? {
          ...props,
          value: props.value ?? "",
        }
      : props;

  return <SelectPrimitive.Root data-slot="select" {...normalizedProps} />;
};
