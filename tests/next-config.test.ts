import {describe, expect, it} from "vitest";

import nextConfig from "@/next.config";

describe("Next.js response headers", () => {
  it("allows the local browser QA hostname in development", () => {
    expect(nextConfig.allowedDevOrigins).toEqual(["127.0.0.1"]);
  });

  it("applies conservative security headers to every route", async () => {
    expect(nextConfig.headers).toBeTypeOf("function");

    const rules = await nextConfig.headers?.();

    expect(rules).toEqual([
      {
        source: "/:path*",
        headers: [
          {key: "X-Content-Type-Options", value: "nosniff"},
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
          },
        ],
      },
    ]);
  });
});
