/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/db", "@repo/store"],
};

export default nextConfig;
