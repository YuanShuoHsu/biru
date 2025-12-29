import { LocalizedText } from "./locale";

interface RecipeItem {
  id: string;
  name: LocalizedText;
  createdAt: Date;
  unit: LocalizedText;
  usage: number;
  updatedAt: Date;
}

export interface Choice {
  id: string;
  name: LocalizedText;
  createdAt: Date;
  extraCost: number;
  isActive: boolean;
  isShared: boolean;
  recipes: RecipeItem[];
  sold: number;
  stock: number | null;
  updatedAt: Date;
}

export interface Option {
  id: string;
  name: LocalizedText;
  choices: Choice[];
  createdAt: Date;
  multiple: boolean;
  required: boolean;
  updatedAt: Date;
}

export interface MenuItem {
  id: string;
  name: LocalizedText;
  createdAt: Date;
  description: LocalizedText;
  imageUrl: string;
  isActive: boolean;
  options: Option[];
  price: number;
  recipes: RecipeItem[];
  sold: number;
  stock: number | null;
  updatedAt: Date;
}

export interface Menu {
  id: string;
  name: LocalizedText;
  createdAt: Date;
  menuItems: MenuItem[];
  updatedAt: Date;
}
