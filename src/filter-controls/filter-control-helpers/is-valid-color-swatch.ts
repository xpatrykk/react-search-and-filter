export const isValidColorSwatch = (
  swatch: string | null | undefined,
): swatch is string =>
  Boolean(swatch && /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(swatch));
