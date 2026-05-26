export interface Store {
  id: string;
  name: string;
  createdAt: Date;
  isActive: boolean;
  slug: string;
  updatedAt: Date;
}

export type StoreSlug = Store["slug"];
