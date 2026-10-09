import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev JS is blocked unless the browser's host is listed. The preview opens on
  // *.agent.cvm.dev, and a blocked bundle leaves the first step as static HTML.
  allowedDevOrigins: ["127.0.0.1", "localhost", "*.agent.cvm.dev", "**.agent.cvm.dev"],
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
