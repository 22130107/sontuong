import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dùng webpack thay Turbopack để tránh bug trên Windows path có ký tự đặc biệt
  bundlePagesRouterDependencies: true,
  output: "standalone", // cần cho Docker
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "sonnuocvungtau.com",
      },
      {
        protocol: "https",
        hostname: "*.googleapis.com",
      },
    ],
    // Cho phép tất cả ảnh local
    localPatterns: [
      {
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Redirect trailing slash variants to canonical URLs
    ];
  },
};

export default nextConfig;
