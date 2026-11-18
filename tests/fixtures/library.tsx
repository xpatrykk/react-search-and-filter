import { createRoot } from "react-dom/client";
import { SearchAndFilterModule } from "@patrykparcheta/react-search-and-filter";
import type {
  OnDataFetchProps,
  OnDataFetchResult,
} from "@patrykparcheta/react-search-and-filter";
declare global {
  interface Window {
    testScenario: "fast" | "deferred";
    libraryTest: {
      queries: OnDataFetchProps<string>[];
      pending: Array<(result: OnDataFetchResult<string>) => void>;
    };
  }
}
window.libraryTest = { queries: [], pending: [] };
const state = {
  onDataFetch: async (
    query: OnDataFetchProps<string>,
  ): Promise<OnDataFetchResult<string>> => {
    window.libraryTest.queries.push(query);
    if (window.testScenario === "deferred")
      return new Promise((resolve) => window.libraryTest.pending.push(resolve));
    return { data: [query.searchFilter?.value || "ready"], total: 40 };
  },
  results: { data: ["initial"], total: 40 },
  itemsPerPage: 10,
  onRenderResultItem: (item: string) => <p>{item}</p>,
  getResultItemKey: (item: string) => item,
  searchFilter: {
    key: "search" as const,
    type: "search" as const,
    value: null,
    label: "Search",
  },
  filters: [
    {
      key: "mixed",
      type: "select" as const,
      label: "Mixed types",
      value: null,
      options: [
        { value: 1, label: "Numeric one" },
        { value: "1", label: "String one" },
        { value: "", label: "Empty string" },
      ],
    },
  ],
};
createRoot(document.getElementById("root")!).render(
  <SearchAndFilterModule
    state={state}
    className="instance-theme"
    locale="pl"
    style={{ "--color-primary": "rgb(11, 22, 33)" } as React.CSSProperties}
  />,
);
