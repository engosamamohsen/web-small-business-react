import { atom, useAtom } from "jotai";
export const cartCountAtom = atom<number>(0);
// Custom hook for cart operations
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

  return {
    cartCount,
    setCartCount,
    incrementCartCount,
  };
};
