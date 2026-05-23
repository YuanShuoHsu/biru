"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";

import type {
  Organization,
  OrganizationLocation,
  OrganizationMember,
} from "@/types/organizations";
import type { RouteParams } from "@/types/routeParams";

export const useOrganization = () => {
  const { storeSlug } = useParams<RouteParams>();

  const { data: organization = null } = useSWR<Organization>(
    storeSlug ? `/api/organizations/${storeSlug}` : null,
  );

  return organization;
};

export const useOrganizationLocation = (organizationId: string) => {
  const { data: location = null } = useSWR<OrganizationLocation>(
    organizationId ? `/api/organizations/${organizationId}/location` : null,
  );

  return location;
};

export const useOrganizationMembers = (organizationId: string) => {
  const { data: organizationMembers = [] } = useSWR<OrganizationMember[]>(
    organizationId ? `/api/organizations/${organizationId}/members` : null,
  );

  return organizationMembers;
};

export const useOrganizations = () => {
  const { data: organizations = [] } =
    useSWR<Organization[]>("/api/organizations");

  return organizations;
};
