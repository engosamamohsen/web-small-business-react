export interface ProductType {
  id: number;
  title: string;
  name?: string;
  price: number;
  description?: string;
  category?: string;
  image: string;
  discount?: string;
  price_after?: number;
}

export interface CartItem extends ProductType {
  quantity?: number;
}

export type SettingsType = Record<string, any>;
