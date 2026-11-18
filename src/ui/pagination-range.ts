export const paginationEllipsis = "ellipsis" as const;

export type PaginationRangeItem = number | typeof paginationEllipsis;

interface GetPaginationRangeProps {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
}

export const getPaginationRange = ({
  currentPage,
  totalPages,
  siblingCount = 1,
}: GetPaginationRangeProps): PaginationRangeItem[] => {
  if (totalPages <= 0) {
    return [];
  }

  const safeSiblingCount = Math.max(0, siblingCount);
  const totalNumbers = safeSiblingCount * 2 + 5;
  const pages: PaginationRangeItem[] = [];

  if (totalPages <= totalNumbers) {
    for (let page = 1; page <= totalPages; page += 1) {
      pages.push(page);
    }

    return pages;
  }

  const leftSibling = Math.max(currentPage - safeSiblingCount, 2);
  const rightSibling = Math.min(currentPage + safeSiblingCount, totalPages - 1);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  pages.push(1);

  if (showLeftEllipsis) {
    pages.push(paginationEllipsis);
  } else {
    for (let page = 2; page < leftSibling; page += 1) {
      pages.push(page);
    }
  }

  for (let page = leftSibling; page <= rightSibling; page += 1) {
    pages.push(page);
  }

  if (showRightEllipsis) {
    pages.push(paginationEllipsis);
  } else {
    for (let page = rightSibling + 1; page < totalPages; page += 1) {
      pages.push(page);
    }
  }

  pages.push(totalPages);

  return pages;
};
