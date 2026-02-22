import type { useTranslations } from "next-intl";

import { PersonAdd, Settings } from "@mui/icons-material";
import { Avatar } from "@mui/material";

import type { MenuItem } from "@/types/menuItem";

export const getProfileMenuItems = (
  tAccount: ReturnType<typeof useTranslations>,
): MenuItem[] => [
  {
    icon: Avatar,
    label: tAccount("accountMenu.profile"),
    to: "/profile",
  },
  {
    icon: Avatar,
    label: tAccount("accountMenu.myAccount"),
    to: "/my-account",
  },
];

export const getAccountMenuItems = (
  tAccount: ReturnType<typeof useTranslations>,
): MenuItem[] => [
  {
    icon: PersonAdd,
    label: tAccount("accountMenu.addAnotherAccount"),
    to: "/add-another-account",
  },
  {
    icon: Settings,
    label: tAccount("accountSettings.label"),
    to: "/account-settings",
  },
];
