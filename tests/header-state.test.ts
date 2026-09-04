import {describe, expect, it} from "vitest";

import {shouldHideHeader} from "@/components/layout/header-state";

describe("header visibility state", () => {
  it("always reveals the header at the page top", () => {
    expect(
      shouldHideHeader({
        currentScrollY: 1,
        lastScrollY: 100,
        viewportWidth: 1440,
        menuVisible: false,
      }),
    ).toBe(false);
  });

  it("always reveals the header through the 640px mobile breakpoint", () => {
    expect(
      shouldHideHeader({
        currentScrollY: 200,
        lastScrollY: 100,
        viewportWidth: 640,
        menuVisible: false,
      }),
    ).toBe(false);
  });

  it("always reveals the header while the menu is visible", () => {
    expect(
      shouldHideHeader({
        currentScrollY: 200,
        lastScrollY: 100,
        viewportWidth: 1440,
        menuVisible: true,
      }),
    ).toBe(false);
  });

  it("hides on meaningful downward scroll and reveals on upward scroll", () => {
    expect(
      shouldHideHeader({
        currentScrollY: 107,
        lastScrollY: 100,
        viewportWidth: 641,
        menuVisible: false,
      }),
    ).toBe(true);
    expect(
      shouldHideHeader({
        currentScrollY: 107,
        lastScrollY: 100,
        viewportWidth: 1440,
        menuVisible: false,
      }),
    ).toBe(true);
    expect(
      shouldHideHeader({
        currentScrollY: 93,
        lastScrollY: 100,
        viewportWidth: 1440,
        menuVisible: false,
      }),
    ).toBe(false);
  });

  it("preserves the current state for small scroll deltas", () => {
    expect(
      shouldHideHeader({
        currentScrollY: 106,
        lastScrollY: 100,
        viewportWidth: 1440,
        menuVisible: false,
      }),
    ).toBeNull();
  });
});
