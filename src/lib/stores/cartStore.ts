import { create } from "zustand";
interface CartState {
    cartCount: number;
}

interface CartActions {
    setCartCount: (count: number) => void;
    incrementCartCount: () => void;
    decrementCartCount: () => void;
    resetCartCount: () => void;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>((set) => ({
    // State
    cartCount: 0,

    // Actions
    setCartCount: (count) => set({ cartCount: count }),

    incrementCartCount: () =>
        set((state) => ({ cartCount: state.cartCount + 1 })),

    decrementCartCount: () =>
        set((state) => ({ cartCount: Math.max(0, state.cartCount - 1) })),

    resetCartCount: () => set({ cartCount: 0 }),
}));

// Selector hooks for optimized re-renders
export const useCartCount = () => useCartStore((state) => state.cartCount);