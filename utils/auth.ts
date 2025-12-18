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
  { redirectTo }: { redirectTo?: string } = {},
): MemberAuthLinkItem[] => {
  return [
    {
      icon: Login,
      label: dict.member.auth.signIn.label,
      to: handleRedirectParams("/sign-in", redirectTo),
    },
    {
      icon: PersonAdd,
      label: dict.member.auth.signUp.label,
      to: handleRedirectParams("/sign-up", redirectTo),
    },
  ];
};

export interface AuthMenuItem {
  disabled?: boolean;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  to?: string;
}

export const getProfileMenuItems = (dict: I18nDict): AuthMenuItem[] => [
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

export const getAccountMenuItems = (
  dict: I18nDict,
  {
    isMutatingLogout,
    onLogout,
  }: { isMutatingLogout?: boolean; onLogout: () => void },
): AuthMenuItem[] => [
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
  {
    disabled: isMutatingLogout,
    icon: Logout,
    label: dict.member.auth.signOut.label,
    onClick: onLogout,
  },
];
