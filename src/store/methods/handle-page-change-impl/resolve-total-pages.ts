export const resolveTotalPages = (
  total: number,
  itemsPerPage: number,
): number => Math.max(1, Math.ceil(total / Math.max(1, itemsPerPage)));
