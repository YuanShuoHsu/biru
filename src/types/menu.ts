type Tag = "lowCaffeine";

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
  createdAt: string;
  description?: string;
  imageUrl: string;
  inStock: boolean;
  options?: Option[];
  price: number;
  sold: number;
  tags?: Tag[];
}

export interface Category {
  id: string;
  name: string;
  items: MenuItem[];
}
