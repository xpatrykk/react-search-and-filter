import { describe, expect, it } from "vitest";
import { makeStore } from "@quickstate/core";
import { createInitialState } from "../src/store/create-initial-state";
import { createStoreMethods } from "../src/store/create-store-methods";
import type { OnDataFetch, OnDataFetchResult } from "../src/types";

const deferred = () => {
  let resolve!: (result: OnDataFetchResult<string>) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<OnDataFetchResult<string>>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
};
const setup = (onDataFetch: OnDataFetch<string>) => {
  const store = makeStore({
    initialState: createInitialState<string>({
      state: {
        onDataFetch,
        getResultItemKey: (item) => item,
        onRenderResultItem: (item) => item,
        results: { data: ["initial"], total: 40 },
        page: 2,
        itemsPerPage: 10,
        searchFilter: {
          key: "search",
          type: "search",
          label: "Search",
          value: "",
        },
        sortFilter: {
          key: "sort",
          type: "select",
          label: "Sort",
          value: "name",
          options: [
            { value: "name", label: "Name" },
            { value: "date", label: "Date" },
          ],
        },
        filters: [
          {
            key: "kind",
            type: "multi-select",
            label: "Kind",
            value: null,
            options: [{ value: "book", label: "Book" }],
          },
        ],
      },
    }),
  });
  return { store, actions: createStoreMethods({ store }) };
};
describe("request lifecycle", () => {
  it("sends normalized queries and resets page after search", async () => {
    const queries: unknown[] = [];
    const { store, actions } = setup(async (query) => {
      queries.push(query);
      return { data: ["found"], total: 1 };
    });
    await actions.handleSearch("  found  ");
    expect(queries[0]).toMatchObject({
      page: 1,
      searchFilter: { value: "found" },
    });
    expect(store.getState()).toMatchObject({
      page: 1,
      status: "loaded",
      results: { data: ["found"], total: 1 },
    });
  });
  it("keeps newer results when an older action finishes last", async () => {
    const older = deferred();
    const newer = deferred();
    let call = 0;
    const { store, actions } = setup(() =>
      ++call === 1 ? older.promise : newer.promise,
    );
    const first = actions.handleSearch("old");
    const second = actions.handleSort("date");
    newer.resolve({ data: ["new"], total: 1 });
    await second;
    older.resolve({ data: ["old"], total: 2 });
    await first;
    expect(store.getState()).toMatchObject({
      status: "loaded",
      results: { data: ["new"], total: 1 },
      sortFilter: { value: "date" },
    });
  });
  it("ignores a stale failure while the newer request is loading", async () => {
    const older = deferred();
    const newer = deferred();
    let call = 0;
    const { store, actions } = setup(() =>
      ++call === 1 ? older.promise : newer.promise,
    );
    const first = actions.handleSearch("old");
    const second = actions.handleSearch("new");
    older.resolve({ error: true });
    await first;
    expect(store.getState().status).toBe("loading");
    newer.resolve({ data: [], total: 0 });
    await second;
    expect(store.getState()).toMatchObject({
      status: "loaded",
      results: { data: [], total: 0 },
    });
  });
  it("retains successful results on failure and recovers on retry", async () => {
    let fail = true;
    const { store, actions } = setup(async () =>
      fail ? { error: true } : { data: [], total: 0 },
    );
    await actions.handleSearch("none");
    expect(store.getState()).toMatchObject({
      status: "error",
      results: { data: ["initial"], total: 40 },
      page: 1,
      searchFilter: { value: "none" },
    });
    fail = false;
    await actions.handleSearch("none");
    expect(store.getState()).toMatchObject({
      status: "loaded",
      results: { data: [], total: 0 },
      page: 1,
    });
  });
  it("keeps stores independent", async () => {
    const one = setup(async () => ({ data: ["one"], total: 1 }));
    const two = setup(async () => ({ data: ["two"], total: 1 }));
    await one.actions.handleSearch("one");
    expect(two.store.getState()).toMatchObject({
      page: 2,
      results: { data: ["initial"], total: 40 },
      searchFilter: { value: null },
    });
  });
  it.each([NaN, Infinity, 0.5, -2])(
    "normalizes invalid itemsPerPage %s to a positive integer",
    (value) => {
      const state = createInitialState({
        state: {
          onDataFetch: async () => ({ data: [], total: 0 }),
          getResultItemKey: () => 1,
          onRenderResultItem: () => null,
          itemsPerPage: value,
          page: value,
        },
      });
      expect(
        Number.isInteger(state.itemsPerPage) && state.itemsPerPage >= 1,
      ).toBe(true);
      expect(Number.isInteger(state.page) && state.page >= 1).toBe(true);
    },
  );
});

