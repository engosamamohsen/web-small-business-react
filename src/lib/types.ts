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
  is_variation?: boolean;
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
