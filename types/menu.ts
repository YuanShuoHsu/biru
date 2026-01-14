import type { Locale } from "@/app/[lang]/dictionaries";

interface Ingredient {
  id: string;
  key: string;
  name: Record<Locale, string>;
  createdAt: Date;
  unit: Record<Locale, string>;
  updatedAt: Date;
  usage: number;
}

export interface Choice {
  id: string;
  key: string;
  name: Record<Locale, string>;
  createdAt: Date;
  extraCost: number;
  ingredients: Ingredient[];
  isActive: boolean;
  isShared: boolean;
  sold: number;
  stock: number | null;
  updatedAt: Date;
}

export interface Option {
  id: string;
  key: string;
  name: Record<Locale, string>;
  choices: Choice[];
  createdAt: Date;
  isActive: boolean;
  multiple: boolean;
  required: boolean;
  updatedAt: Date;
}

export interface MenuItem {
  id: string;
  key: string;
  name: Record<Locale, string>;
  createdAt: Date;
  description: Record<Locale, string>;
  imageUrl: string;
  ingredients: Ingredient[];
  isActive: boolean;
  options: Option[];
  price: number;
  sold: number;
  stock: number | null;
  updatedAt: Date;
}

export interface Menu {
  id: string;
  key: string;
  name: Record<Locale, string>;
  createdAt: Date;
  isActive: boolean;
  items: MenuItem[];
  storeId: string;
  updatedAt: Date;
}
