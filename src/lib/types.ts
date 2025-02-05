export interface ProductType {
  id: number;
  title: string;
  price: number;
  description?: string;
  category?: string;
  image: string;
}

export interface CartItem extends ProductType {
  quantity?: number;
}

export type SettingsType = Record<string, any>;
