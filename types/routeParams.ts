import type { LocaleCode } from "./locale";
import type { OrderMode } from "./orderMode";
import type { PartySize } from "./partySize";
import type { StoreSlug } from "./stores";
import type { TableNumber } from "./tableNumbers";

interface RouteParam {
  lang: LocaleCode;
  mode: OrderMode;
  storeSlug: StoreSlug;
  tableNumber: TableNumber;
  partySize: PartySize;
}

export type RouteParams<K extends keyof RouteParam = keyof RouteParam> =
  Readonly<Pick<RouteParam, K>>;
