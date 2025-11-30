import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile workspace packages
  transpilePackages: ["@convergence/ui", "@convergence/tailwind-config"],
};

export default nextConfig;
