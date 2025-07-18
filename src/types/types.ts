interface VariationChoice {
  id: number;
  name: string;
  price: number;
}

interface Variation {
  main_variation_id: string;
  main_variation_name: string;
  choices: VariationChoice[];
}

export interface CartItemType {
  cart_item_id: number;
  product_id: string;
  product_name: string;
  product_image: string;
  qty: string;
  unit_price: number;
  item_total: number;
  product_note: string | null;
  variations: Variation[];
}

export interface CartResponseType {
  cart_items: CartItemType[];
  total_price: number;
  items_count: number;
}
