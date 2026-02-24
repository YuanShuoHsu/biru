import { fetcher } from "./fetcher";

import { LocaleEnum } from "@/enums/Locale";

import { Locale } from "@/i18n/routing";

import type { UserResponseDto } from "@/types/users/user-response.dto";

export const fetchProfile = (accessToken: string) =>
  fetcher<UserResponseDto>("/api/auth/profile", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

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
