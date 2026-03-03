import { LocaleEnum } from "@/enums/Locale";

import { Locale } from "@/i18n/routing";

interface DisplayProfile {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}

export const getDisplayName = (
  locale: Locale,
  profile?: DisplayProfile | null,
) => {
  if (!profile) return "";

  const showFamilyNameFirst = locale !== LocaleEnum.En;

  const nameParts = showFamilyNameFirst
    ? [profile.lastName, profile.firstName]
    : [profile.firstName, profile.lastName];

  const name = nameParts.filter(Boolean).join(" ");

  return name || profile.email || "";
};
