import { clsx } from "clsx";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { useMessages } from "../messages";
import { Button } from "./button";

import { paginationEllipsis, getPaginationRange } from "./pagination-range";

import { getTotalPages } from "./pagination/get-total-pages";
import { PaginationContent } from "./pagination/pagination-content";
import { PaginationEllipsis } from "./pagination/pagination-ellipsis";
import { PaginationItem } from "./pagination/pagination-item";
import { Pagination } from "./pagination/pagination-root";

import type { PaginationControlProps } from "./pagination/pagination-types";

export const PaginationControl = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  disabled,
  siblingCount = 1,
}: PaginationControlProps) => {
  const t = useMessages();
  const totalPages = getTotalPages({ totalItems, itemsPerPage });
  const pageRange = getPaginationRange({
    currentPage,
    totalPages,
    siblingCount,
  });

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  if (pageRange.length <= 1) {
    return null;
  }

  return (
    <Pagination
      className={clsx(
        "select-none",
        disabled && "text-muted-foreground pointer-events-none",
      )}
    >
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            size="default"
            className="gap-1 px-2.5 sm:pl-2.5"
            aria-label={t("previousPage")}
            aria-disabled={currentPage === 1}
            disabled={disabled || currentPage === 1}
            onClick={() => handlePageClick(currentPage - 1)}
          >
            <ChevronLeftIcon aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">{t("previousPage")}</span>
          </Button>
        </PaginationItem>
        {pageRange.map((page, idx) => {
          if (page === paginationEllipsis) {
            return (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={page}>
              <Button
                variant={page === currentPage ? "outline" : "ghost"}
                size="icon"
                disabled={disabled}
                aria-current={page === currentPage ? "page" : undefined}
                aria-label={`${t("page")} ${page}`}
                onClick={() => handlePageClick(page)}
              >
                {page}
              </Button>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <Button
            variant="ghost"
            size="default"
            className="gap-1 px-2.5 sm:pr-2.5"
            aria-label={t("nextPage")}
            aria-disabled={currentPage === totalPages}
            disabled={disabled || currentPage === totalPages}
            onClick={() => handlePageClick(currentPage + 1)}
          >
            <span className="sr-only sm:not-sr-only">{t("nextPage")}</span>
            <ChevronRightIcon aria-hidden="true" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
