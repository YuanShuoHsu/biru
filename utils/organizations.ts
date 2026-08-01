import { cache } from "react";

import { fetcher } from "./fetcher";

import type { OrganizationResponse } from "@/types/organizations";

export const getOrganization = cache(
  async (slug: OrganizationResponse["slug"]) => {
    try {
      return await fetcher<OrganizationResponse>(`/api/organizations/${slug}`);
    } catch {
      return null;
    }
  },
);

export const getOrganizations = cache(
  async (fetchOptions?: { headers: { cookie: string } }) => {
    try {
      return await fetcher<OrganizationResponse[]>(
        "/api/organizations",
        fetchOptions,
      );
    } catch {
      return [];
    }
  },
);
