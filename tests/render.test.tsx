import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { SearchAndFilterModule } from "../src";
import type { SearchAndFilterModuleWithStateProps } from "../src/types";
const state: SearchAndFilterModuleWithStateProps<string>["state"] = {
  onDataFetch: async () => ({ data: [], total: 0 }),
  onRenderResultItem: (item) => item,
  getResultItemKey: (item) => item,
  searchFilter: { key: "search", type: "search", value: null, label: "Search" },
  results: { data: ["Paper"], total: 20000 },
};
describe("customizable accessible rendering", () => {
  it("uses instance copy and locale without leaking between siblings", () => {
    const html = renderToStaticMarkup(
      <>
        <SearchAndFilterModule
          state={state}
          locale="pl-PL"
          messages={{
            searchLabel: "Szukaj zasobów",
            resultsCount: ({ count }, locale) =>
              `${new Intl.NumberFormat(locale).format(count!)} zasobów`,
          }}
        />
        <SearchAndFilterModule state={state} />
      </>,
    );
    expect(html).toContain('aria-label="Szukaj zasobów"');
    expect(html).toContain("20 000 zasobów");
    expect(html).toContain('aria-label="Search"');
  });
  it("does not share a scroll target between default instances", () => {
    const html = renderToStaticMarkup(
      <>
        <SearchAndFilterModule state={state} />
        <SearchAndFilterModule state={state} />
      </>,
    );
    const ids = [...html.matchAll(/ id="([^"]+)"/g)].map((match) => match[1]);
    expect(ids.length).toBeGreaterThanOrEqual(2);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("shows an error instead of presenting empty inventory", () => {
    const html = renderToStaticMarkup(
      <SearchAndFilterModule
        state={{ ...state, status: "error", results: { data: [], total: 0 } }}
      />,
    );
    expect(html).toContain('role="alert"');
    expect(html).toContain("Try again");
    expect(html).not.toContain("Nothing matched");
  });
  it("uses the supplied empty renderer for successful empty results", () => {
    const html = renderToStaticMarkup(
      <SearchAndFilterModule
        state={{
          ...state,
          results: { data: [], total: 0 },
          renderNoResults: () => <p>Choose another collection</p>,
        }}
      />,
    );
    expect(html).toContain("Choose another collection");
    expect(html).not.toContain('role="alert"');
  });
});
