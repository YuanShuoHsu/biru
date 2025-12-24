import { fetcher } from "./fetcher";
import { handleRedirectParams } from "./redirect";

import { Locale } from "@/constants/locale";

import type { I18nDict } from "@/context/i18n";

import { Login, Logout, PersonAdd, Settings } from "@mui/icons-material";
import { Avatar } from "@mui/material";

import type { LocaleCode } from "@/types/locale";
import type { UserResponseDto } from "@/types/users/user-response.dto";

export const fetchProfile = (accessToken: string) =>
  fetcher<UserResponseDto>("/api/auth/profile", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

export const getDisplayName = (
  lang: LocaleCode,
  profile: UserResponseDto | null,
) => {
  if (!profile) return "";

  const showFamilyNameFirst = lang !== Locale.En;

  const nameParts = showFamilyNameFirst
    ? [profile.lastName, profile.firstName]
    : [profile.firstName, profile.lastName];

  const name = nameParts.filter(Boolean).join(" ");

  return name || profile.email || "";
};

export interface MemberAuthLinkItem {
  icon: React.ElementType;
  label: string;
  to: string;
}

export const getMemberAuthLinkItems = (
  dict: I18nDict,
  redirect?: string,
): MemberAuthLinkItem[] => {
  return [
    {
      icon: Login,
      label: dict.member.auth.signIn.label,
      to: handleRedirectParams("/sign-in", redirect),
    },
    {
      icon: PersonAdd,
      label: dict.member.auth.signUp.label,
      to: handleRedirectParams("/sign-up", redirect),
    },
  ];
};

interface BaseAuthMenuItem {
  disabled?: boolean;
  icon: React.ElementType;
  label: string;
}

interface LinkAuthMenuItem extends BaseAuthMenuItem {
  onClick?: never;
  to: string;
}

interface ButtonAuthMenuItem extends BaseAuthMenuItem {
  onClick: () => void;
  to?: never;
}

export type AuthMenuItem = LinkAuthMenuItem | ButtonAuthMenuItem;

export const getProfileMenuItems = (dict: I18nDict): LinkAuthMenuItem[] => [
  {
    icon: Avatar,
    label: dict.member.accountMenu.profile,
    to: "/profile",
  },
  {
    icon: Avatar,
    label: dict.member.accountMenu.myAccount,
    to: "/my-account",
  },
];

export const getAccountLinkItems = (dict: I18nDict): LinkAuthMenuItem[] => [
  {
    icon: PersonAdd,
    label: dict.member.accountMenu.addAnotherAccount,
    to: "/add-another-account",
  },
  {
    icon: Settings,
    label: dict.member.accountMenu.settings,
    to: "/account-settings",
  },
];

export const getLogoutMenuItem = (
  dict: I18nDict,
  {
    isMutatingLogout,
    onLogout,
  }: { isMutatingLogout: boolean; onLogout: () => void },
): ButtonAuthMenuItem[] => [
  {
    disabled: isMutatingLogout,
    icon: Logout,
    label: dict.member.auth.signOut.label,
    onClick: onLogout,
  },
];

export const getAccountMenuItems = (
  dict: I18nDict,
  {
    isMutatingLogout,
    onLogout,
  }: { isMutatingLogout: boolean; onLogout: () => void },
): AuthMenuItem[] => [
  ...getAccountLinkItems(dict),
  ...getLogoutMenuItem(dict, { isMutatingLogout, onLogout }),
];
