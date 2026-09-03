import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  experimental: {
    cpus: 1,
  },
  images: {
    qualities: [75, 95],
  },
  async redirects() {
    return [
      {source: "/en", destination: "/", permanent: true},
      {source: "/en/about", destination: "/about", permanent: true},
      {source: "/en/classes", destination: "/classes", permanent: true},
      {source: "/en/media", destination: "/media", permanent: true},
      {source: "/en/book", destination: "/book", permanent: true},
    ];
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
