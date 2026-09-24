import { fetchHook } from "@/hooks/fetch-hook";
import { toMenuDish, type ApiProduct, type MenuDish } from "@/lib/meal-helper/engine";

// ─── Whole menu of one store, for the meal helper ────────────────────────────
//
// v1/product is paginated (10 per page; `limit` is ignored), so this reads
// page 1, then the remaining pages in parallel. Cached per tenant (keyed by
// apiBase, like the settings cache) so stores never share a menu.

const CACHE_MS = 1000 * 60 * 5;
const MAX_PAGES = 50; // 500 dishes is far beyond any real menu

const cache = new Map<string, { dishes: MenuDish[]; at: number }>();

async function page(apiBase: string, n: number) {
  const res = await fetchHook({ url: `v1/product?page=${n}`, init: {}, baseUrl: apiBase });
  if (!res.ok) throw new Error(`v1/product page ${n}: ${res.status}`);
  return {
    items: (Array.isArray(res.data?.data) ? res.data.data : []) as ApiProduct[],
    lastPage: Number(res.data?.pagination?.last_page) || 1,
  };
}

/** Every dish on the store's menu, slimmed to what the helper needs. */
export async function fetchMenu(apiBase: string): Promise<MenuDish[]> {
  const hit = cache.get(apiBase);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.dishes;

  const first = await page(apiBase, 1);
  const rest = await Promise.all(
    Array.from({ length: Math.min(first.lastPage, MAX_PAGES) - 1 }, (_, i) => page(apiBase, i + 2)),
  );

  const seen = new Set<number>();
  const dishes = [first, ...rest]
    .flatMap((p) => p.items)
    .filter((p) => p?.id != null && !seen.has(p.id) && seen.add(p.id))
    .map(toMenuDish);

  cache.set(apiBase, { dishes, at: Date.now() });
  return dishes;
}
