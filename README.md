# React Search & Filter

Search, filters, sorting, and pagination for React, powered by [Quickstate](https://www.npmjs.com/package/@quickstate/core). Bring your data source and result components; the module connects the controls.

[Live playground and API guide](https://react-search-and-filter.vercel.app) · [Source](https://github.com/xpatrykk/react-search-and-filter)

## Install

```sh
npm install @patrykparcheta/react-search-and-filter @quickstate/core
```

Peer dependencies: React 19, React DOM 19, and `@quickstate/core` 2. Node.js 22 or newer is required for local development.

## Quick start

```tsx
import {useMemo} from "react";
import {
  SearchAndFilterModule,
  type SearchAndFilterModuleWithStateProps,
} from "@patrykparcheta/react-search-and-filter";
import "@patrykparcheta/react-search-and-filter/styles.css";

type Item = {id: string; name: string};
type Results = {data: Item[]; total: number};

export function Catalog({initialResults}: {initialResults: Results}) {
  const state = useMemo<SearchAndFilterModuleWithStateProps<Item>["state"]>(() => ({
    results: initialResults,
    itemsPerPage: 12,
    filters: [{
      type: "select",
      key: "category",
      label: "Category",
      value: null,
      options: [{label: "Guides", value: "guide"}],
    }],
    searchFilter: {type: "search", key: "search", label: null, value: ""},
    sortFilter: {
      type: "select", key: "sort", label: "Sort", value: "name-asc",
      options: [{label: "Name: A–Z", value: "name-asc"}],
    },
    getResultItemKey: item => item.id,
    onRenderResultItem: item => <article><h3>{item.name}</h3></article>,
    onDataFetch: async request => {
      const response = await fetch("/api/catalog", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(request),
      });
      if (!response.ok) return {error: true};
      return response.json(); // Your endpoint returns {data: Item[], total: number}.
    },
  }), [initialResults]);

  return <SearchAndFilterModule state={state} />;
}
```

Implement the example `/api/catalog` endpoint for your application. The library sends filter descriptors, search, sort, and pagination state to your callback; your callback applies them and returns the requested page.

**The component does not fetch on mount.** Load the initial page in your server, loader, or application and pass it as `results`. Omitting it starts with an empty view. `total` is the number of all matching items before pagination, not the page length.

**Keep `state` identity stable.** State mode creates an internal store with `useMemo([state])`. Passing a fresh object on every render resets the store. A changed `initialResults` reference intentionally recreates it in the example above. Create one stable store instead when external state changes should preserve the current query.

## Component props

| Prop | Default | Meaning |
| --- | --- | --- |
| `mode` | `"state"` | Use `state`, or set `"store"` and provide `store`. |
| `state` | — | Initial partial module state. Requires `onDataFetch`, `getResultItemKey`, and `onRenderResultItem`. |
| `store` | — | `Store<SearchAndFilterModuleState<Item>>` in store mode. |
| `desktopFiltersDisplayMode` | `"sidebar"` | `"sidebar"` or `"drawer"`. Small screens use a drawer in both modes. |
| `messages` | English defaults | Partial UI copy overrides. |
| `locale` | `"en"` | Locale used for count formatting. |
| `className`, `style` | — | Applied to the `.rsf` wrapper. |

## Fetch contract

```ts
type OnDataFetch<Item> = (request: {
  page: number;
  itemsPerPage: number;
  filters: Filter[];
  searchFilter: SearchFilter | null;
  sortFilter: SortFilter | null;
}) => Promise<{data: Item[]; total: number} | {error: true}>;
```

- Page numbers start at 1. The default `itemsPerPage` is 25.
- Search waits 500 ms after the latest keystroke. Search, filter, sort, and clear actions request page 1.
- Search and sort are separate descriptors with fixed keys `"search"` and `"sort"`. Both are optional.
- Return `{error: true}` for an expected failure, or throw. Both show the error view; `onError(error)` receives thrown reasons.
- The built-in retry button repeats the last request action. If there is no previous action, retry requests the current page.
- Only the latest request for a store may commit results or errors. Separate stores are independent. The library does not abort network requests; cancellation belongs in your fetch layer if needed.
- Filter and query state tracks the latest action while it loads, including a failed action. The UI keeps the preceding results while a request loads.

The callback owns data validation, authorization, filtering semantics, sorting, and pagination. Validate API responses before returning them when they are not trusted.

## Filters

Import `Filter` or a specific filter type for typed descriptors. Every filter has a unique string `key`, a `label` (`string | null`), and a `value`.

| `type` | Value | Options |
| --- | --- | --- |
| `select` | `string | number | null` | `{label: string, value: string | number}[]` |
| `multi-select` | `(string | number)[] | null` | Same options; checkbox controls. |
| `multi-select-button` | `(string | number)[] | null` | `{label: ReactNode, value: string | number, icon?}[]`; pressed buttons. |
| `boolean` | `boolean | null` | No options. Optional `defaultValue` controls the cleared value. |
| `color` | `string[] | null` | `{label: string, value: string, swatch?: string | null}[]` |

```tsx
import type {Filter} from "@patrykparcheta/react-search-and-filter";

const filters: Filter[] = [
  {type: "select", key: "category", label: "Category", value: null,
    options: [{label: "Guides", value: "guide"}]},
  {type: "multi-select", key: "topics", label: "Topics", value: [],
    options: [{label: "Accessibility", value: "a11y"}]},
  {type: "multi-select-button", key: "format", label: "Format", value: [],
    options: [{label: "Article", value: "article"}]},
  {type: "boolean", key: "free", label: "Free only", value: false},
  {type: "color", key: "colors", label: "Color", value: [],
    options: [{label: "Blue", value: "blue", swatch: "#3868a8"}]},
];
```

Clear resets select values to `null`, multi-value controls to `[]`, search to an empty value, and booleans to `defaultValue ?? false`. Sorting is retained. Whether selected options mean AND or OR is decided by your fetch implementation.

## Render your results

| State field | Purpose |
| --- | --- |
| `getResultItemKey(item, index)` | Return a stable React key, usually the item ID. |
| `onRenderResultItem(item, index)` | Return your card or row. Indices are local to the page. |
| `resultsContainerElement` | `"div"` (default), `"ul"`, or `"ol"`. |
| `resultItemElement` | `"div"` (default) or `"li"`. Use `li` with a list container. |
| `resultsContainerClassName` | Set the grid or list classes for the results container. |
| `resultsLeadContent`, `resultsLeadContentClassName` | Content and wrapper classes above the results. |
| `renderNoResults()` | Replace the built-in empty view. |
| `hideFilters` | Hide all filter UI, including search. Defaults to `false`. |
| `mainContainerId` | Optional custom scroll target ID. Use unique IDs for multiple instances. |

Add content **between** groups of results with `resultsInsertion`:

```tsx
resultsInsertion: {
  repeatEveryItems: 6,
  wrapperClassName: "catalog-callout",
  render: ({chunk, insertionIndex, itemsRendered, itemsRemaining}) => (
    <aside>Explore another collection</aside>
  ),
}
```

Each chunk uses `resultsContainerClassName`. The insertion receives the chunk’s items and page-local counts; nothing is inserted after the final chunk. Use this for a callout or other content appropriate to your application.

## Copy and locale

`locale` changes number formatting. It does not select a translation. Pass caller-owned copy through `messages`; omitted keys fall back to English. Filter labels, placeholders, sort options, and result content are also supplied by your application.

```tsx
import {defaultMessages, type SearchAndFilterMessages} from
  "@patrykparcheta/react-search-and-filter";

const messages: Partial<SearchAndFilterMessages> = {
  searchLabel: "Szukaj",
  searchPlaceholder: "Szukaj materiałów…",
  clearAll: "Wyczyść filtry",
  resultsCount: ({count = 0}, locale) =>
    `Materiały: ${new Intl.NumberFormat(locale).format(count)}`,
  resultsCountCompact: "Materiały: {count}",
};

<SearchAndFilterModule state={state} locale="pl-PL" messages={messages} />;
```

Use a complete `SearchAndFilterMessages` object for a fully translated UI. The playground supplies its own English, Polish, and Spanish examples. They are demonstration copy, not built-in language packs.

Available message keys (also exported as `defaultMessages`):

```text
searchLabel, searchPlaceholder, clearAll, selectedLabel,
filtersTitle, closeFilters, noResultsTitle, noResultsDescription,
noResultsHint, resultsCount, resultsCountCompact, previousPage,
nextPage, page, paginationLabel, morePages, close, errorTitle,
retry, loading, sortLabel
```

Every message accepts a string or `(values: {count?: number}, locale: string) => string`. String messages may include `{count}`. Supply explicit accessible labels along with visible copy when translating.

## External Quickstate store

Use store mode to trigger actions from elsewhere in your application. Create a store once per mounted catalog; create separate stores for independent instances.

```tsx
import {useState} from "react";
import {makeStore} from "@quickstate/core";
import {
  SearchAndFilterModule,
  createInitialState,
  createStoreMethods,
  type SearchAndFilterModuleWithStateProps,
} from "@patrykparcheta/react-search-and-filter";

function ConnectedCatalog({state}: {
  state: SearchAndFilterModuleWithStateProps<Item>["state"];
}) {
  const [{store, actions}] = useState(() => {
    const store = makeStore({initialState: createInitialState<Item>({state})});
    return {store, actions: createStoreMethods({store})};
  });

  return <>
    <button onClick={() => void actions.handleSearch("layout")}>Find layout</button>
    <SearchAndFilterModule mode="store" store={store} />
  </>;
}
```

The methods are `handleSearch(value)`, `handleFilterChange(key, value)`, `handleSort(value)`, `handlePageChange(page)`, `clearSelectedFilters()`, and `retry()`. Store methods also expose selectors and `setKeyValue`; prefer the action methods for query changes so fetching and state updates stay coordinated.

`SearchAndFilterModuleStoreProvider` and `useSearchAndFilterModuleStoreContext` are exported for advanced integrations. The module already provides its own context. Never share a mutable module-level store across server requests or users. In a React Server Components application, render the module inside a client component and pass serializable initial data into that component.

## Styling

The ready-to-use stylesheet is optional:

```tsx
import "@patrykparcheta/react-search-and-filter/styles.css";
```

Import your own CSS after it. `className` and `style` target the module’s `.rsf` wrapper. Dialogs and menus render in portals marked `.rsf-portal` inside that instance, so they inherit its theme, language, and custom styles. The packaged component utilities are scoped to the module. Set theme variables on your instance when catalogs need different appearances.

For a Tailwind CSS v4 app that generates the library’s utilities itself, include its distributed JavaScript in your source scan:

```css
@import "tailwindcss";
@source "../node_modules/@patrykparcheta/react-search-and-filter/dist";
```

Adjust the source path relative to your CSS file. Provide your application’s semantic theme tokens (`background`, `foreground`, `primary`, `secondary`, `muted`, `border`, `input`, and `ring`, including foreground variants). Importing the packaged stylesheet is the simplest way to include the supplied component styles. Custom result classes and layouts remain your application’s responsibility.

## Develop

```sh
npm ci
npm run build
npm run docs:dev
```

The demo imports the package’s public exports, so build the library before starting the documentation dev server. The playground uses only invented data and CSS artwork. It makes no API requests and needs no private environment variables.

```sh
npm run typecheck
npm test
npm run docs:build
npm run test:browser
npm run check:pack
npm run audit:full
```

The browser suite exercises real controls in the documentation site. Its Playwright configuration starts the local server; install the configured Playwright browser if it is not available locally. Build outputs belong in `dist/` and `docs/dist/`.

## License

MIT © Patryk Parcheta. See [LICENSE](./LICENSE).
