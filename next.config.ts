import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for the VPS Docker image.
  output: "standalone",
  // Let phones on the local network load dev scripts (e.g. http://192.168.1.91:3000).
  // Without this, `next dev` blocks them and client components like the macaws never run.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.local"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
