import { LocaleEnum } from "@/enums/Locale";

import type { Locale } from "@/i18n/routing";

import type { Session } from "@/stores/auth-store";

export const getDisplayName = (
  locale: Locale,
  user?: Session["user"] | null,
) => {
  if (!user) return "";

  const nameParts =
    locale !== LocaleEnum.En
      ? [user.lastName, user.firstName]
      : [user.firstName, user.lastName];

  const name = nameParts.filter(Boolean).join(" ");

  return name || user.email || "";
};
