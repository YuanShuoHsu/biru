import { cache } from "react";

import { fetcher } from "./fetcher";

import type { Store } from "@/types/stores";

interface OrganizationDto {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export const getStores = cache(async (): Promise<Store[]> => {
  try {
    const data = await fetcher<OrganizationDto[]>("/api/organizations", {
      next: { revalidate: 60, tags: ["stores"] },
    });

    if (!Array.isArray(data)) return [];

    return data.map((org) => ({
      id: org.id,
      name: org.name,
      slug: org.slug,
      isActive: true,
      createdAt: new Date(org.createdAt),
      updatedAt: new Date(org.createdAt),
    }));
  } catch {
    return [];
  }
});
