// Kind of store (dashboard → registration / settings: setting-profile `data.shop_type`).
// Same rule as the dashboard's Tenant::usesRestaurantTools(): food and drink stores (keep this
// list equal to Tenant::FOOD_SHOP_TYPES) and stores with no type are food stores; every other
// type (ecommerce, fashion, electronics, home, beauty, grocery, …, service) is an online shop.

export const FOOD_SHOP_TYPES = ["restaurant", "cafe", "bakery"] as const;

export function isFoodStore(shopType: string | null | undefined): boolean {
    return !shopType || (FOOD_SHOP_TYPES as readonly string[]).includes(shopType);
}

/** Product list words for a theme written for food ("المنيو"), on an online shop. */
export function productsWording<T extends string | null, C extends string | null>(
    shopType: string | null | undefined,
    title: T,
    cta: C,
): { title: T; cta: C } {
    if (isFoodStore(shopType)) return { title, cta };
    return {
        title: (title === "المنيو" ? "منتجاتنا" : title) as T,
        cta: (cta === "شوف المنيو" ? "تصفح المنتجات" : cta) as C,
    };
}
