import { makeStore } from "@quickstate/core";
import { useMemo, useRef, useState } from "react";
import {
  SearchAndFilterModule,
  createInitialState,
  createStoreMethods,
  type DesktopFiltersDisplayMode,
  type Filter,
  type OnDataFetchProps,
  type SearchAndFilterMessages,
  type SearchAndFilterModuleWithStateProps,
} from "@patrykparcheta/react-search-and-filter";

type Resource = {
  id: string;
  name: string;
  description: string;
  category: string;
  topic: string;
  format: string;
  free: boolean;
  color: string;
};

const rows = [
  [
    "Atlas layout kit",
    "A small foundation for generous, responsive interfaces.",
    "Tools",
    "Layout",
    "Snippet",
    true,
    "Blue",
  ],
  [
    "Beacon contrast guide",
    "Make text and controls easier for everyone to read.",
    "Guides",
    "Accessibility",
    "Article",
    true,
    "Amber",
  ],
  [
    "Canvas interaction patterns",
    "Thoughtful details for everyday user interactions.",
    "Patterns",
    "Layout",
    "Article",
    false,
    "Violet",
  ],
  [
    "Delta performance checklist",
    "A practical route to a quicker first render.",
    "Guides",
    "Performance",
    "Article",
    true,
    "Blue",
  ],
  [
    "Ember component tokens",
    "Bring consistent color and spacing to your components.",
    "Tools",
    "Layout",
    "Snippet",
    true,
    "Amber",
  ],
  [
    "Field form patterns",
    "Clear labels, helpful errors, and forgiving inputs.",
    "Patterns",
    "Accessibility",
    "Snippet",
    true,
    "Violet",
  ],
  [
    "Grove grid builder",
    "Compose flexible layouts with a handful of rules.",
    "Tools",
    "Layout",
    "Snippet",
    false,
    "Blue",
  ],
  [
    "Harbor keyboard guide",
    "Keep every important action within keyboard reach.",
    "Guides",
    "Accessibility",
    "Article",
    true,
    "Amber",
  ],
  [
    "Indigo loading patterns",
    "Give people useful feedback while work is in flight.",
    "Patterns",
    "Performance",
    "Snippet",
    true,
    "Violet",
  ],
  [
    "Juniper bundle notes",
    "Understand the code you ship and what to leave out.",
    "Guides",
    "Performance",
    "Article",
    false,
    "Blue",
  ],
  [
    "Kite focus toolkit",
    "Build visible focus states that fit your interface.",
    "Tools",
    "Accessibility",
    "Snippet",
    true,
    "Amber",
  ],
  [
    "Lumen navigation patterns",
    "Help people find their place and their next step.",
    "Patterns",
    "Layout",
    "Article",
    true,
    "Violet",
  ],
  [
    "Meadow spacing guide",
    "Give complex screens a calmer visual rhythm.",
    "Guides",
    "Layout",
    "Article",
    true,
    "Blue",
  ],
  [
    "North rendering tools",
    "Spot expensive renders before they become a problem.",
    "Tools",
    "Performance",
    "Snippet",
    false,
    "Amber",
  ],
  [
    "Orbit empty states",
    "Turn an empty screen into a useful next action.",
    "Patterns",
    "Accessibility",
    "Article",
    true,
    "Violet",
  ],
  [
    "Pine image checklist",
    "Choose sensible sizes and keep pages feeling fast.",
    "Guides",
    "Performance",
    "Article",
    true,
    "Blue",
  ],
  [
    "Quartz semantic toolkit",
    "Start with meaningful HTML and build from there.",
    "Tools",
    "Accessibility",
    "Snippet",
    true,
    "Amber",
  ],
  [
    "River responsive patterns",
    "Make room for content at every screen size.",
    "Patterns",
    "Layout",
    "Snippet",
    false,
    "Violet",
  ],
] as const;

const resources: Resource[] = rows.map(
  ([name, description, category, topic, format, free, color], index) => ({
    id: `resource-${index + 1}`,
    name,
    description,
    category,
    topic,
    format,
    free,
    color,
  }),
);

