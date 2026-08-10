import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "100.87.92.72",
    "192.168.1.158",
    "192.168.1.247",
    "*.trycloudflare.com",
    "*.ts.net",
    "*.tail953a25.ts.net",
  ],
  async rewrites() {
    const backendUrl = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
