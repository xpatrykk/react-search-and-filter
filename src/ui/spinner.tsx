import { type VariantProps, cva } from "class-variance-authority";
import { clsx } from "clsx";
import { Loader2 } from "lucide-react";
import React from "react";

import { cn } from "../shared/cn";

const spinnerVariants = cva("flex-col items-center justify-center", {
  variants: {
    show: {
      true: "flex",
      false: "hidden",
    },
  },
  defaultVariants: {
    show: true,
  },
});

const loaderVariants = cva("animate-spin text-primary", {
  variants: {
    size: {
      small: "size-6",
      medium: "size-8",
      large: "size-12",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

interface SpinnerContentProps
  extends
    VariantProps<typeof spinnerVariants>,
    VariantProps<typeof loaderVariants> {
  className?: string;
  children?: React.ReactNode;
  asBox?: boolean;
  label?: string;
}

export const Spinner = ({
  size,
  show,
  children,
  className,
  asBox = true,
  label,
}: SpinnerContentProps) => {
  return (
    <span
      role="status"
      aria-live="polite"
      className={clsx(spinnerVariants({ show }), asBox && "bg-background p-3")}
    >
      <Loader2
        aria-hidden="true"
        className={cn(loaderVariants({ size }), className)}
      />
      {label ? <span className="sr-only">{label}</span> : null}
      {children}
    </span>
  );
};
