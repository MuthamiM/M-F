import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.1.158",
    "192.168.1.247",
    "*.trycloudflare.com",
  ],
  async rewrites() {
    const backendUrl = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";
    return [
      {
        source: "/_next/static/chunks/29u7gj-4aow9-.css",
        destination: "/_next/static/chunks/3kf6n-21i5pq8.css",
      },
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/v1/:path*",
        destination: `${backendUrl}/v1/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
      {
        source: "/docs",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
    ];
  },
};

export default nextConfig;
