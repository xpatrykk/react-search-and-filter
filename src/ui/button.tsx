import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

import { cn } from "../shared/cn";

export const buttonVariants = cva(
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full font-sans text-sm font-[450] transition-colors duration-[180ms] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "border border-primary bg-secondary text-accent-foreground hover:bg-accent",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-primary bg-transparent text-primary hover:bg-secondary dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        outlineDestructive:
          "border-destructive border-1 text-destructive bg-background hover:bg-destructive hover:text-white dark:bg-input/30 dark:bg-destructive/20 dark:hover:bg-destructive/50 font-medium",
        secondary:
          "bg-secondary text-secondary-foreground  hover:bg-secondary/80 font-medium",
        ghost:
          "hover:bg-secondary hover:text-secondary-foreground dark:hover:bg-accent/50 font-medium",
        ghostDestructive:
          "text-destructive hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/50 font-medium",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-[50px] px-6 py-[13px] has-[>span>svg]:px-5",
        sm: "min-h-[46px] gap-1.5 px-4 py-2 has-[>span>svg]:px-3",
        lg: "min-h-13 px-7 py-3.5 has-[>span>svg]:px-6",
        icon: "size-11 p-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      type={asChild ? undefined : "button"}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
};
