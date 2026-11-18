import { useMessages } from "../../messages";

import { isValidColorSwatch } from "../filter-control-helpers";

import type { SelectedColorChipsProps } from "../color-filter-control";

export const SelectedColorChips = ({
  options,
  selectedValues,
}: SelectedColorChipsProps) => {
  const t = useMessages();
  const selectedOptions = options.filter((option) =>
    selectedValues.has(option.value),
  );

  if (!selectedOptions.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-border bg-secondary p-3">
      <p className="mb-2 text-xs font-medium">{t("selectedLabel")}</p>
      <div className="flex flex-wrap gap-2">
        {selectedOptions.map((option) => (
          <div
            key={`selected-${option.value}`}
            className="inline-flex min-w-0 items-center gap-1.5 rounded-full border bg-background px-2.5 py-1 text-xs"
          >
            <span
              className="h-2.5 w-2.5 rounded-full border border-border/60"
              style={
                isValidColorSwatch(option.swatch)
                  ? { backgroundColor: option.swatch }
                  : undefined
              }
            />
            <span>{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
