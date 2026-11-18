import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import React from "react";

import { useMessages } from "../../messages";
import { cn } from "../../shared/cn";

import { Button } from "../button";

import { SheetOverlay } from "./sheet-overlay";
import { SheetPortal } from "./sheet-portal";

import type { SheetContentProps } from "./sheet-types";

export const SheetContent = ({
  className,
  children,
  side = "right",
  withClose = true,
  overlayClassName,
  ...props
}: SheetContentProps) => {
  const t = useMessages();
  return (
    <SheetPortal>
      <SheetOverlay className={overlayClassName} />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "rsf-portal",
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4  transition ease-in-out data-[state=closed]:duration-[180ms] data-[state=open]:duration-[240ms]",
          side === "right" &&
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" &&
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" &&
            "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" &&
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className,
        )}
        {...props}
      >
        {children}
        {withClose && (
          <SheetPrimitive.Close asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4  opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
            >
              <XIcon />
              <span className="sr-only">{t("close")}</span>
            </Button>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
};
