"use client";

import { useTranslations } from "next-intl";

import { useLogoutNavItem } from "@/hooks/useAuth";
import { useRoutes } from "@/hooks/useRoutes";

import { PersonAdd } from "@mui/icons-material";

import type { NavItem, Slot } from "@/types/navItem";

export const useAccountNavItems = (divider: Slot): NavItem[] => {
  const navItem = useRoutes();

  const addAccountItem = useAddAccountNavItem();
  const logoutItem = useLogoutNavItem();

  return [
    navItem("/auth/orders"),
    navItem("/auth/coupons"),
    navItem("/auth/points"),
    { slot: divider },
    navItem("/auth/settings"),
    logoutItem,
    { slot: divider },
    addAccountItem,
  ];
};

export const useAddAccountNavItem = (): NavItem => {
  const tAuth = useTranslations("auth");

  const navItem = useRoutes();

  return {
    ...navItem("/auth/sign-in"),
    icon: PersonAdd,
    label: tAuth("addAccount.label"),
  };
};
