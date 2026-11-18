import { X } from "lucide-react";

import { Button } from "../ui/button";
import { SheetHeader, SheetTitle } from "../ui/sheet";
import { Typography } from "../ui/typography";

interface FilterSheetHeaderProps {
  title: string;
  closeAriaLabel: string;
  onClose: () => void;
}

export const FilterSheetHeader = ({
  title,
  closeAriaLabel,
  onClose,
}: FilterSheetHeaderProps) => {
  return (
    <div className="flex items-center justify-between border-b border-input bg-secondary">
      <SheetHeader className="text-left">
        <SheetTitle asChild>
          <Typography as="h2" variant="h6" className="font-normal">
            {title}
          </Typography>
        </SheetTitle>
      </SheetHeader>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        aria-label={closeAriaLabel}
      >
        <X aria-hidden="true" />
      </Button>
    </div>
  );
};
