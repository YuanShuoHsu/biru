import type { Organization } from "./organizations";

import type { Locale } from "@/i18n/routing";

import type { OrderMode } from "./orderMode";

interface RouteParam {
  locale: Locale;
  mode: OrderMode;
  organizationSlug: Organization["slug"];
}

export type RouteParams<K extends keyof RouteParam = keyof RouteParam> =
  Readonly<Pick<RouteParam, K>>;
