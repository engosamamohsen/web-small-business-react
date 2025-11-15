import { Address, OrderStatusState } from "./types";

/**
 * Determines order status based on status string
 */
export const getOrderStatus = (status: string): OrderStatusState => {
  const statusInt = parseInt(status);
  return {
    waitingApproval: statusInt >= 1,
    waitingPayment: statusInt >= 2,
    received: statusInt >= 3,
    preparing: statusInt >= 4,
    delivered: statusInt >= 5,
  };
};

/**
 * Formats address details into a readable string
 */
export const formatAddress = (address?: Address): string => {
  if (!address) return "Address not available";
  return `${address.city_name || ""}, ${address.area_name || ""}, ${address.street || ""}, Building ${address.building || ""}, Floor ${address.floor || ""}, Flat ${address.flat || ""}`;
};

/**
 * Calculates actual price after discount
 */
export const calculateActualPrice = (
  price: string,
  discount: string,
): string => {
  const priceNum = parseFloat(price || "0");
  const discountNum = parseFloat(discount || "0");
  return (priceNum - discountNum).toFixed(2);
};

/**
 * Calculates total price for an item
 */
export const calculateItemTotal = (
  price: string,
  discount: string,
  quantity: string,
): string => {
  const actualPrice = parseFloat(calculateActualPrice(price, discount));
  const qty = parseInt(quantity || "0", 10);
  return (actualPrice * qty).toFixed(2);
};
