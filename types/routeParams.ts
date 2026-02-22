import type { OrderMode } from "./orderMode";
import type { PartySize } from "./partySize";
import type { StoreSlug } from "./stores";
import type { TableNumber } from "./tableNumbers";

import type { Locale } from "@/i18n/routing";

interface RouteParam {
  locale: Locale;
  mode: OrderMode;
  storeSlug: StoreSlug;
  tableNumber: TableNumber;
  partySize: PartySize;
}

export type RouteParams<K extends keyof RouteParam = keyof RouteParam> =
  Readonly<Pick<RouteParam, K>>;
