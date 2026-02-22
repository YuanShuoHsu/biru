// https://next-intl.dev/docs/workflows/typescript

import messages from "@/app/[locale]/dictionaries";

import { formats } from "@/i18n/request";
import { routing } from "@/i18n/routing";

declare module "next-intl" {
  interface AppConfig {
    Formats: typeof formats;
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
