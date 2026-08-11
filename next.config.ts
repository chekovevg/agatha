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
          {key: "X-Frame-Options", value: "DENY"},
          // Report-only first: this site loads GTM, Cal.com, and YouTube resources.
          {
            key: "Content-Security-Policy-Report-Only",
            value:
              "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: blob: https:; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://app.cal.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; frame-src https://www.youtube-nocookie.com https://cal.com https://app.cal.com; connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://region1.google-analytics.com https://cal.com https://app.cal.com",
          },
        ],
      },
    ];
  },
  reactStrictMode: true,
};

export default nextConfig;
