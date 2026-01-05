import { Logout, PersonAdd, Settings } from "@mui/icons-material";
import { Avatar } from "@mui/material";

import type { I18nDict } from "@/providers/i18n-store-provider";

import type { MenuItem } from "@/types/menuItem";

export const getProfileMenuItems = (dict: I18nDict): MenuItem[] => [
  {
    icon: Avatar,
    label: dict.account.accountMenu.profile,
    to: "/profile",
  },
  {
    icon: Avatar,
    label: dict.account.accountMenu.myAccount,
    to: "/my-account",
  },
];

export const getAccountMenuItems = (dict: I18nDict): MenuItem[] => [
  {
    icon: PersonAdd,
    label: dict.account.accountMenu.addAnotherAccount,
    to: "/add-another-account",
  },
  {
    icon: Settings,
    label: dict.account.accountMenu.settings,
    to: "/account-settings",
  },
];

export const getLogoutMenuItem = (
  dict: I18nDict,
  {
    isMutatingLogout,
    onLogout,
  }: { isMutatingLogout?: boolean; onLogout: () => void },
): MenuItem => ({
  disabled: isMutatingLogout,
  icon: Logout,
  label: dict.auth.signOut.label,
  onClick: onLogout,
});
