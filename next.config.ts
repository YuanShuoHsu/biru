// https://next-intl.dev/docs/getting-started/app-router

import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import { API_ORDER_MODE, ORDER_MODE } from "./constants/orderMode";

const ORDER_QR_MODES = [
  { mode: ORDER_MODE.Counter, tokenParam: "modeToken" },
  { mode: ORDER_MODE.DineIn, tokenParam: "tableToken" },
  { mode: ORDER_MODE.DriveThru, tokenParam: "modeToken" },
];

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      ...ORDER_QR_MODES.map(({ mode, tokenParam }) => ({
        source: `/:locale/order/${mode}/:organizationSlug`,
        has: [{ type: "query" as const, key: tokenParam }],
        destination: `${process.env.NEXT_PUBLIC_NEST_URL}/api/organizations/:organizationSlug/order-qr?mode=${API_ORDER_MODE[mode]}`,
      })),
      {
        source: "/api/organizations/:organizationSlug/waitlist/qr",
        destination: `${process.env.NEXT_PUBLIC_NEST_URL}/api/organizations/:organizationSlug/waitlist/qr`,
      },
      {
        source: "/api/images/:path*",
        destination: `${process.env.NEXT_PUBLIC_NEST_URL}/api/images/:path*`,
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
      ...(process.env.NEXT_PUBLIC_IMAGE_HOST
        ? [
            {
              protocol: "https" as const,
              hostname: process.env.NEXT_PUBLIC_IMAGE_HOST,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
