import {describe, expect, it} from "vitest";

import {createRateLimiter} from "@/lib/rate-limit";

describe("in-process rate limiter", () => {
  it("limits requests within the window and allows them after expiry", () => {
    const limiter = createRateLimiter({
      windowMs: 100,
      maxRequests: 1,
      maxKeys: 10,
    });

    expect(limiter.isLimited("student", 0)).toBe(false);
    expect(limiter.isLimited("student", 99)).toBe(true);
    expect(limiter.isLimited("student", 100)).toBe(false);
  });

  it("bounds retained keys by evicting the oldest active key", () => {
    const limiter = createRateLimiter({
      windowMs: 1_000,
      maxRequests: 1,
      maxKeys: 2,
    });

    expect(limiter.isLimited("first", 0)).toBe(false);
    expect(limiter.isLimited("second", 1)).toBe(false);
    expect(limiter.isLimited("third", 2)).toBe(false);
    expect(limiter.isLimited("first", 3)).toBe(false);
  });

  it("clears retained state", () => {
    const limiter = createRateLimiter({
      windowMs: 1_000,
      maxRequests: 1,
      maxKeys: 10,
    });

    expect(limiter.isLimited("student", 0)).toBe(false);
    expect(limiter.isLimited("student", 1)).toBe(true);
    limiter.clear();
    expect(limiter.isLimited("student", 2)).toBe(false);
  });
});
