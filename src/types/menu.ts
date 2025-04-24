interface Size {
  label: string;
  price: number;
}

type Tag = "popular" | "new" | "lowCaffeine";

interface Choice {
  label: string;
  extraCost?: number;
}

interface Option {
  name: string;
  choices: Choice[];
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  sizes: Size[];
  tags?: Tag[];
  options?: Option[];
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  items: MenuItem[];
}
