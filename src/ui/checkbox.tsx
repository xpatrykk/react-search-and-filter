import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon, MinusIcon } from "lucide-react";
import React, { ReactNode, forwardRef, useId } from "react";

import { cn } from "../shared/cn";

import { CheckboxLabel } from "./checkbox-label";

type CheckboxRootProps = React.ComponentProps<typeof CheckboxPrimitive.Root>;

export const CheckboxRoot = forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxRootProps
>(({ className, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      data-slot="checkbox"
      className={cn(
        "peer group/checkbox border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground data-[state=checked]:border-primary data-[state=indeterminate]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-5 shrink-0 border outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5 group-data-[state=indeterminate]/checkbox:hidden" />
        <MinusIcon className="hidden size-3.5 group-data-[state=indeterminate]/checkbox:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

CheckboxRoot.displayName = "CheckboxRoot";

export const Checkbox = ({
  className,
  label,
  id,
  required,
  wrapperClassName,
  labelClassName,
  ...props
}: CheckboxRootProps & {
  label?: ReactNode;
  wrapperClassName?: string;
  labelClassName?: string;
}) => {
  const generatedId = useId();
  const checkboxId = id ?? `checkbox-${generatedId}`;

  return (
    <div className={cn("flex items-center space-x-3", wrapperClassName)}>
      <CheckboxRoot
        id={checkboxId}
        className={className}
        required={required}
        {...props}
      />
      {label && (
        <CheckboxLabel
          htmlFor={checkboxId}
          className={cn(
            required &&
              "after:ml-0.5 after:text-destructive after:content-['*']",
            labelClassName,
          )}
        >
          {label}
        </CheckboxLabel>
      )}
    </div>
  );
};
