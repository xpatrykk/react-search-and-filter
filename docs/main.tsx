import { createRoot } from "react-dom/client";
import "@patrykparcheta/react-search-and-filter/styles.css";
import "./style.css";
import { IndependentDemo, ResourceDemo } from "./demo";

const quickStart = `import {useMemo} from "react";
import {SearchAndFilterModule} from
  "@patrykparcheta/react-search-and-filter";
import "@patrykparcheta/react-search-and-filter/styles.css";

function Catalog({initialResults}) {
  const state = useMemo(() => ({
    results: initialResults,
    itemsPerPage: 12,
    filters: [],
    searchFilter: {
      type: "search", key: "search",
      label: null, value: "",
    },
    getResultItemKey: item => item.id,
    onRenderResultItem: item => <h3>{item.name}</h3>,
    onDataFetch: async request => {
      const response = await fetch("/api/catalog", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(request),
      });
      if (!response.ok) return {error: true};
      return response.json(); // {data, total}
    },
  }), [initialResults]);

  return <SearchAndFilterModule state={state} />;
}`;

const filterExample = `const filters: Filter[] = [
  {type: "select", key: "category", label: "Category",
    value: null, options: [{label: "Guides", value: "guide"}]},
  {type: "multi-select", key: "topic", label: "Topics",
    value: [], options: [{label: "Layout", value: "layout"}]},
  {type: "multi-select-button", key: "format", label: "Format",
    value: [], options: [{label: "Article", value: "article"}]},
  {type: "boolean", key: "free", label: "Free only", value: false},
  {type: "color", key: "color", label: "Color", value: [],
    options: [{label: "Blue", value: "blue", swatch: "#3868a8"}]},
];`;

const customCopy = `<SearchAndFilterModule
  state={state}
  locale="pl-PL"
  messages={{
    searchLabel: "Szukaj",
    searchPlaceholder: "Szukaj materiałów…",
    clearAll: "Wyczyść filtry",
    resultsCount: ({count = 0}, locale) =>
      "Materiały: " + new Intl.NumberFormat(locale).format(count),
  }}
/>`;

const advanced = `import {makeStore} from "@quickstate/core";
import {createInitialState, createStoreMethods,
  SearchAndFilterModule} from
  "@patrykparcheta/react-search-and-filter";

// Create once per mounted catalog, with useState or useMemo.
const store = makeStore({
  initialState: createInitialState({state}),
});
const actions = createStoreMethods({store});

<SearchAndFilterModule mode="store" store={store} />;
await actions.handleSearch("layout");
await actions.handleFilterChange("category", "guide");
await actions.handleSort("name-asc");
await actions.handlePageChange(2);
await actions.clearSelectedFilters();
await actions.retry();`;

