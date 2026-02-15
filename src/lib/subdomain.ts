
export default async function getSubdomain() {
    // Return the base URL from env var or window location
    if (typeof window !== "undefined") {
        // Client side: use env var or current origin fallback
        return import.meta.env.PUBLIC_BASE_URL || window.location.origin;
    }

    // Server side: use env var
    return import.meta.env.PUBLIC_BASE_URL || "";
}
