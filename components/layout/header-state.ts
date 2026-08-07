export const MOBILE_HEADER_MAX_WIDTH = 860;

export function shouldHideHeader({
  currentScrollY,
  lastScrollY,
  viewportWidth,
  menuVisible,
}: {
  currentScrollY: number;
  lastScrollY: number;
  viewportWidth: number;
  menuVisible: boolean;
}) {
  if (
    viewportWidth <= MOBILE_HEADER_MAX_WIDTH ||
    menuVisible ||
    currentScrollY <= 1
  ) {
    return false;
  }

  const delta = currentScrollY - lastScrollY;

  if (delta > 6) {
    return true;
  }

  if (delta < -6) {
    return false;
  }

  return null;
}
