import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  experimental: {
    cpus: 1,
  },
  images: {
    qualities: [75, 95],
  },
  async headers() {
    return [
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
    ];
  },
  reactStrictMode: true,
};

export default nextConfig;
