import { createElement, type HTMLAttributes } from "react";
import { cn } from "../shared/cn";
export const Typography = ({
  as = "p",
  variant,
  mb,
  className,
  ...props
}: HTMLAttributes<HTMLElement> & {
  as?: "p" | "div" | "h2" | "h3";
  variant?: string;
  mb?: string;
}) =>
  createElement(as, {
    ...props,
    className: cn(
      variant === "h4"
        ? "text-2xl"
        : variant === "h6"
          ? "text-xl"
          : "text-base leading-7",
      mb === "6" ? "mb-6" : mb === "4" ? "mb-4" : undefined,
      className,
    ),
  });
