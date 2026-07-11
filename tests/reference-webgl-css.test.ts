import {readFileSync} from "node:fs";

import {describe, expect, it} from "vitest";

const css = readFileSync(
  new URL("../app/globals.css", import.meta.url),
  "utf8",
);

function findRule(selector: string, declarations: string[]) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = css.matchAll(
    new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`, "g"),
  );
  const match = [...matches].find((candidate) =>
    declarations.every((declaration) => candidate[1]?.includes(declaration)),
  );

  expect(
    match,
    `Expected ${selector} to include ${declarations.join(", ")}`,
  ).toBeDefined();

  return {
    body: match?.[1] ?? "",
    index: match?.index ?? -1,
  };
}

describe("reference WebGL switcher CSS", () => {
  it("places the mobile switcher overrides after their base declarations", () => {
    const baseSwitcher = findRule(".hero-background-switcher", [
      "bottom: 24px;",
      "right: 24px;",
    ]);
    const baseButton = findRule(".hero-background-switcher-button", [
      "font-size: 12px;",
      "padding: 9px 12px;",
    ]);
    const mobileSwitcher = findRule(".hero-background-switcher", [
      "bottom: 12px;",
      "right: auto;",
    ]);
    const mobileButton = findRule(".hero-background-switcher-button", [
      "font-size: 11px;",
      "padding: 8px 9px;",
    ]);
    const mobileMediaIndex = css.lastIndexOf(
      "@media (width < 600px)",
      mobileSwitcher.index,
    );

    expect(mobileMediaIndex).toBeGreaterThan(baseSwitcher.index);
    expect(mobileMediaIndex).toBeGreaterThan(baseButton.index);
    expect(mobileSwitcher.index).toBeGreaterThan(baseSwitcher.index);
    expect(mobileButton.index).toBeGreaterThan(baseButton.index);
  });

  it("keeps the mobile switcher within the viewport and scrollable", () => {
    const mobileSwitcher = findRule(".hero-background-switcher", [
      "bottom: 12px;",
      "right: auto;",
    ]);

    expect(mobileSwitcher.body).toContain("max-width: calc(100vw - 24px);");
    expect(mobileSwitcher.body).toContain("overflow-x: auto;");
  });
});
