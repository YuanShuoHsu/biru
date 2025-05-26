type Tag = "popular" | "new" | "lowCaffeine";

export interface Choice {
  label: string;
  extraCost: number;
}

export interface Option {
  name: string;
  choices: Choice[];
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  price: number;
  tags?: Tag[];
  options?: Option[];
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  items: MenuItem[];
}
