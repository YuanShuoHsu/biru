import type { StoreSlug } from "./stores";

import type { Locale } from "@/i18n/routing";

interface RouteParam {
  locale: Locale;
  storeSlug: StoreSlug;
}

export type RouteParams<K extends keyof RouteParam = keyof RouteParam> =
  Readonly<Pick<RouteParam, K>>;
