// Resolves the public-facing origin of the current tenant from the incoming
// request — the same way src/middleware.ts resolves the tenant API host.
//
// Behind Nginx the @astrojs/node adapter leaves Astro.url.hostname as
// "localhost", so the real tenant host must come from the proxy headers:
//   1. X-Forwarded-Host   (proxy_set_header X-Forwarded-Host $host)
//   2. Host               (proxy_set_header Host $host)
//   3. Astro.url.host     (last-resort fallback — only correct off-proxy / dev)
//
//   roka.cashierthru.com  →  https://roka.cashierthru.com
//   asly.cashierthru.com  →  https://asly.cashierthru.com
//   localhost:3000 (dev)  →  http://localhost:3000
export function getSiteOrigin(request: Request, url: URL): string {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const host =
        forwardedHost?.split(",")[0].trim() ||
        request.headers.get("host")?.trim() ||
        url.host;

    const forwardedProto = request.headers.get("x-forwarded-proto");
    const protocol =
        forwardedProto?.split(",")[0].trim() ||
        url.protocol.replace(":", "") ||
        "https";

    return `${protocol}://${host}`;
}
