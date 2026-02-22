import type { useTranslations } from "next-intl";

import { fetcher } from "./fetcher";
import { handleQueryParam, QueryParamKey } from "./queryParams";

import { LocaleEnum } from "@/enums/Locale";

import { Locale } from "@/i18n/routing";

import { Login, Logout, PersonAdd } from "@mui/icons-material";

import type { MenuItem } from "@/types/menuItem";
import type { UserResponseDto } from "@/types/users/user-response.dto";

export const fetchProfile = (accessToken: string) =>
  fetcher<UserResponseDto>("/api/auth/profile", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

export const getAuthMenuItems = (
  tAuth: ReturnType<typeof useTranslations>,
  redirectTo?: string,
): MenuItem[] => [
  {
    icon: Login,
    label: tAuth("signIn.label"),
    to: handleQueryParam("/sign-in", {
      [QueryParamKey.RedirectTo]: redirectTo,
    }),
  },
  {
    icon: PersonAdd,
    label: tAuth("signUp.label"),
    to: handleQueryParam("/sign-up", {
      [QueryParamKey.RedirectTo]: redirectTo,
    }),
  },
];

export const getDisplayName = (
  locale: Locale,
  profile: UserResponseDto | null,
) => {
  if (!profile) return "";

  const showFamilyNameFirst = locale !== LocaleEnum.En;

  const nameParts = showFamilyNameFirst
    ? [profile.lastName, profile.firstName]
    : [profile.firstName, profile.lastName];

  const name = nameParts.filter(Boolean).join(" ");

  return name || profile.email || "";
};

export const getLogoutMenuItem = (
  tAuth: ReturnType<typeof useTranslations>,
  {
    isMutatingLogout,
    onLogout,
  }: { isMutatingLogout?: boolean; onLogout: () => void },
): MenuItem => ({
  disabled: isMutatingLogout,
  icon: Logout,
  label: tAuth("signOut.label"),
  onClick: onLogout,
});
