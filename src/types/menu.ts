interface Size {
  label: string;
  price: number;
}

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
  tags?: string[];
  options?: Option[];
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  items: MenuItem[];
}
