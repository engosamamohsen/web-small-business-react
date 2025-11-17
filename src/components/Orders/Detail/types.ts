// Type definitions for Order components
export interface Address {
  city_id: number;
  city_name: string;
  area_id: number;
  area_name: string;
  street: string;
  building: string;
  floor: string;
  flat: string;
  special_sign: string;
  shipping: string;
  phone: string;
}

export interface Branch {
  id: number | null;
  name: string | null;
}

export interface OrderProduct {
  id: number;
  order_id: string;
  qty: string;
  product_price: string;
  discount: string;
  product_wholesale_price: string;
  notes: string | null;
  table_id: string | null;
  created_at: string;
  updated_at: string;
  size: string | null;
  color: string | null;
  name?: string;
}

export interface OrderDetailType {
  id: number;
  table_id: number | null;
  order_type: string;
  sub_total: string;
  shipping: string;
  delivery_id: string;
  total: string;
  order_status_id: string;
  order_status_name: string;
  address_id: string;
  customer_id: string;
  created_at: string;
  notes: string | null;
  customer: {
    name: string;
    phone: string;
  };
  delivery: any;
  address: Address;
  branches: Branch[];
  order_products: OrderProduct[];
}

export interface OrderStatusState {
  waitingApproval: boolean;
  waitingPayment: boolean;
  waitingShipping: boolean;
  delivered: boolean;
  cancelled: boolean;
}

export interface OrderDetailProps {
  order: OrderDetailType;
}

export interface OrderStatusTrackerProps {
  orderStatus: string;
  orderId: string | number;
}

export interface OrderSummaryProps {
  order: OrderDetailType;
}

export interface OrderItemsProps {
  order: OrderDetailType;
}
