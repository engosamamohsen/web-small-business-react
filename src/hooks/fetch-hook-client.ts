"use client";

import Cookies from "js-cookie";

type FetchHookClientOptions = {
    url: string;          // relative API path, e.g. "v1/product?name=..."
    method?: string;
    body?: any;
    token?: string;
    init?: RequestInit;
    baseUrl?: string;     // optional override (for local testing)
    timeout?: number;     // timeout in milliseconds (default: 15000ms)
};

export async function fetchHookClient<T = any>({
    url,
    method = "GET",
    body,
    token,
    init,
    baseUrl,
    timeout = 15000, // Default 15 second timeout
}: FetchHookClientOptions): Promise<{
    data: T | any;
    status: number;
    ok: boolean;
    error?: string;
}> {
    const subdomain = "https://emend.cashierthru.com";
    const lastRoute = import.meta.env.PUBLIC_LAST_ROUTE_API_URL ?? "";

    // if caller passes baseUrl, use it; otherwise build like server hook
    const currentUrl = baseUrl ?? `${subdomain}${lastRoute}`;

    // normalize slashes so you don't end up with "//v1/product"
    const fullUrl = url.startsWith("http")
        ? url
        : `${currentUrl}${url.startsWith("/") ? url : `/${url}`}`;

    const authToken = token ?? Cookies.get("app_token") ?? undefined;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    };

    // Create AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const res = await fetch(fullUrl, {
            method,
            body: body ? JSON.stringify(body) : undefined,
            ...init,
            headers,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const { status, ok } = res;

        // 🔹 Safely parse response (JSON or text) – avoids "Unexpected token '<'"
        const contentType = res.headers.get("content-type") ?? "";
        let bodyData: unknown = null;

        if (status !== 204) {
            if (contentType.includes("application/json")) {
                try {
                    bodyData = await res.json();
                } catch {
                    bodyData = null;
                }
            } else {
                try {
                    bodyData = await res.text();
                } catch {
                    bodyData = null;
                }
            }
        }

        if (!ok) {
            const message =
                (typeof bodyData === "object" &&
                    bodyData &&
                    "message" in bodyData &&
                    (bodyData as any).message) ||
                (typeof bodyData === "object" &&
                    bodyData &&
                    "error" in bodyData &&
                    (bodyData as any).error) ||
                (typeof bodyData === "string" && bodyData) ||
                res.statusText ||
                "Request failed";

            return { data: null, status, ok, error: String(message) };
        }

        return { data: (bodyData as T) ?? null, status, ok };
    } catch (error) {
        clearTimeout(timeoutId);

        // Handle abort/timeout errors
        if (error instanceof Error && error.name === "AbortError") {
            return {
                data: null,
                status: 408,
                ok: false,
                error: "Request timeout",
            };
        }

        // Handle other fetch errors
        return {
            data: null,
            status: 0,
            ok: false,
            error: error instanceof Error ? error.message : "Network error",
        };
    }
}
