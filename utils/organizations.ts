import { cacheLife } from "next/cache";
import { getLocale } from "next-intl/server";
import { cache } from "react";

import { fetcher } from "./fetcher";

import { redirect } from "@/i18n/navigation";

import type {
  OrganizationResponse,
  OrganizationTeamMember,
} from "@/types/organizations";

export const getOrganization = cache(
  async (slug: OrganizationResponse["slug"]) => {
    try {
      return await fetcher<OrganizationResponse>(`/api/organizations/${slug}`);
    } catch {
      return null;
    }
  },
);

export const getOrganizations = async () => {
  "use cache";
  cacheLife("minutes");

  try {
    return await fetcher<OrganizationResponse[]>("/api/organizations");
  } catch {
    return [];
  }
};

export const getOrganizationTeam = async (
  slug: OrganizationResponse["slug"],
) => {
  "use cache";
  cacheLife("minutes");

  try {
    return await fetcher<OrganizationTeamMember[]>(
      `/api/organizations/${slug}/team`,
    );
  } catch {
    return [];
  }
};

// 印在桌上與門口的 QR 不會重印，店家改 slug 後舊網址要轉到現行網址並保留桌號等參數
export const redirectToCurrentSlug = async (
  organization: OrganizationResponse | null,
  organizationSlug: OrganizationResponse["slug"],
  pathname: (slug: OrganizationResponse["slug"]) => string,
  searchParams: Record<string, string | string[] | undefined> = {},
) => {
  if (!organization || organization.slug === organizationSlug) return;

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
