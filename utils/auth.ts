import { fetcher } from "./fetcher";
import { handleQueryParam, QueryParamKey } from "./queryParams";

import type { Locale } from "@/app/[lang]/dictionaries";

import { LocaleEnum } from "@/constants/locale";

import { Login, PersonAdd } from "@mui/icons-material";

import type { I18nDict } from "@/providers/i18n-store-provider";

import type { MenuItem } from "@/types/menuItem";
import type { UserResponseDto } from "@/types/users/user-response.dto";

export const fetchProfile = (accessToken: string) =>
  fetcher<UserResponseDto>("/api/auth/profile", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

export const getDisplayName = (
  lang: Locale,
  profile: UserResponseDto | null,
) => {
  if (!profile) return "";

  const showFamilyNameFirst = lang !== LocaleEnum.En;

  const nameParts = showFamilyNameFirst
    ? [profile.lastName, profile.firstName]
    : [profile.firstName, profile.lastName];

  const name = nameParts.filter(Boolean).join(" ");

  return name || profile.email || "";
};

export const getAuthMenuItems = (
  dict: I18nDict,
  redirect?: string,
): MenuItem[] => [
  {
    icon: Login,
    label: dict.auth.signIn.label,
    to: handleQueryParam("/sign-in", {
      [QueryParamKey.Redirect]: redirect,
    }),
  },
  {
    icon: PersonAdd,
    label: dict.auth.signUp.label,
    to: handleQueryParam("/sign-up", {
      [QueryParamKey.Redirect]: redirect,
    }),
  },
];