function Code({
  children,
  label = "TSX",
}: {
  children: string;
  label?: string;
}) {
  return (
    <div className="code-block">
      <div className="code-label">{label}</div>
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
}

function App() {
  return (
    <>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <header className="site-header">
        <div className="site-shell header-inner">
          <a
            className="brand"
            href="#"
            aria-label="React Search and Filter home"
          >
            <span className="brand-icon" aria-hidden="true">
              ⌘
            </span>
            <span>
              Search <span className="muted">&</span> Filter
            </span>
            <span className="version">React</span>
          </a>
          <nav aria-label="Main navigation">
            <a href="#playground">Playground</a>
            <a href="#quick-start">Quick start</a>
            <a href="#api">API</a>
            <a
              className="github-link"
              href="https://github.com/xpatrykk/react-search-and-filter"
            >
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </div>
      </header>

      <main id="content">
        <section className="site-shell hero">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="tiny-star" aria-hidden="true">
                ✳
              </span>{" "}
              A useful little React library
            </span>
            <h1>
              Your data.
              <br />
              Easier to <span>explore.</span>
            </h1>
            <p>
              Search, filters, sorting, and pagination that work together. Bring
              your data and your components. Keep the experience yours.
            </p>
            <div className="hero-actions">
              <a className="primary-link" href="#playground">
                Try the playground <span aria-hidden="true">↓</span>
              </a>
              <a className="secondary-link" href="#quick-start">
                Start building <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="hero-notes">
              <span>React 19</span>
              <span>TypeScript</span>
              <span>Powered by Quickstate</span>
              <span>MIT license</span>
            </div>
          </div>
          <div className="hero-visual" aria-label="Library overview">
            <div className="visual-top">
              <span className="status-dot" /> One component. The whole flow.
              <span className="visual-kicker">01—05</span>
            </div>
            <div className="flow-search">
              <span aria-hidden="true">⌕</span> Find something useful
              <span className="keycap" aria-hidden="true">
                ↵
              </span>
            </div>
            <div className="flow-tags">
              <span className="active">Search</span>
              <span>Filter</span>
              <span>Sort</span>
              <span>Paginate</span>
            </div>
            <div className="visual-cards" aria-hidden="true">
              <div>
                <i />
                <b />
                <small />
              </div>
              <div>
                <i />
                <b />
                <small />
              </div>
              <div>
                <i />
                <b />
                <small />
              </div>
            </div>
            <div className="visual-footer">
              <span>Your API → Your results</span>
              <span>Less glue code. More building.</span>
            </div>
          </div>
        </section>

        <div className="feature-strip">
          <div className="site-shell">
            <span>
              <b>05</b> filter controls
            </span>
            <span>
              <b>02</b> desktop layouts
            </span>
            <span>
              <b>01</b> consistent request contract
            </span>
            <span>
              <b>∞</b> ways to render your data
            </span>
          </div>
        </div>

        <section id="playground" className="playground-section site-shell">
          <div className="section-intro">
            <div>
              <span className="eyebrow">See it in action</span>
              <h2>A library for your library.</h2>
            </div>
            <p>
              Explore an invented collection of design and development
              resources. Every control below comes from the package.
            </p>
          </div>
          <ResourceDemo />
          <p className="under-demo">
            Switch the UI copy to see caller-provided translations. Resource
            names and filter options stay in English. On smaller screens,
            filters open in a keyboard-accessible drawer.
          </p>
          <IndependentDemo />
        </section>

        <section id="quick-start" className="docs-section site-shell">
          <div className="docs-sidebar">
            <span className="eyebrow">Get started</span>
            <h2>
              A small API.
              <br />A clear contract.
            </h2>
            <p>
              Keep data fetching and result rendering in your app. The module
              connects the controls.
            </p>
            <a href="https://github.com/xpatrykk/react-search-and-filter#readme">
              Read the README <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="docs-body">
            <article>
              <div className="step-heading">
                <span>01</span>
                <h3>Install the package</h3>
              </div>
              <Code label="Terminal">
                npm install @patrykparcheta/react-search-and-filter
                @quickstate/core
              </Code>
              <p>
                Requires React 19, React DOM 19, and Quickstate 2. The optional
                stylesheet includes the module’s compiled styles.
              </p>
            </article>
            <article>
              <div className="step-heading">
                <span>02</span>
                <h3>Bring your results and fetch function</h3>
              </div>
              <Code>{quickStart}</Code>
              <div className="callout">
                <strong>Initial results are yours to load.</strong>
                <p>
                  The component does not fetch on mount. Provide{" "}
                  <code>results: {"{data, total}"}</code> from your server or
                  loader. Keep <code>state</code> memoized: a new object creates
                  a new internal store.
                </p>
              </div>
              <p>
                The endpoint above is an example you implement. Its response
                must match <code>{"{data: Item[], total: number}"}</code>;{" "}
                <code>total</code> is the count before pagination.
              </p>
            </article>
            <article>
              <div className="step-heading">
                <span>03</span>
                <h3>Add the controls your data needs</h3>
              </div>
              <Code>{filterExample}</Code>
              <p>
                Set <code>searchFilter</code> and <code>sortFilter</code>{" "}
                separately. Your fetch function decides how filter values map to
                your API. The package does not filter, sort, or paginate your
                data for you.
              </p>
            </article>
          </div>
        </section>

        <section id="api" className="api-section site-shell">
          <div className="section-intro">
            <div>
              <span className="eyebrow">The reference</span>
              <h2>Make it fit.</h2>
            </div>
            <p>
              Use state mode for a self-contained catalog, or bring a Quickstate
              store when the rest of your app needs control.
            </p>
          </div>
          <div className="api-grid">
            <article className="api-card">
              <span className="api-number">01 / Component</span>
              <h3>Props that set the stage</h3>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Prop</th>
                      <th>Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>state</code>
                      </td>
                      <td>
                        Initial state in default state mode. Required: fetch,
                        render, and key callbacks.
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>mode="store"</code>
                        <br />
                        <code>store</code>
                      </td>
                      <td>
                        Use your own stable Quickstate store instead of{" "}
                        <code>state</code>.
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>desktopFiltersDisplayMode</code>
                      </td>
                      <td>
                        <code>"sidebar"</code> (default) or{" "}
                        <code>"drawer"</code>. Smaller screens always use the
                        drawer.
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>messages</code> / <code>locale</code>
                      </td>
                      <td>
                        Override UI copy and number formatting. Defaults to
                        English and <code>"en"</code>.
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>className</code> / <code>style</code>
                      </td>
                      <td>
                        Style the module’s <code>.rsf</code> wrapper.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>
            <article className="api-card">
              <span className="api-number">02 / Requests</span>
              <h3>One shape for every interaction</h3>
              <Code>{`onDataFetch({
  page, itemsPerPage, filters,
  searchFilter, sortFilter,
}) => Promise<{data: Item[], total: number}
  | {error: true}>`}</Code>
              <p>
                Page numbers start at 1. Filter, search, sort, and clear actions
                request page 1. Search waits 500 ms after typing.
              </p>
              <p>
                A returned error or a thrown exception opens the error state.{" "}
                <code>onError</code> receives thrown reasons. “Try again”
                retries the last action. The latest request wins within each
                store; requests are not aborted.
              </p>
            </article>
            <article className="api-card">
              <span className="api-number">03 / Presentation</span>
              <h3>Your components, in the results</h3>
              <p>
                <code>getResultItemKey(item, index)</code> must return a stable
                React key. <code>onRenderResultItem(item, index)</code> returns
                your card or row. Indices refer to the current page.
              </p>
              <p>
                Choose <code>resultsContainerElement</code> (<code>div</code>,{" "}
                <code>ul</code>, <code>ol</code>) and{" "}
                <code>resultItemElement</code> (<code>div</code>,{" "}
                <code>li</code>). Pair lists with <code>li</code>. Use{" "}
                <code>resultsContainerClassName</code> for the grid.
              </p>
              <p>
                <code>resultsLeadContent</code> adds content above results.{" "}
                <code>renderNoResults</code> replaces the empty view.{" "}
                <code>hideFilters</code> hides the filter UI, including search.
              </p>
            </article>
            <article className="api-card">
              <span className="api-number">04 / In-between content</span>
              <h3>A little room between results</h3>
              <Code>{`resultsInsertion: {
  repeatEveryItems: 6,
  wrapperClassName: "my-callout",
  render: ({chunk, insertionIndex,
    itemsRendered, itemsRemaining}) => (
    <aside>Keep exploring…</aside>
  ),
}`}</Code>
              <p>
                Insert content between chunks on the current page. There is no
                trailing insertion after the last chunk. Each chunk uses your
                results container class.
              </p>
            </article>
          </div>
          <div className="detail-grid">
            <article>
              <span className="eyebrow">Copy & locale</span>
              <h3>Speak your users’ language.</h3>
              <p>
                <code>locale</code> formats counts; it does not translate the
                UI. Supply your own <code>messages</code> for every translated
                label, including error and accessibility text. Missing keys fall
                back to English. Filter labels and option text are also yours.
              </p>
              <Code>{customCopy}</Code>
              <p>
                Message values accept a string (with <code>{"{count}"}</code>)
                or a <code>(values, locale) =&gt; string</code> function.
                Exported <code>SearchAndFilterMessages</code> and{" "}
                <code>defaultMessages</code> list all keys.
              </p>
            </article>
            <article>
              <span className="eyebrow">Advanced state</span>
              <h3>Connect it to the rest of your app.</h3>
              <p>
                Keep the store stable and create it per catalog or request. A
                shared store intentionally shares state between instances;
                separate stores stay independent.
              </p>
              <Code>{advanced}</Code>
              <p>
                In server-rendered apps, create stores per request. Do not share
                a mutable module-level store between users.
              </p>
            </article>
          </div>
          <article className="styling-note">
            <div>
              <span className="eyebrow">Styling</span>
              <h3>A starting point you can own.</h3>
              <p>
                Import{" "}
                <code>@patrykparcheta/react-search-and-filter/styles.css</code>{" "}
                for ready-to-use styles, then add your overrides. Styles are
                scoped to the module’s <code>.rsf</code> root. Menus and drawers
                render inside that instance and inherit its theme, language, and
                custom styles.
              </p>
            </div>
            <div>
              <p>
                Using your own Tailwind v4 build instead? Include the package’s
                compiled JavaScript as a source, and define the semantic color
                tokens your theme uses.
              </p>
              <Code label="CSS">{`@import "tailwindcss";
@source "../node_modules/@patrykparcheta/react-search-and-filter/dist";
/* Adjust this path relative to your CSS file. */`}</Code>
              <p>
                The packaged stylesheet is the easiest way to include all
                component styles. Custom result classes still belong to your
                app.
              </p>
            </div>
          </article>
        </section>
      </main>
      <footer className="site-footer site-shell">
        <a className="brand" href="#">
          Search <span className="muted">&</span> Filter
        </a>
        <span>Built for the things you’re building.</span>
        <a href="https://github.com/xpatrykk/react-search-and-filter">
          Open source · MIT <span aria-hidden="true">↗</span>
        </a>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
