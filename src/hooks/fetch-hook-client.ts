"use client";

import Cookies from "js-cookie";

type FetchHookClientOptions = {
    url: string;          // relative API path, e.g. "v1/product?name=..."
    method?: string;
    body?: any;
    token?: string;
    init?: RequestInit;
    baseUrl?: string;     // optional override (for local testing)
};

export async function fetchHookClient<T = any>({
    url,
    method = "GET",
    body,
    token,
    init,
    baseUrl,
}: FetchHookClientOptions): Promise<{
    data: T | any;
    status: number;
    ok: boolean;
    error?: string;
}> {
    const subdomain = "https://emend.cashierthru.com";
    const lastRoute = process.env.NEXT_PUBLIC_LAST_ROUTE_API_URL ?? "";

    console.log(url, "fetch url")

    // if caller passes baseUrl, use it; otherwise build like server hook
    const currentUrl = baseUrl ?? `${subdomain}${lastRoute}`;

    // normalize slashes so you don't end up with "//v1/product"
    const fullUrl = url.startsWith("http")
        ? url
        : `${currentUrl}${url.startsWith("/") ? url : `/${url}`}`;

    console.log("fetchHookClient fullUrl:", fullUrl);

    const authToken = token ?? Cookies.get("app_token") ?? undefined;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    };

    const res = await fetch(fullUrl, {
        method,
        body: body ? JSON.stringify(body) : undefined,
        ...init,
        headers,
    });

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
}
