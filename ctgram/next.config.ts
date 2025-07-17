import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // APENAS esta linha dentro do objeto images
  },
};

export default nextConfig;