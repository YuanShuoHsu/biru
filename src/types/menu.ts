import { LocaleCode } from "./locale";

type LocalizedText = Record<LocaleCode, string>;

interface RecipeItem {
  id: string;
  name: LocalizedText;
  unit: LocalizedText;
  usage: number;
}

export interface Choice {
  id: string;
  name: LocalizedText;
  extraCost: number;
  isActive: boolean;
  isShared: boolean;
  recipes: RecipeItem[];
  sold: number;
  stock: number | null;
}

export interface Option {
  id: string;
  name: LocalizedText;
  choices: Choice[];
  multiple: boolean;
  required: boolean;
}

export interface MenuItem {
  id: string;
  name: LocalizedText;
  createdAt: string;
  description: LocalizedText;
  imageUrl: string;
  isActive: boolean;
  options: Option[];
  price: number;
  recipes: RecipeItem[];
  sold: number;
  stock: number | null;
}

export interface Category {
  id: string;
  name: LocalizedText;
  items: MenuItem[];
}
