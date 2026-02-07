import { atom, useAtom } from 'jotai';

/**
 * Cart count atom for global state management
 * Uses Jotai for atomic state management
 * Matches Next.js behavior
 */
export const cartCountAtom = atom<number>(0);

/**
 * Cart items type definition
 */
export interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variations?: {
    size?: string;
    color?: string;
    [key: string]: string | undefined;
  };
}

/**
 * Cart state atom
 */
export const cartItemsAtom = atom<CartItem[]>([]);

/**
 * Derived atom for cart total
 */
export const cartTotalAtom = atom((get) => {
  const items = get(cartItemsAtom);
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
});

/**
 * Custom hook for cart operations
 * Matches Next.js useCartStore behavior
 */
export const useCartStore = () => {
  const [cartCount, setCartCount] = useAtom(cartCountAtom);

  const incrementCartCount = () => {
    setCartCount((prev) => {
      if (!prev) {
        return 1;
      }
      return prev + 1;
    });
  };

  const decrementCartCount = () => {
    setCartCount((prev) => Math.max(0, prev - 1));
  };

  const resetCartCount = () => {
    setCartCount(0);
  };

  return {
    cartCount,
    setCartCount,
    incrementCartCount,
    decrementCartCount,
    resetCartCount,
  };
};
