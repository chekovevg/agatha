import {describe, expect, it} from "vitest";

import {calBookingStatusReducer} from "@/components/analytics/cal-booking-status";

describe("Cal booking embed status", () => {
  it("reports a slow embed without treating link readiness as booker readiness", () => {
    expect(calBookingStatusReducer("loading", {type: "linkReady"})).toBe(
      "loading",
    );
    expect(calBookingStatusReducer("loading", {type: "slow"})).toBe("slow");
    expect(calBookingStatusReducer("slow", {type: "linkReady"})).toBe("slow");
  });

  it("removes status UI only when the booker is ready", () => {
    expect(calBookingStatusReducer("loading", {type: "bookerReady"})).toBe(
      "ready",
    );
    expect(calBookingStatusReducer("slow", {type: "bookerReady"})).toBe(
      "ready",
    );
  });

  it("surfaces embed failure and ignores stale events after a terminal state", () => {
    expect(calBookingStatusReducer("loading", {type: "linkFailed"})).toBe(
      "failed",
    );
    expect(calBookingStatusReducer("slow", {type: "linkFailed"})).toBe(
      "failed",
    );
    expect(calBookingStatusReducer("ready", {type: "linkFailed"})).toBe(
      "ready",
    );
    expect(calBookingStatusReducer("failed", {type: "bookerReady"})).toBe(
      "failed",
    );
  });
});
