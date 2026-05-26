import { cache } from "react";

import { fetcher } from "./fetcher";

import { routing, type Locale } from "@/i18n/routing";

import type { Menu } from "@/types/menu";

interface StorefrontMenuItem {
  id: string;
  name: string;
  description: string;
  image: string | null;
  price: number;
  createdAt: string;
  updatedAt: string;
}

interface StorefrontMenuSection {
  id: string;
  storeId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  items: StorefrontMenuItem[];
}

const toMultilingual = (text: string): Record<Locale, string> =>
  Object.fromEntries(routing.locales.map((l) => [l, text])) as Record<
    Locale,
    string
  >;

export const getMenus = cache(
  async (slug: string, locale: Locale): Promise<Menu[]> => {
    try {
      const sections = await fetcher<StorefrontMenuSection[]>(
        `/api/organizations/${slug}/order-menu?lang=${locale}`,
        { next: { revalidate: 60, tags: ["menus"] } },
      );

    if (!Array.isArray(sections)) return [];

    return sections.map((section) => ({
      id: section.id,
      key: section.id,
      storeId: section.storeId,
      name: toMultilingual(section.name),
      isActive: true,
      createdAt: new Date(section.createdAt),
      updatedAt: new Date(section.updatedAt),
      items: section.items.map((item) => ({
        id: item.id,
        key: item.id,
        menuId: section.id,
        name: toMultilingual(item.name),
        description: toMultilingual(item.description),
        image: item.image,
        price: item.price,
        stock: null,
        sold: 0,
        isActive: true,
        options: [],
        ingredients: [],
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      })),
    }));
    } catch {
      return [];
    }
  },
);
