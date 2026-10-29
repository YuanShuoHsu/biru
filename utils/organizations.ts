import { cacheLife } from "next/cache";
import { getLocale } from "next-intl/server";
import { cache } from "react";

import { fetcher } from "./fetcher";

import { redirect } from "@/i18n/navigation";

import type {
  OrganizationResponse,
  OrganizationTeamMember,
} from "@/types/organizations";

export const getOrganization = cache((slug: OrganizationResponse["slug"]) =>
  fetcher<OrganizationResponse>(`/api/organizations/${slug}`),
);

export const getOrganizations = async () => {
  "use cache";
  cacheLife("minutes");

  return fetcher<OrganizationResponse[]>("/api/organizations");
};

export const getOrganizationTeam = async (
  slug: OrganizationResponse["slug"],
) => {
  "use cache";
  cacheLife("minutes");

  return fetcher<OrganizationTeamMember[]>(`/api/organizations/${slug}/team`);
};

// 印在桌上與門口的 QR 不會重印，店家改 slug 後舊網址要轉到現行網址並保留桌號等參數
export const redirectToCurrentSlug = async (
  organization: OrganizationResponse,
  organizationSlug: OrganizationResponse["slug"],
  pathname: (slug: OrganizationResponse["slug"]) => string,
  searchParams: Record<string, string | string[] | undefined> = {},
) => {
  if (organization.slug === organizationSlug) return;

  const query = new URLSearchParams(
    Object.entries(searchParams).flatMap(([key, value]) =>
      [value ?? []].flat().map((item) => [key, item]),
    ),
  );
  const target = pathname(organization.slug);

  redirect({
    href: query.size ? `${target}?${query}` : target,
    locale: await getLocale(),
  });
};
