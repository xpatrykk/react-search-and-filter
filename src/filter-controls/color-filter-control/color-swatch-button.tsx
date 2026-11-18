import clsx from "clsx";
import { CheckIcon } from "lucide-react";

import { Button } from "../../ui/button";

import { isValidColorSwatch } from "../filter-control-helpers";

import type { ColorSwatchButtonProps } from "../color-filter-control";

export const ColorSwatchButton = ({
  checked,
  disabled,
  option,
  onClick,
}: ColorSwatchButtonProps) => {
  const swatch = isValidColorSwatch(option.swatch) ? option.swatch : null;
  const showInitial = !checked && !swatch;

  return (
    <div className="flex w-16 flex-col items-center text-center">
      <Button
        type="button"
        style={swatch ? { backgroundColor: swatch } : undefined}
        title={option.label}
        aria-label={option.label}
        aria-pressed={checked}
        disabled={disabled}
        variant={checked ? "default" : "outline"}
        className={clsx(
          "h-12 w-12 border-2 border-transparent px-1 hover:opacity-60",
          swatch ? "text-white" : "bg-transparent text-[10px]",
          checked && "border-primary ring-2 ring-primary/25",
        )}
        onClick={onClick}
      >
        {checked && <CheckIcon className="h-4 w-4" aria-hidden="true" />}
        {showInitial ? option.label.slice(0, 1).toUpperCase() : null}
      </Button>
      <span
        className={clsx(
          "mt-1 block text-center text-[11px] leading-tight",
          checked && "font-semibold",
        )}
      >
        {option.label}
      </span>
    </div>
  );
};
