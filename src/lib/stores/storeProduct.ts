import { atom, useAtom } from "jotai";
import { CartItem } from "../types";

const cartAtom = atom<CartItem[]>([]);

const addItemAtom = atom(null, (get, set, item: CartItem) => {
  const items = get(cartAtom);
  const existingItem = items.find((i) => i.id === item.id);
  if (existingItem) {
    set(
      cartAtom,
      items.map((i) =>
        i.id === item.id ? { ...i, quantity: (i.quantity || 0) + 1 } : i,
      ),
    );
  } else {
    set(cartAtom, [...items, { ...item, quantity: 1 }]);
  }
});

const removeItemAtom = atom(null, (get, set, id: number) => {
  const items = get(cartAtom);
  set(
    cartAtom,
    items.filter((item) => item.id !== id),
  );
});

const updateQuantityAtom = atom(
  null,
  (get, set, { id, quantity }: { id: number; quantity: number }) => {
    const items = get(cartAtom);
    set(
      cartAtom,
      items.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  },
);

const clearCartAtom = atom(null, (get, set) => {
  set(cartAtom, []);
});

export const useCartStore = () => {
  const [items] = useAtom(cartAtom);
  const [, addItem] = useAtom(addItemAtom);
  const [, removeItem] = useAtom(removeItemAtom);
  const [, updateQuantity] = useAtom(updateQuantityAtom);
  const [, clearCart] = useAtom(clearCartAtom);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
};
