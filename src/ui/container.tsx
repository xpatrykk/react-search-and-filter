import type { ComponentProps } from "react";
import { cn } from "../shared/cn";
export const Container = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn(
      "mx-auto w-full max-w-[1376px] px-5 md:px-8 xl:px-16",
      className,
    )}
    {...props}
  />
);
