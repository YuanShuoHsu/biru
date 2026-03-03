import { LocaleEnum } from "@/enums/Locale";

import { Locale } from "@/i18n/routing";

import type { UserResponseDto } from "@/types/users/user-response.dto";

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
