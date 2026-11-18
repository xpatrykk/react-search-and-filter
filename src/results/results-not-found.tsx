import React from "react";

import { useMessages } from "../messages";
import { Typography } from "../ui/typography";

import { useSearchAndFilterModuleStoreContext } from "../store";

export const ResultsNotFound = () => {
  const t = useMessages();
  const { useSelectValue } = useSearchAndFilterModuleStoreContext();
  const renderNoResults = useSelectValue("renderNoResults");

  if (renderNoResults) {
    return <>{renderNoResults()}</>;
  }

  return (
    <div className="rounded-3xl border border-input bg-secondary px-5 py-12 text-center md:px-8 md:py-16">
      <Typography as="h3" variant="h4" mb="6">
        {t("noResultsTitle")}
      </Typography>
      <Typography as="p" variant="subtitle" mb="4">
        {t("noResultsDescription")} <br />
        {t("noResultsHint")}
      </Typography>
    </div>
  );
};
