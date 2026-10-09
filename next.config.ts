import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The demo is opened at 127.0.0.1. Next blocks dev resources for that host unless it is listed.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
