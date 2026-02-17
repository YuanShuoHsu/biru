// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

import type { MetadataRoute } from "next";

import { getSiteMeta } from "./lib/siteMeta";

import { i18n } from "@/i18n-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const { isBlockedHost, siteUrl } = getSiteMeta();

  if (isBlockedHost) return [];

  const lastModified = new Date();
  const alternates = Object.fromEntries(
    i18n.locales.map((locale) => [locale, `${siteUrl}/${locale}`]),
  );

  return i18n.locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified,
    alternates: {
      languages: alternates,
    },
  }));
}
