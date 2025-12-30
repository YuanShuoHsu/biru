import { LocalizedText } from "./locale";

interface Ingredient {
  id: string;
  key: string;
  name: LocalizedText;
  createdAt: Date;
  unit: LocalizedText;
  updatedAt: Date;
  usage: number;
}

export interface Choice {
  id: string;
  key: string;
  name: LocalizedText;
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
  name: LocalizedText;
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
  name: LocalizedText;
  createdAt: Date;
  description: LocalizedText;
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
  name: LocalizedText;
  createdAt: Date;
  isActive: boolean;
  items: MenuItem[];
  storeId: string;
  updatedAt: Date;
}
