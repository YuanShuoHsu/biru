"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";

import type { Organization } from "@/types/organizations";
import type { RouteParams } from "@/types/routeParams";

export const useOrganization = () => {
  const { storeSlug } = useParams<RouteParams>();

  const { data: organization = null } = useSWR<Organization>(
    storeSlug ? `/api/organizations/${storeSlug}` : null,
  );

  return organization;
};
