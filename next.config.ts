import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  turbopack: {
    // Silences the "ignored package-lock.json outside Git repository"
    // warning caused by a lockfile somewhere above this folder (e.g. in the
    // user's home directory) — this project's own root is authoritative.
    root: __dirname,
  },
};

export default nextConfig;