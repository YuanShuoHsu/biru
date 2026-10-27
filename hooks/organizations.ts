"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";

import type { OrganizationResponse } from "@/types/organizations";
import type { RouteParams } from "@/types/routeParams";

export const useOrganization = () => {
  const { organizationSlug } = useParams<RouteParams>();

  const { data: organization = null } = useSWR<OrganizationResponse>(
    organizationSlug ? `/api/organizations/${organizationSlug}` : null,
  );

  return organization;
};
