import type { APIRoute } from "astro";
import { fetchSettings } from "@/hooks/fetchSettings";
import { fetchMenu } from "@/lib/menu";

// Menu for the meal helper popup (MealHelperFab), loaded only when a customer
// opens it. Tenant-aware through Astro.locals.apiBase like every SSR page.
export const prerender = false;

export const GET: APIRoute = async ({ locals, cookies }) => {
    try {
        const [dishes, settings] = await Promise.all([
            fetchMenu(locals.apiBase),
            fetchSettings(cookies.get("app_token")?.value, false, locals.apiBase).catch(() => null),
        ]);
        return new Response(
            JSON.stringify({ dishes, defaultImage: settings?.data?.product_default_image ?? null }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    // Per store (per host), so only the browser may cache it.
                    "Cache-Control": "private, max-age=300",
                },
            },
        );
    } catch (error) {
        console.error("[helper-menu] could not load the menu", error);
        return new Response(JSON.stringify({ error: "menu unavailable" }), {
            status: 502,
            headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        });
    }
};
