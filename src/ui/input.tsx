import React from "react";

import { cn } from "../shared/cn";

interface InputProps extends React.ComponentProps<"input"> {
  rightElement?: React.ReactNode;
  wrapperClassName?: string;
  rightElementClassName?: string;
}

export const Input = ({
  className,
  type,
  rightElement,
  wrapperClassName,
  rightElementClassName,
  ...props
}: InputProps) => {
  return (
    <div
      className={cn(
        "border-input dark:bg-input/30 flex h-12 w-full items-center gap-3 rounded-[4px] border bg-background px-4 transition-[color,box-shadow] focus-within:border-ring focus-within:ring-ring/30 focus-within:ring-[3px] has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive",
        wrapperClassName,
      )}
    >
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-full w-full min-w-0 flex-1 border-0 bg-transparent px-0 py-1 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
      {rightElement && (
        <div
          className={cn("flex shrink-0 items-center", rightElementClassName)}
        >
          {rightElement}
        </div>
      )}
    </div>
  );
};
