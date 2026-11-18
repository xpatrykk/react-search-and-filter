import { PaginationControl } from "../ui/pagination";

import { useSearchAndFilterModuleStoreContext } from "../store";

export const Pagination = () => {
  const { useSelectValue, handlePageChange, selectDataLoadingStatus } =
    useSearchAndFilterModuleStoreContext();

  const { total } = useSelectValue("results");
  const page = useSelectValue("page");
  const itemsPerPage = useSelectValue("itemsPerPage");
  const { loading } = selectDataLoadingStatus();

  if (!total) {
    return null;
  }

  return (
    <PaginationControl
      disabled={loading}
      currentPage={page}
      itemsPerPage={itemsPerPage}
      totalItems={total}
      onPageChange={(page) => void handlePageChange(page)}
    />
  );
};
