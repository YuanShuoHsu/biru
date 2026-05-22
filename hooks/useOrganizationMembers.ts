"use client";

import useSWR from "swr";

import type { OrganizationMember } from "@/types/organizations";

export const useOrganizationMembers = (organizationId: string) => {
  const { data: organizationMembers = [] } = useSWR<OrganizationMember[]>(
    organizationId ? `/api/organizations/${organizationId}/members` : null,
  );

  return organizationMembers;
};
