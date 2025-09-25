import { LocaleCode } from "./locale";

import { stores } from "@/utils/stores";

export type StoreId = (typeof stores)[number]["id"];

export interface Store {
  id: string;
  name: Record<LocaleCode, string>;
}
