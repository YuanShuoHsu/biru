interface SizeOption {
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

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  sizes?: SizeOption[];
  tags?: string[];
  options?: Option[];
  inStock?: boolean;
}

export interface Category {
  id: string;
  name: string;
  items: MenuItem[];
}
