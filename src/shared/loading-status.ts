export type DataLoadingStatus = "idle" | "loading" | "loaded" | "error";
export interface WithDataLoadingStatus {
  status: DataLoadingStatus;
}
