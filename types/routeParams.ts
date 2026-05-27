import type { Organization } from "./organizations";

import type { Locale } from "@/i18n/routing";

interface RouteParam {
  locale: Locale;
  organizationSlug: Organization["slug"];
}

export type RouteParams<K extends keyof RouteParam = keyof RouteParam> =
  Readonly<Pick<RouteParam, K>>;
