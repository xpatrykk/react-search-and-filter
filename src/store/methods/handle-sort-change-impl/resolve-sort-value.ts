export const resolveSortValue = <Value extends string | number>(
  options: Array<{ value: Value }>,
  value: Value | null,
): Value | null => {
  if (value === null) {
    return null;
  }

  const matchedOption = options.find((option) => option.value === value);

  return matchedOption ? matchedOption.value : null;
};
