import { castDraft, type WritableDraft } from "immer";
import { isAsyncActionRejected } from "@quickstate/core";
import { isSuccessResult } from "../../utils/is-success-result";
import type {
  FetchDataCreatorService,
  FetchDataCreatorServicesList,
  OnDataFetchProps,
  OnDataFetchResult,
} from "../../types";
import type { SearchAndFilterModuleState } from "../state";
import type {
  AsyncActionFulfilledMeta,
  AsyncActionMeta,
  Store,
} from "@quickstate/core";

const latestRequests = new WeakMap<object, number>();
const lastRequests = new WeakMap<object, () => Promise<unknown>>();
export const retryLastRequest = (store: object) => lastRequests.get(store)?.();
type FetchDataActionCreator<
  Item,
  Service extends FetchDataCreatorServicesList<Item>,
> = (
  ...parameters: Parameters<FetchDataCreatorService<Item, Service>>
) => Promise<OnDataFetchResult<Item>>;
type FetchDataAsyncAction<
  Item,
  Service extends FetchDataCreatorServicesList<Item>,
> = (
  ...parameters: Parameters<FetchDataCreatorService<Item, Service>>
) => Promise<AsyncActionMeta<FetchDataActionCreator<Item, Service>>>;
type OnSuccessResult<
  Item,
  Service extends FetchDataCreatorServicesList<Item>,
> = (
  state: WritableDraft<SearchAndFilterModuleState<Item>>,
  meta: AsyncActionFulfilledMeta<FetchDataActionCreator<Item, Service>>,
) => void;
type ResolveRequestData<
  Item,
  Service extends FetchDataCreatorServicesList<Item>,
> = (
  requestData: OnDataFetchProps<Item>,
  parameters: Parameters<FetchDataCreatorService<Item, Service>>,
) => OnDataFetchProps<Item>;

export const fetchDataService =
  <Item, Service extends FetchDataCreatorServicesList<Item>>(
    onSuccessResult: OnSuccessResult<Item, Service>,
    resolveRequestData?: ResolveRequestData<Item, Service>,
  ) =>
  (
    store: Store<SearchAndFilterModuleState<Item>>,
  ): FetchDataAsyncAction<Item, Service> => {
    const execute: FetchDataAsyncAction<Item, Service> = async (
      ...parameters
    ) => {
      lastRequests.set(store, () => execute(...parameters));
      const requestId = (latestRequests.get(store) ?? 0) + 1;
      latestRequests.set(store, requestId);
      const isLatest = () => latestRequests.get(store) === requestId;
      const {
        filters,
        itemsPerPage,
        page,
        searchFilter,
        sortFilter,
        onDataFetch,
      } = store.getState();
      const base = { filters, itemsPerPage, page, searchFilter, sortFilter };
      let requestData = resolveRequestData
        ? resolveRequestData(base, parameters)
        : base;
      const meta = await store.createAsyncAction({
        creator: async (
          ..._parameters: Parameters<FetchDataCreatorService<Item, Service>>
        ) => {
          let result = await onDataFetch(requestData);
          if (isLatest() && isSuccessResult(result)) {
            const lastPage = Math.max(
              1,
              Math.ceil(result.total / requestData.itemsPerPage),
            );
            if (requestData.page > lastPage) {
              requestData = { ...requestData, page: lastPage };
              store.setKeyValue("page", lastPage);
              result = await onDataFetch(requestData);
              if (
                isSuccessResult(result) &&
                requestData.page >
                  Math.max(
                    1,
                    Math.ceil(result.total / requestData.itemsPerPage),
                  )
              )
                return { error: true } as const;
            }
          }
          return result;
        },
        onPending: (state) => {
          state.status = "loading";
          // Publish intent immediately so overlapping controls compose from the latest query.
          state.page = requestData.page;
          state.itemsPerPage = requestData.itemsPerPage;
          state.filters = castDraft(requestData.filters);
          state.searchFilter = castDraft(requestData.searchFilter);
          state.sortFilter = castDraft(requestData.sortFilter);
        },
        onFulfilled: (state, meta) => {
          if (!isLatest()) return;
          if (isSuccessResult(meta.result)) {
            state.status = "loaded";
            state.results = castDraft(meta.result);
            onSuccessResult(state, meta);
          } else state.status = "error";
        },
        onRejected: (state) => {
          if (isLatest()) state.status = "error";
        },
      })(...parameters);
      if (isLatest() && isAsyncActionRejected(meta)) {
        try {
          store.getState().onError?.(meta.reason);
        } catch {
          /* Observer failures must not roll back request recovery. */
        }
      }
      return meta;
    };
    return execute;
  };
