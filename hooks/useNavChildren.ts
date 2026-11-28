"use client";

import { useAuthNavItems } from "@/hooks/useAuth";
import { useRoutes } from "@/hooks/useRoutes";
import { useSession } from "@/hooks/useSession";

import type { NavItem, Slot } from "@/types/navItem";

import { useAccountNavItems } from "@/utils/account";

export const useNavChildren = (divider: Slot): Record<string, NavItem[]> => {
  const session = useSession();

  const navItem = useRoutes();

  const accountChildren = useAccountNavItems(divider);
  const authChildren = useAuthNavItems();

  return {
    "/auth": session ? accountChildren : authChildren,
    "/company": [
      navItem("/company/about"),
      navItem("/company/terms"),
      navItem("/company/privacy"),
    ],
  };
};
