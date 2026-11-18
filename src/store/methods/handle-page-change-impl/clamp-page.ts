import { resolveTotalPages } from "./resolve-total-pages";

export const clampPage = (
  requestedPage: number,
  total: number,
  itemsPerPage: number,
): number =>
  Math.min(
    Math.max(1, Number.isFinite(requestedPage) ? Math.trunc(requestedPage) : 1),
    resolveTotalPages(total, itemsPerPage),
  );
