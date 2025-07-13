export interface Choice {
  id: string;
  name: string;
  enable: boolean;
  price: number;
}

export interface Variation {
  id: string;
  name: string;
  is_required: boolean; // Mandatory (radio button) or optional (checkbox)
  enable: boolean;
  choices: Choice[];
}

export interface SizeOption {
  id: string | number;
  size: string;
  price?: string | number;
}

export interface ColorOption {
  id: string | number;
  color: string;
}

export interface Category {
  id: number | string;
  name: string;
}

export interface ProductType {
  id: number;
  title: string;
  name: string;
  price: number;
  description: string;
  category?: Category;
  image: string;
  discount?: string;
  price_after?: number;
  is_variation?: boolean;
  variations?: Variation[];
  gallery?: Array<{id: string; image: string}>;
  sizes?: SizeOption[];
  colors?: ColorOption[];
  count?: number;
  technical_information?: Array<{
    id: number;
    product_id: string;
    key: string;
    value: string | number;
    created_at: string;
    updated_at: string;
  }>;
}

export interface CartItem extends ProductType {
  quantity?: number;
  count?: number;
}

export type SettingsType = Record<string, any>;

export interface OrderType {
  id: number;
  order_type: number;
  order_status: number;
  sub_total: string;
  shipping: string;
  total: string;
  customer: string;
  phone: string;
  delivery_id: number;
  delivery: number;
  table_id: number;
  date: string;
}
