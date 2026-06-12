import 'react';

const SSR_FALLBACK = "http://localhost:3000";
function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return SSR_FALLBACK;
}
function getAdminOrigin() {
  if (typeof window === "undefined") {
    return SSR_FALLBACK;
  }
  const { protocol, hostname } = window.location;
  try {
    const parts = hostname.split(".");
    if (parts[0].startsWith("admin-")) {
      return `${protocol}//${hostname}`;
    }
    if (parts.length >= 3) {
      parts[0] = `admin-${parts[0]}`;
      return `${protocol}//${parts.join(".")}`;
    }
  } catch {
  }
  return window.location.origin;
}
function getApiUrl() {
  return `${getAdminOrigin()}/api/`;
}

export { getApiUrl as a, getBaseUrl as g };
