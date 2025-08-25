import { LocaleCode } from "./locale";

export type LocalizedText = {
  [key in LocaleCode]: string;
};

export interface Choice {
  label: LocalizedText;
  value: string;
  extraCost: number;
  isActive: boolean;
  sold: number;
  stock: number | null;
}

export interface Option {
  name: string;
  label: LocalizedText;
  choices: Choice[];
  multiple: boolean;
  required: boolean;
}

export interface MenuItem {
  id: string;
  label: LocalizedText;
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
  label: LocalizedText;
  items: MenuItem[];
}
