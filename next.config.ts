import type { NextConfig } from "next";

const basePath = process.env.BASE_PATH || "";

const nextConfig: NextConfig = {
  // Static files for GitHub Pages. The Actions workflow sets BASE_PATH to /<repo>.
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
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
