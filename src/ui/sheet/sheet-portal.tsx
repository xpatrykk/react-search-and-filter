import { usePortalContainer } from "../../messages";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import type { ComponentProps } from "react";
export const SheetPortal = (
  props: ComponentProps<typeof SheetPrimitive.Portal>,
) => {
  const container = usePortalContainer();
  if (!container) return null;
  return <SheetPrimitive.Portal {...props} container={container} />;
};
