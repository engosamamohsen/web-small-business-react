"use client";

import { createContext, useContext, ReactNode, useState, useCallback } from "react";

// ===== Types =====
export interface SettingsData {
    id?: number;
    name?: string;
    about_us?: string;
    phone?: string;
    whatsapp_phone?: string;
    logo?: string;
    main_color?: string;
    main_bg?: string;
    main_font_color?: string;
    facebook_link?: string;
    instagram_link?: string;
    tax?: number;
    service?: number;
    vat?: string;
    keywords?: string[];
    product_default_image?: string;
    website_url?: string;
}

export interface SettingsContextType {
    settings: SettingsData | null;
    isLogin: boolean;
    cartCount: number;
    token?: string;
    setCartCount: (count: number) => void;
    incrementCartCount: () => void;
    decrementCartCount: () => void;
    setIsLogin: (value: boolean) => void;
}

// ===== Context =====
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// ===== Provider =====
export function SettingsProvider({
    children,
    initialSettings,
    isLogin: initialIsLogin = false,
    cartCount: initialCartCount = 0,
    token,
}: {
    children: ReactNode;
    initialSettings: SettingsData | null;
    isLogin?: boolean;
    cartCount?: number;
    token?: string;
}) {
    const [cartCount, setCartCountState] = useState(initialCartCount);
    const [isLogin, setIsLogin] = useState(initialIsLogin);

    const setCartCount = useCallback((count: number) => {
        setCartCountState(count);
    }, []);

    const incrementCartCount = useCallback(() => {
        setCartCountState((prev) => prev + 1);
    }, []);

    const decrementCartCount = useCallback(() => {
        setCartCountState((prev) => Math.max(0, prev - 1));
    }, []);

    return (
        <SettingsContext.Provider
            value={{
                settings: initialSettings,
                isLogin,
                cartCount,
                token,
                setCartCount,
                incrementCartCount,
                decrementCartCount,
                setIsLogin,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

// ===== Hooks =====

/**
 * Get all settings context
 */
export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}

/**
 * Get just settings data
 */
export function useSettingsData() {
    const { settings } = useSettings();
    return settings;
}

/**
 * Get auth state and token
 */
export function useAuth() {
    const { isLogin, token, setIsLogin } = useSettings();
    return { isLogin, token, setIsLogin };
}

/**
 * Get cart count and actions
 */
export function useCart() {
    const { cartCount, setCartCount, incrementCartCount, decrementCartCount } = useSettings();
    return { cartCount, setCartCount, incrementCartCount, decrementCartCount };
}