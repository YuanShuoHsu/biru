import { Locale } from "@/constants/locale";

import type { LocaleCode } from "@/types/locale";
import type { UserResponseDto } from "@/types/users/user-response.dto";

export const getDisplayName = (
  profile: UserResponseDto | null,
  lang: LocaleCode,
) => {
  if (!profile) return "";

  const showFamilyNameFirst = lang !== Locale.En;

  const nameParts = showFamilyNameFirst
    ? [profile.lastName, profile.firstName]
    : [profile.firstName, profile.lastName];

  const name = nameParts.filter(Boolean).join(" ");

  return name || profile.email || "";
};
