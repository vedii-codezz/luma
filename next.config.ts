import type { NextConfig } from "next";

const distDir = process.env.LUMA_DIST_DIR || '.next-luma';
if (!/^\.next-(?:luma|verify)(?:-[a-z0-9-]+)?$/.test(distDir)) {
  throw new Error('LUMA_DIST_DIR must be a .next-luma or .next-verify directory inside this project.');
}

const nextConfig: NextConfig = {
  // The old .next directory has a deny-delete ACL. Keep generated output separate.
  distDir,
  turbopack: { root: process.cwd() },
};

export default nextConfig;
