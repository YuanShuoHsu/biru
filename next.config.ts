// https://next-intl.dev/docs/getting-started/app-router

import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_NEST_URL}/api/:path*`,
      },
    ];
  },
  // 暫時的假資料記得刪掉
  // https://nextjs.org/docs/app/building-your-application/optimizing/images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
