import { LocaleCode } from "./locale";

export interface Store {
  id: string;
  name: Record<LocaleCode, string>;
}

export type StoreId = Store["id"];
export type StoreName = Store["name"][LocaleCode];
