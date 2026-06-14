# Fix: each shop must call its OWN admin API (Nginx Host header)

## The problem this fixes

Every shop was calling the **same** admin API. For example, on
`asly.cashierthru.com` the server-side requests went to
`https://admin-roka.cashierthru.com/api/` instead of
`https://admin-asly.cashierthru.com/api/`. Symptoms: wrong data, and product
pages redirecting to `/404`.

## Why it happens (and why it is NOT a code bug)

The app already maps `subdomain → admin-subdomain` correctly:

- **Browser** — `src/lib/config.ts` `getAdminOrigin()` reads
  `window.location.hostname`. Already correct.
- **Server (SSR)** — `src/middleware.ts` builds the API origin from the request
  **`X-Forwarded-Host` header**.

⚠️ **Key gotcha:** the `@astrojs/node` adapter does **not** derive the hostname
from the plain `Host` header — `context.url.hostname` is always `localhost` in
production. So forwarding `Host $host` alone does **nothing**; the middleware
reads **`X-Forwarded-Host`** first (`src/middleware.ts` `extractHostname`). This
was verified on the server: a request with only `Host: asly…` resolved to the
roka fallback, while the same request with `X-Forwarded-Host: asly…` correctly
resolved to `admin-asly`.

When the page is rendered **on the server**, the only way the app learns which
shop the visitor is on is the `X-Forwarded-Host` header that Nginx forwards. If
Nginx doesn't forward it, the app sees `localhost`, can't tell the tenant apart,
and falls back to `PUBLIC_BASE_URL` from `.env` (e.g. `admin-roka`) for **every**
subdomain.

The fix is one line in Nginx: `proxy_set_header X-Forwarded-Host $host;` (plus
`X-Forwarded-Proto $scheme;` so the API origin uses `https`). No code change,
no rebuild.

## Safety

This procedure is low-risk and reversible:

- You **back up** the config before editing.
- `nginx -t` **refuses to apply** a broken config.
- `reload` (not `restart`) keeps serving the old config if anything is wrong.

Keep your SSH session open the whole time. Throughout, replace `FILE` with the
real config path you find in Step 1.

---

## Step 1 — Find the Nginx file that proxies to the app

```bash
sudo grep -rl "proxy_pass" /etc/nginx/sites-enabled/ /etc/nginx/conf.d/ 2>/dev/null
```

- **Expected:** one path, e.g. `/etc/nginx/sites-enabled/cashierthru`.
- **If nothing prints:** run `sudo nginx -T | grep -n "proxy_pass\|server_name"`
  to locate the config wherever it lives.
- **If more than one prints:** only edit the one that proxies to the storefront
  (the block with `proxy_pass http://127.0.0.1:3000;`).

Note the path — this is `FILE`.

## Step 2 — Inspect the current proxy block

```bash
sudo grep -n -A10 "location /" FILE
```

- **Expected:** a block containing `proxy_pass http://127.0.0.1:3000;`.
- Check for an existing `proxy_set_header Host ...;` line:
  - No `Host` line → you will **add** it (Step 4).
  - A line like `proxy_set_header Host $proxy_host;` (wrong) → you will **change
    its value** to `$host`.

## Step 3 — Back up the file

```bash
sudo cp FILE FILE.bak
ls -l FILE.bak
```

You can now revert instantly at any time.

## Step 4 — Edit the file

```bash
sudo nano FILE
```

Inside the `location / { ... }` block that has
`proxy_pass http://127.0.0.1:3000;`, add these three lines **directly under the
`proxy_pass` line**:

```nginx
        proxy_set_header Host              $host;
        proxy_set_header X-Forwarded-Host  $host;
        proxy_set_header X-Forwarded-Proto $scheme;
```

The block should end up like this:

```nginx
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host              $host;
        proxy_set_header X-Forwarded-Host  $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        # ... leave any other existing lines as they were ...
    }
```

> If a `proxy_set_header Host ...;` line already existed with a different value,
> edit **that** line to `$host` rather than adding a duplicate.

Save in nano: **Ctrl+O**, **Enter**, **Ctrl+X**.

## Step 5 — Test the config (safety gate)

```bash
sudo nginx -t
```

- **Expected:** `syntax is ok` and `test is successful`.
- **On error:** do NOT reload. Restore the backup, then investigate:
  ```bash
  sudo cp FILE.bak FILE
  ```

## Step 6 — Apply it (graceful, no downtime)

```bash
sudo systemctl reload nginx
```

No output means success.

## Step 7 — Verify

```bash
pm2 logs --lines 20
```

- Open `asly.cashierthru.com` → logs resolve **`admin-asly`**; the
  `[middleware] No tenant Host header (saw "127.0.0.1")` warning is **gone**.
- Open `roka.cashierthru.com` → resolves **`admin-roka`**.
- Product pages on asly load instead of redirecting to `/404`.

Optional direct check from the server:

```bash
curl -sI -H "Host: asly.cashierthru.com" http://127.0.0.1:3000/ | head -5
```

---

## Rollback — if anything breaks

```bash
sudo cp FILE.bak FILE
sudo nginx -t && sudo systemctl reload nginx
```

This restores the exact previous config.

---

## Notes

- A full reference config is committed at `deploy/nginx/cashierthru.conf`; this
  document is the **surgical** version that edits your existing file instead of
  replacing it.
- For brand-new tenants to work automatically you also need wildcard DNS
  (`*.cashierthru.com`) and a wildcard TLS cert — see `deploy/README.md`.
- Once the `Host` header is forwarded, `PUBLIC_BASE_URL` in `.env` only matters
  as a fallback when the header is missing; it no longer affects other tenants.
