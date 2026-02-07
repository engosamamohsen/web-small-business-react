/**
 * Product type definitions
 */
export interface Choice {
  id: string;
  name: string;
  enable: boolean;
  price: number;
}

export interface Variation {
  id: string;
  name: string;
  is_required: boolean;
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

export interface ProductCategory {
  id: number | string;
  name: string;
}

export interface TechnicalInfo {
  id: number;
  product_id?: string;
  key: string;
  value: string | number;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: number | string;
  name: string;
  title?: string;
  description?: string;
  price: number;
  price_after?: number;
  discount?: string;
  image?: string;
  main_image?: string;
  logo?: string;
  images?: string[];
  gallery?: string[];
  gallery_images?: string[];
  category?: ProductCategory;
  category_id?: string | number;
  category_name?: string;
  is_available?: boolean;
  inStock?: boolean;
  stock?: number;
  is_variation?: boolean;
  variations?: Variation[];
  sizes?: SizeOption[];
  colors?: ColorOption[];
  steps?: string[];
  description_steps?: string[];
  technicalInformation?: TechnicalInfo[];
  technical_information?: TechnicalInfo[];
  count?: number;
  brand?: string;
  features?: string[];
  keywords?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface FormattedVariation {
  main_variation_id: string;
  choices: string[];
}

export interface FormattedVariations {
  variations: FormattedVariation[];
}

/**
 * Category type definitions
 */
export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  parent_id?: string;
  products_count?: number;
}

/**
 * Banner type definitions
 */
export interface Banner {
  id: string;
  image: string;
  title?: string;
  link?: string;
  order?: number;
}

/**
 * Order type definitions
 */
export interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  address: Address;
  payment_method?: string;
  created_at: string;
  updated_at?: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variations?: Record<string, string>;
}

/**
 * Address type definitions
 */
export interface Address {
  id: string;
  name: string;
  phone: string;
  governorate_id: string;
  governorate_name?: string;
  city_id: string;
  city_name?: string;
  street: string;
  building?: string;
  floor?: string;
  apartment?: string;
  is_default?: boolean;
}

/**
 * User type definitions
 */
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  is_verified?: boolean;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

/**
 * Pagination type
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  last_page: number;
}
