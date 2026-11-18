import type { PaginationControlProps } from "./pagination-types";

export const getTotalPages = ({
  totalItems,
  itemsPerPage,
}: Pick<PaginationControlProps, "itemsPerPage" | "totalItems">) => {
  return Math.ceil(totalItems / itemsPerPage);
};
