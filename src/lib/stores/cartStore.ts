import { create } from "zustand";

/**
 * Zustand Cart Store
 * 
 * This is a BACKUP store that can be used alongside the Context.
 * The SettingsProvider/useCart is preferred for most cases.
 * 
 * Use this store when:
 * - You need cart state outside of React components
 * - You need to persist cart to localStorage
 * - You're in a non-React context
 */

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
    cartCount: 0,

    setCartCount: (count) => set({ cartCount: count }),

    incrementCartCount: () =>
        set((state) => ({ cartCount: state.cartCount + 1 })),

    decrementCartCount: () =>
        set((state) => ({ cartCount: Math.max(0, state.cartCount - 1) })),

    resetCartCount: () => set({ cartCount: 0 }),
}));

// Selector for just the count (optimized re-renders)
export const useCartCount = () => useCartStore((state) => state.cartCount);
