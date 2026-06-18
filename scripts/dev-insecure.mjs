// ⚠️ TEMPORARY local-dev launcher — DO NOT use in production, DO NOT deploy.
//
// Why this exists: the dev server's SSR fetches hit the tenant admin API at
// PUBLIC_DEV_API_ORIGIN (e.g. https://admin-asly.cashierthru.com). While that
// host's wildcard TLS cert (*.cashierthru.com) is expired, Node rejects every
// HTTPS request with CERT_HAS_EXPIRED, so products/categories/etc. come back
// empty and the storefront looks broken locally.
//
// This launcher sets NODE_TLS_REJECT_UNAUTHORIZED=0 for the dev process ONLY,
// so Node skips cert verification and local dev works again. It is a stopgap.
// The real fix is renewing the cert on the server (certbot + `nginx reload`).
// Delete this file and the "dev:insecure" script once the cert is renewed.
//
// Note: this only fixes SSR (Node). Client-side fetches (category/page filters)
// run in the browser, which enforces the cert independently and will still fail
// until the cert is renewed.

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

console.warn(
    "\n⚠️  dev:insecure — TLS certificate verification is DISABLED for this dev " +
        "server. Temporary cert-outage workaround only; never use in production.\n",
);

// Run Astro's bin directly with the current Node so there is no shell quoting
// or PATH ambiguity across Windows/macOS/Linux.
const astroBin = fileURLToPath(
    new URL("../node_modules/astro/astro.js", import.meta.url),
);

const child = spawn(
    process.execPath,
    [astroBin, "dev", "--port", "3000"],
    {
        stdio: "inherit",
        env: { ...process.env, NODE_TLS_REJECT_UNAUTHORIZED: "0" },
    },
);

child.on("exit", (code) => process.exit(code ?? 0));
