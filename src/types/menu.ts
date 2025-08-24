import { LocaleCode } from "./locale";

export type LocalizedText = {
  [key in LocaleCode]: string;
};

export interface Choice {
  label: LocalizedText;
  value: string;
  extraCost: number;
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
  name: LocalizedText;
  createdAt: string;
  description: LocalizedText;
  imageUrl: string;
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
