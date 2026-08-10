export function getNearestTabScrollLeft({
  clientWidth,
  itemLeft,
  itemWidth,
  scrollLeft,
}: {
  clientWidth: number;
  itemLeft: number;
  itemWidth: number;
  scrollLeft: number;
}) {
  if (itemLeft < scrollLeft) {
    return itemLeft;
  }

  const itemRight = itemLeft + itemWidth;
  const viewportRight = scrollLeft + clientWidth;

  if (itemRight > viewportRight) {
    return itemRight - clientWidth;
  }

  return scrollLeft;
}
