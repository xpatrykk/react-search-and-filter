import { useMessages } from "../messages";
import { Typography } from "../ui/typography";

import { useSearchAndFilterModuleStoreContext } from "../store";

export const ResultsCount = () => {
  const t = useMessages();
  const { useSelectValue } = useSearchAndFilterModuleStoreContext();

  const { total } = useSelectValue("results");

  const status = useSelectValue("status");
  if (!total || status === "error") {
    return null;
  }

  return (
    <Typography
      aria-live="polite"
      variant="body"
      className="whitespace-nowrap text-xs text-muted-foreground md:text-[13px]"
    >
      <span className="md:hidden">
        {t("resultsCountCompact", { count: total })}
      </span>
      <span className="hidden md:inline">
        {t("resultsCount", { count: total })}
      </span>
    </Typography>
  );
};
