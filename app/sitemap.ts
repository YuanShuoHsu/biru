// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

import type { MetadataRoute } from "next";

import { ORDER_MODE } from "@/constants/orderMode";

import { routing } from "@/i18n/routing";

import { getOrganizations } from "@/utils/organizations";
import { getSiteMeta } from "@/utils/siteMeta";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { isBlockedHost, siteUrl } = getSiteMeta();

  if (isBlockedHost) return [];

  const organizations = await getOrganizations();

  const pathnames = [
    "",
    "/company/about",
    "/company/privacy",
    "/company/terms",
    `/order/${ORDER_MODE.Pickup}`,
    ...organizations.map(({ slug }) => `/order/${ORDER_MODE.Pickup}/${slug}`),
  ];

  return pathnames.flatMap((pathname) => {
    const alternates = {
      ...Object.fromEntries(
        routing.locales.map((locale) => [
          locale,
          `${siteUrl}/${locale}${pathname}`,
        ]),
      ),
      "x-default": `${siteUrl}/${routing.defaultLocale}${pathname}`,
    };

    return routing.locales.map((locale) => ({
      url: `${siteUrl}/${locale}${pathname}`,
      alternates: {
        languages: alternates,
      },
    }));
  });
}
