import type { OrderMode } from "./orderMode";
import type { PartySize } from "./partySize";
import type { StoreSlug } from "./stores";
import type { TableNumber } from "./tableNumbers";

import type { Locale } from "@/app/[lang]/dictionaries";

interface RouteParam {
  lang: Locale;
  mode: OrderMode;
  storeSlug: StoreSlug;
  tableNumber: TableNumber;
  partySize: PartySize;
}

export type RouteParams<K extends keyof RouteParam = keyof RouteParam> =
  Readonly<Pick<RouteParam, K>>;
