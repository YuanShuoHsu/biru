import type { Locale } from "@/app/[lang]/dictionaries";

export interface Store {
  id: string;
  name: Record<Locale, string>;
  createdAt: Date;
  isActive: boolean;
  slug: string;
  updatedAt: Date;
}

export type StoreSlug = Store["slug"];
export type StoreName = Store["name"][Locale];
