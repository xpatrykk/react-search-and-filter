import { createContext, useContext, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

export interface MessageValues {
  count?: number;
}
export type Message =
  | string
  | ((values: MessageValues, locale: string) => string);
export const defaultMessages = {
  searchLabel: "Search",
  searchPlaceholder: "Search…",
  clearAll: "Clear filters",
  selectedLabel: "Selected",
  filtersTitle: "Filters",
  closeFilters: "Close filters",
  noResultsTitle: "No results",
  noResultsDescription: "Nothing matched your search.",
  noResultsHint: "Try changing or clearing your filters.",
  resultsCount: (({ count = 0 }, locale) =>
    `${new Intl.NumberFormat(locale).format(count)} results`) as Message,
  resultsCountCompact: (({ count = 0 }, locale) =>
    `${new Intl.NumberFormat(locale).format(count)} results`) as Message,
  previousPage: "Previous",
  nextPage: "Next",
  page: "Page",
  paginationLabel: "Pagination",
  morePages: "More pages",
  close: "Close",
  errorTitle: "Results could not be loaded.",
  retry: "Try again",
  loading: "Loading results",
  sortLabel: "Sort results",
};
export type SearchAndFilterMessages = {
  [Key in keyof typeof defaultMessages]: Message;
};
export interface SearchAndFilterAppearanceProps {
  messages?: Partial<SearchAndFilterMessages>;
  locale?: string;
  className?: string;
  style?: CSSProperties;
}
const Settings = createContext<{
  messages: SearchAndFilterMessages;
  locale: string;
  portalContainer: HTMLDivElement | null;
}>({ messages: defaultMessages, locale: "en", portalContainer: null });
export const SettingsProvider = ({
  messages,
  locale = "en",
  className,
  style,
  children,
}: SearchAndFilterAppearanceProps & { children: ReactNode }) => {
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(
    null,
  );
  return (
    <Settings.Provider
      value={{
        messages: { ...defaultMessages, ...messages },
        locale,
        portalContainer,
      }}
    >
      <div
        ref={setPortalContainer}
        className={["rsf", className].filter(Boolean).join(" ")}
        lang={locale}
        style={style}
      >
        {children}
      </div>
    </Settings.Provider>
  );
};
export const usePortalContainer = () => useContext(Settings).portalContainer;
export const useMessages = () => {
  const { messages, locale } = useContext(Settings);
  return (
    key: keyof SearchAndFilterMessages,
    values: MessageValues = {},
  ): string => {
    const message = messages[key];
    return typeof message === "function"
      ? message(values, locale)
      : message.replace(
          "{count}",
          new Intl.NumberFormat(locale).format(values.count ?? 0),
        );
  };
};
