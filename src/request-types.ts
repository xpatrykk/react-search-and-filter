import type { Filter, SearchFilter, SortFilter } from "./filter-types";

export interface SearchAndFilterRequestState {
  page: number;
  itemsPerPage: number;
  filters: Array<Filter>;
  searchFilter: SearchFilter | null;
  sortFilter: SortFilter | null;
}

export type OnDataFetchProps<Item> = SearchAndFilterRequestState & {
  readonly __itemType__?: Item;
};

export type OnDataFetchErrorResult = {
  error: true;
};

export interface OnDataFetchSuccessResult<Item> {
  data: Array<Item>;
  total: number;
}

export type OnDataFetchResult<Item> =
  | OnDataFetchSuccessResult<Item>
  | OnDataFetchErrorResult;

export type OnDataFetch<Item> = (
  props: OnDataFetchProps<Item>,
) => Promise<OnDataFetchResult<Item>>;

export type FetchDataCreatorServices<
  Item,
  ReturnValue = ReturnType<OnDataFetch<Item>>,
> = {
  sort: <Filter extends SortFilter>(value: Filter["value"]) => ReturnValue;
  search: <Filter extends SearchFilter>(value: Filter["value"]) => ReturnValue;
  filter: <FilterT extends Filter = Filter>(
    key: FilterT["key"],
    value: FilterT["value"],
  ) => ReturnValue;
  clearFilters: () => ReturnValue;
  pageChange: (page: number) => ReturnValue;
};

export type FetchDataCreatorServicesList<Item> =
  keyof FetchDataCreatorServices<Item>;

export type FetchDataCreatorService<
  Item,
  Service extends FetchDataCreatorServicesList<Item>,
  ReturnValue = ReturnType<OnDataFetch<Item>>,
> = FetchDataCreatorServices<Item, ReturnValue>[Service];
