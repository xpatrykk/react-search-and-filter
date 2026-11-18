"use client";

import { useEffect } from "react";

import { getScrollBehavior } from "./shared/scroll-behavior";

import { resolveVisibleScrollTarget } from "./use-scroll-to-results/resolve-visible-scroll-target";

interface UseScrollToResultsArgs {
  mainContainerId: string;
  scrollRequestCount: number;
}

export const useScrollToResults = ({
  mainContainerId,
  scrollRequestCount,
}: UseScrollToResultsArgs) => {
  useEffect(() => {
    if (!scrollRequestCount) {
      return;
    }

    const mainContainerElement = resolveVisibleScrollTarget(
      document.getElementById(mainContainerId),
    );

    mainContainerElement?.scrollIntoView({
      behavior: getScrollBehavior(),
      block: "start",
      inline: "start",
    });
  }, [mainContainerId, scrollRequestCount]);
};
