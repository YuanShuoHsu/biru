import { LocaleCode } from "./locale";

export type LocalizedText = {
  [key in LocaleCode]: string;
};

export interface Choice {
  id: string;
  name: LocalizedText;
  extraCost: number;
  isActive: boolean;
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
  sold: number;
  stock: number | null;
}

export interface Category {
  id: string;
  name: LocalizedText;
  items: MenuItem[];
}
