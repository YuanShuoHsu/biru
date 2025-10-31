import type { LocaleCode, LocalizedText } from "./locale";

export interface Store {
  id: string;
  name: LocalizedText;
  createdAt: Date;
  isActive: boolean;
  slug: string;
  updatedAt: Date;
}

export type StoreSlug = Store["slug"];
export type StoreName = Store["name"][LocaleCode];