const filters: Filter[] = [
  {
    type: "select",
    key: "category",
    label: "Category",
    value: null,
    placeholder: "All categories",
    options: ["Patterns", "Guides", "Tools"].map((value) => ({
      label: value,
      value,
    })),
  },
  {
    type: "multi-select",
    key: "topic",
    label: "Topics",
    value: [],
    options: ["Accessibility", "Layout", "Performance"].map((value) => ({
      label: value,
      value,
    })),
  },
  {
    type: "multi-select-button",
    key: "format",
    label: "Format",
    value: [],
    options: ["Article", "Snippet"].map((value) => ({ label: value, value })),
  },
  { type: "boolean", key: "free", label: "Free resources only", value: false },
  {
    type: "color",
    key: "color",
    label: "Collection color",
    value: [],
    options: [
      { label: "Blue", value: "Blue", swatch: "#3868a8" },
      { label: "Amber", value: "Amber", swatch: "#a86512" },
      { label: "Violet", value: "Violet", swatch: "#7854a8" },
    ],
  },
];

// This is a local stand-in for an API: combine filter groups with AND, options within a group with OR.
function queryResources(
  items: Resource[],
  {
    page,
    itemsPerPage,
    filters,
    searchFilter,
    sortFilter,
  }: OnDataFetchProps<Resource>,
) {
  const query = (searchFilter?.value ?? "").trim().toLowerCase();
  const matching = items.filter((item) => {
    if (
      query &&
      !`${item.name} ${item.description}`.toLowerCase().includes(query)
    )
      return false;
    return filters.every((filter) => {
      if (filter.value === null || filter.value === false) return true;
      const actual = item[filter.key as keyof Resource];
      return Array.isArray(filter.value)
        ? filter.value.length === 0 || filter.value.includes(String(actual))
        : actual === filter.value;
    });
  });
  if (sortFilter?.value === "name-desc") matching.reverse();
  return {
    data: matching.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    total: matching.length,
  };
}

function ResourceCard({ item }: { item: Resource }) {
  return (
    <article className="resource-card">
      <div
        className={`resource-art color-${item.color.toLowerCase()}`}
        aria-hidden="true"
      >
        <span>{item.name.charAt(0)}</span>
        <i />
        <i />
      </div>
      <div className="resource-meta">
        <span>{item.category}</span>
        <span>{item.free ? "Free" : "Premium"}</span>
      </div>
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <div className="resource-tags">
        <span>{item.topic}</span>
        <span>{item.format}</span>
      </div>
    </article>
  );
}

type Language = "en" | "pl" | "es";
const copy: Record<Language, SearchAndFilterMessages> = {
  en: {
    searchLabel: "Search",
    searchPlaceholder: "Search resources…",
    clearAll: "Clear filters",
    selectedLabel: "Selected",
    filtersTitle: "Filters",
    closeFilters: "Close filters",
    noResultsTitle: "No resources found",
    noResultsDescription: "Nothing matched your search.",
    noResultsHint: "Try a different term or clear your filters.",
    resultsCount: "{count} resources",
    resultsCountCompact: "{count} resources",
    previousPage: "Previous",
    nextPage: "Next",
    page: "Page",
    paginationLabel: "Pagination",
    morePages: "More pages",
    close: "Close",
    errorTitle: "We couldn't load the resources.",
    retry: "Try again",
    loading: "Loading resources",
    sortLabel: "Sort resources",
  },
  pl: {
    searchLabel: "Szukaj",
    searchPlaceholder: "Szukaj materiałów…",
    clearAll: "Wyczyść filtry",
    selectedLabel: "Wybrane",
    filtersTitle: "Filtry",
    closeFilters: "Zamknij filtry",
    noResultsTitle: "Nie znaleziono materiałów",
    noResultsDescription: "Brak wyników dla tego wyszukiwania.",
    noResultsHint: "Zmień zapytanie lub wyczyść filtry.",
    resultsCount: "Materiały: {count}",
    resultsCountCompact: "Materiały: {count}",
    previousPage: "Poprzednia",
    nextPage: "Następna",
    page: "Strona",
    paginationLabel: "Stronicowanie",
    morePages: "Więcej stron",
    close: "Zamknij",
    errorTitle: "Nie udało się wczytać materiałów.",
    retry: "Spróbuj ponownie",
    loading: "Wczytywanie materiałów",
    sortLabel: "Sortuj materiały",
  },
  es: {
    searchLabel: "Buscar",
    searchPlaceholder: "Buscar recursos…",
    clearAll: "Borrar filtros",
    selectedLabel: "Seleccionados",
    filtersTitle: "Filtros",
    closeFilters: "Cerrar filtros",
    noResultsTitle: "No se encontraron recursos",
    noResultsDescription: "No hay resultados para esta búsqueda.",
    noResultsHint: "Prueba otra búsqueda o borra los filtros.",
    resultsCount: "{count} recursos",
    resultsCountCompact: "{count} recursos",
    previousPage: "Anterior",
    nextPage: "Siguiente",
    page: "Página",
    paginationLabel: "Paginación",
    morePages: "Más páginas",
    close: "Cerrar",
    errorTitle: "No se pudieron cargar los recursos.",
    retry: "Reintentar",
    loading: "Cargando recursos",
    sortLabel: "Ordenar recursos",
  },
};

