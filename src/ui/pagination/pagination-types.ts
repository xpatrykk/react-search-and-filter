export type PaginationControlProps = {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  siblingCount?: number;
};
