import { useMessages } from "../messages";
import { Button } from "../ui/button";
import { Fragment, createElement } from "react";

import { useSearchAndFilterModuleStoreContext } from "../store";

import { ResultsNotFound } from "./results-not-found";

export const Results = () => {
  const t = useMessages();
  const { useSelectValue, retry } = useSearchAndFilterModuleStoreContext();

  const getResultItemKey = useSelectValue("getResultItemKey");
  const resultsContainerElement = useSelectValue("resultsContainerElement");
  const resultsContainerClassName = useSelectValue("resultsContainerClassName");
  const resultItemElement = useSelectValue("resultItemElement");
  const results = useSelectValue("results");
  const resultsInsertion = useSelectValue("resultsInsertion");
  const onRenderResultItem = useSelectValue("onRenderResultItem");
  const status = useSelectValue("status");
  if (status === "error") {
    return (
      <div role="alert" className="rounded-xl border border-input p-6">
        <p>{t("errorTitle")}</p>
        <Button onClick={() => void retry()}>{t("retry")}</Button>
      </div>
    );
  }
  if (!results.total && status === "loading") return null;
  if (!results.total) {
    return <ResultsNotFound />;
  }

  const renderResultsChunk = (items: typeof results.data, offset: number) =>
    createElement(
      resultsContainerElement,
      {
        className: resultsContainerClassName,
      },
      items.map((item, index) =>
        createElement(
          resultItemElement,
          {
            key: getResultItemKey(item, offset + index),
            className: resultItemElement === "li" ? "list-none" : undefined,
          },
          onRenderResultItem(item, offset + index),
        ),
      ),
    );

  const repeatEveryItems = Math.max(
    1,
    Math.trunc(resultsInsertion?.repeatEveryItems ?? 0),
  );

  if (!resultsInsertion || results.data.length <= repeatEveryItems) {
    return renderResultsChunk(results.data, 0);
  }

  return (
    <div className="flex flex-col">
      {Array.from(
        { length: Math.ceil(results.data.length / repeatEveryItems) },
        (_, insertionIndex) => {
          const chunkStart = insertionIndex * repeatEveryItems;
          const chunk = results.data.slice(
            chunkStart,
            chunkStart + repeatEveryItems,
          );
          const itemsRendered = chunkStart + chunk.length;
          const itemsRemaining = results.data.length - itemsRendered;

          return (
            <Fragment key={`results-chunk-${chunkStart}`}>
              {renderResultsChunk(chunk, chunkStart)}
              {itemsRemaining > 0 ? (
                <div className={resultsInsertion.wrapperClassName ?? undefined}>
                  {resultsInsertion.render({
                    chunk,
                    insertionIndex,
                    itemsRendered,
                    itemsRemaining,
                  })}
                </div>
              ) : null}
            </Fragment>
          );
        },
      )}
    </div>
  );
};
