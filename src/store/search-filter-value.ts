export const normalizeSearchFilterValue = (
  value: string | null | undefined,
): string | null => {
  const normalizedValue = value?.trim() ?? "";

  return normalizedValue ? normalizedValue : null;
};
