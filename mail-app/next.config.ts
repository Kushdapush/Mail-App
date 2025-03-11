import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverComponentsExternalPackages: ["nodemailer", "csv-parse"],
  },
  eslint: {
    // Allow production builds to successfully complete even with eslint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;