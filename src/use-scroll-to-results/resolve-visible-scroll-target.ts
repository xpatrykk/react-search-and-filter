export const resolveVisibleScrollTarget = (
  element: HTMLElement | null,
): HTMLElement | null => {
  if (!element) {
    return null;
  }

  if (element.getClientRects().length > 0) {
    return element;
  }

  let currentElement = element.parentElement;

  while (currentElement) {
    if (currentElement.getClientRects().length > 0) {
      return currentElement;
    }

    currentElement = currentElement.parentElement;
  }

  return element;
};
