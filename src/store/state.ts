import type { SearchAndFilterRequestState } from "../request-types";
import type {
  GetResultItemKey,
  OnDataFetch,
  OnRenderResultItem,
  ResultsInsertion,
} from "../types";
import type { WithDataLoadingStatus } from "../shared/loading-status";
import type { ReactNode } from "react";

export interface OnDataFetchSuccessResult<Item> {
  data: Array<Item>;
  total: number;
}

export interface SearchAndFilterModuleLoadingStatus extends WithDataLoadingStatus {
  loading: boolean;
  error: boolean;
}

export interface SearchAndFilterModuleDataState<
  Item,
> extends WithDataLoadingStatus {
  results: OnDataFetchSuccessResult<Item>;
}

export interface SearchAndFilterModuleQueryState<
  Item,
> extends SearchAndFilterRequestState {
  onDataFetch: OnDataFetch<Item>;
  onError: ((error: unknown) => void) | null;
}

export interface SearchAndFilterModuleResultsPresentationState<Item> {
  getResultItemKey: GetResultItemKey<Item>;
  onRenderResultItem: OnRenderResultItem<Item>;
  renderNoResults: (() => ReactNode) | null;
  resultsContainerElement: "div" | "ul" | "ol";
  resultItemElement: "div" | "li";
  resultsContainerClassName: string;
  resultsLeadContent: ReactNode | null;
  resultsLeadContentClassName: string | null;
  resultsInsertion: ResultsInsertion<Item> | null;
}

export interface SearchAndFilterModuleLayoutState {
  mobileFiltersOpen: boolean;
  mainContainerId: string;
  scrollRequestCount: number;
  hideFilters: boolean;
}

export interface SearchAndFilterModuleState<Item>
  extends
    SearchAndFilterModuleDataState<Item>,
    SearchAndFilterModuleQueryState<Item>,
    SearchAndFilterModuleResultsPresentationState<Item>,
    SearchAndFilterModuleLayoutState {}