const locales: Record<Language, string> = {
  en: "en-US",
  pl: "pl-PL",
  es: "es-AR",
};

export function ResourceDemo() {
  const [language, setLanguage] = useState<Language>("en");
  const [layout, setLayout] = useState<DesktopFiltersDisplayMode>("sidebar");
  const failNext = useRef(false);
  const [demo] = useState(() => {
    const store = makeStore({
      initialState: createInitialState<Resource>({
        state: {
          results: { data: resources.slice(0, 6), total: resources.length },
          itemsPerPage: 6,
          filters,
          searchFilter: {
            type: "search",
            key: "search",
            label: null,
            value: "",
          },
          sortFilter: {
            type: "select",
            key: "sort",
            label: null,
            value: "name-asc",
            options: [
              { label: "Name: A–Z", value: "name-asc" },
              { label: "Name: Z–A", value: "name-desc" },
            ],
          },
          resultsContainerClassName: "resource-grid",
          getResultItemKey: (item) => item.id,
          onRenderResultItem: (item) => <ResourceCard item={item} />,
          onDataFetch: async (request) => {
            await new Promise((resolve) => setTimeout(resolve, 180));
            if (failNext.current) {
              failNext.current = false;
              return { error: true };
            }
            return queryResources(resources, request);
          },
        },
      }),
    });
    return { store, methods: createStoreMethods({ store }) };
  });

  return (
    <section className="demo-panel" aria-label="Resource explorer">
      <div className="demo-settings">
        <div className="demo-caption">
          <span className="status-dot" /> Interactive playground
        </div>
        <div className="settings-controls">
          <label>
            UI copy
            <select
              aria-label="Demo language"
              value={language}
              onChange={(event) => setLanguage(event.target.value as Language)}
            >
              <option value="en">English</option>
              <option value="pl">Polski</option>
              <option value="es">Español</option>
            </select>
          </label>
          <label>
            Desktop layout
            <select
              aria-label="Desktop layout"
              value={layout}
              onChange={(event) =>
                setLayout(event.target.value as DesktopFiltersDisplayMode)
              }
            >
              <option value="sidebar">Sidebar</option>
              <option value="drawer">Drawer</option>
            </select>
          </label>
          <button
            className="text-button"
            type="button"
            onClick={() => {
              failNext.current = true;
              void demo.methods.handlePageChange(demo.store.getState().page);
            }}
          >
            Simulate request error
          </button>
        </div>
      </div>
      <SearchAndFilterModule
        mode="store"
        store={demo.store}
        messages={copy[language]}
        locale={locales[language]}
        desktopFiltersDisplayMode={layout}
        className="resource-module"
      />
      <div className="demo-footnote">
        <span>
          18 invented resources · 5 filter types · 500 ms search debounce
        </span>
        <span>Local data, real library controls</span>
      </div>
    </section>
  );
}

export function IndependentDemo() {
  const state = useMemo<SearchAndFilterModuleWithStateProps<Resource>["state"]>(
    () => ({
      results: { data: resources.slice(0, 3), total: 3 },
      itemsPerPage: 3,
      filters: [],
      searchFilter: { type: "search", key: "search", label: null, value: "" },
      getResultItemKey: (item) => item.id,
      onRenderResultItem: (item) => (
        <article className="saved-resource">
          <span className={`saved-dot color-${item.color.toLowerCase()}`} />
          <h3>{item.name}</h3>
          <span>{item.format}</span>
        </article>
      ),
      resultsContainerClassName: "saved-grid",
      onDataFetch: async (request) =>
        queryResources(resources.slice(0, 3), request),
    }),
    [],
  );
  return (
    <section className="independent-demo" aria-label="Saved resources">
      <div>
        <span className="eyebrow">Instance 02</span>
        <h2>Your saved resources</h2>
        <p>
          A separate store, on the same page. Search here and the explorer above
          keeps its state.
        </p>
      </div>
      <SearchAndFilterModule
        state={state}
        desktopFiltersDisplayMode="drawer"
        className="saved-module"
        messages={{
          filtersTitle: "Saved filters",
          searchLabel: "Search saved resources",
          searchPlaceholder: "Search your saved resources…",
          resultsCount: "{count} saved resources",
          resultsCountCompact: "{count} saved resources",
        }}
      />
    </section>
  );
}
