import {describe, expect, it} from "vitest";

import {getNearestTabScrollLeft} from "@/components/ui/tab-menu-scroll";

describe("TabMenu scrolling", () => {
  it("keeps the viewport still when the active tab is already visible", () => {
    expect(
      getNearestTabScrollLeft({
        clientWidth: 200,
        itemLeft: 130,
        itemWidth: 80,
        scrollLeft: 50,
      }),
    ).toBe(50);
  });

  it("aligns an active tab clipped on the left to the viewport start", () => {
    expect(
      getNearestTabScrollLeft({
        clientWidth: 200,
        itemLeft: 20,
        itemWidth: 80,
        scrollLeft: 50,
      }),
    ).toBe(20);
  });

  it("aligns an active tab clipped on the right to the viewport end", () => {
    expect(
      getNearestTabScrollLeft({
        clientWidth: 200,
        itemLeft: 260,
        itemWidth: 80,
        scrollLeft: 50,
      }),
    ).toBe(140);
  });
});