it("reports the actual thrown reason and permits later recovery", async () => {
  const reason = new Error("offline");
  const reported: unknown[] = [];
  const { store, actions } = setup(async () => {
    throw reason;
  });
  store.setState({
    ...store.getState(),
    onError: (error: unknown) => reported.push(error),
  });
  await actions.handleSearch("test");
  expect(store.getState().status).toBe("error");
  expect(reported).toEqual([reason]);
});

it("normalizes page changes before invoking the data adapter", async () => {
  const pages: number[] = [];
  const { actions } = setup(async (query) => {
    pages.push(query.page);
    return { data: ["ok"], total: 40 };
  });
  await actions.handlePageChange(2.8);
  await actions.handlePageChange(NaN);
  await actions.handlePageChange(Infinity);
  expect(pages).toEqual([2, 1, 1]);
});

it("retries the last failed search rather than the prior page", async () => {
  const queries: unknown[] = [];
  let fail = true;
  const { store, actions } = setup(async (query) => {
    queries.push(query);
    return fail ? { error: true } : { data: ["recovered"], total: 1 };
  });
  await actions.handleSearch("lost");
  fail = false;
  await actions.retry();
  expect(queries).toHaveLength(2);
  expect(queries[1]).toMatchObject({
    page: 1,
    searchFilter: { value: "lost" },
  });
  expect(store.getState().results.data).toEqual(["recovered"]);
});

it.each([-1, NaN, Infinity, 1.5])(
  "rejects invalid adapter totals %s",
  async (total) => {
    const { store, actions } = setup(async () => ({ data: [], total }));
    await actions.handleSearch("bad");
    expect(store.getState().status).toBe("error");
    expect(store.getState().results.data).toEqual(["initial"]);
  },
);

it("composes overlapping search and sort intent", async () => {
  const old = deferred(),
    newer = deferred();
  const queries: unknown[] = [];
  const { store, actions } = setup((query) => {
    queries.push(query);
    return queries.length === 1 ? old.promise : newer.promise;
  });
  const one = actions.handleSearch("oak");
  const two = actions.handleSort("date");
  expect(queries[1]).toMatchObject({
    page: 1,
    searchFilter: { value: "oak" },
    sortFilter: { value: "date" },
  });
  newer.resolve({ data: ["oak-new"], total: 1 });
  await two;
  old.resolve({ data: ["oak-old"], total: 1 });
  await one;
  expect(store.getState()).toMatchObject({
    searchFilter: { value: "oak" },
    sortFilter: { value: "date" },
    results: { data: ["oak-new"] },
  });
});
it("refetches the valid page when results shrink", async () => {
  const pages: number[] = [];
  const { store, actions } = setup(async (query) => {
    pages.push(query.page);
    return { data: query.page === 1 ? ["remaining"] : [], total: 9 };
  });
  await actions.handlePageChange(4);
  expect(pages).toEqual([4, 1]);
  expect(store.getState()).toMatchObject({
    page: 1,
    results: { data: ["remaining"], total: 9 },
  });
});
it("cannot be left loading by an error observer that throws", async () => {
  const { store, actions } = setup(async () => {
    throw new Error("offline");
  });
  store.setKeyValue("onError", () => {
    throw new Error("reporter failed");
  });
  await actions.handleSearch("oak");
  expect(store.getState().status).toBe("error");
});
it("rejects totals that would make pagination unsafe", async () => {
  const { store, actions } = setup(async () => ({ data: [], total: 1e30 }));
  await actions.handleSearch("unsafe");
  expect(store.getState().status).toBe("error");
});
