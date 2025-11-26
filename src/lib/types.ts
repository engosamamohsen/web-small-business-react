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
  steps?: string[];
  description_steps?: string[];
  category?: Category;
  image: string;
  main_image?: string;
  discount?: string;
  price_after?: number;
  is_variation?: boolean;
  variations?: Variation[];
  gallery?: Array<string>;
  gallery_images?: Array<string>;
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
    main_image?: string;
    gallery_images?: Array<any>;
  }>;
  technicalInformation?: Array<{
    id: number;
    key: string;
    value: string | number;
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
  order_status_id: number;
  order_status_name: string;
  sub_total: string;
  shipping: string;
  total: string;
  customer: string;
  phone: string;
  delivery_id: number;
  delivery: number;
  table_id: number;
  created_at: string;
}

export type PaymentMethod = {
  paymentId: number;
  name_en: string;
  name_ar: string;
  redirect: string;
  logo: string;
};
