// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

import type { MetadataRoute } from "next";

import { getSiteMeta } from "./lib/siteMeta";

import { locales } from "@/constants/locale";

export default function sitemap(): MetadataRoute.Sitemap {
  const { isBlockedHost, siteUrl } = getSiteMeta();

  if (isBlockedHost) return [];

  const lastModified = new Date();
  const alternates = Object.fromEntries(
    locales.map((locale) => [locale, `${siteUrl}/${locale}`]),
  );

  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified,
    alternates: {
      languages: alternates,
    },
  }));
}
