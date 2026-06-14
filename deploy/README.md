# Deployment — Dynamic Multi-Tenant Setup

One build serves every tenant. A visitor on `https://<shop>.cashierthru.com`
automatically talks to `https://admin-<shop>.cashierthru.com/api/`. The mapping
is already in the app code:

- **Browser:** `src/lib/config.ts` → `getAdminOrigin()` reads `window.location`.
- **Server (SSR):** `src/middleware.ts` reads the forwarded `Host` header.

For this to work in production, three infrastructure pieces must be in place.

---

## 1. Wildcard DNS

Point every subdomain at the server with one record:

```
*.cashierthru.com   A   <your-server-IP>
```

## 2. Wildcard TLS certificate

A wildcard cert covers every `*.cashierthru.com` so any new shop loads over HTTPS
without re-issuing certs:

```bash
sudo certbot certonly --manual --preferred-challenges dns \
  -d cashierthru.com -d "*.cashierthru.com"
```

Add the TXT record certbot prints, then finish. The cert lands at
`/etc/letsencrypt/live/cashierthru.com/`.

## 3. Nginx — forward the real Host header

Copy `deploy/nginx/cashierthru.conf` into Nginx and reload. The key is the
single regex `server_name` (matches every subdomain) plus
`proxy_set_header Host $host;` (tells the app which tenant it is):

```bash
sudo cp deploy/nginx/cashierthru.conf /etc/nginx/sites-available/cashierthru
sudo ln -sf /etc/nginx/sites-available/cashierthru /etc/nginx/sites-enabled/cashierthru
sudo nginx -t            # must say: test is successful
sudo systemctl reload nginx
```

> Without `proxy_set_header Host $host;` the app sees `127.0.0.1`, can't tell the
> tenant apart, and **every** subdomain falls back to `PUBLIC_BASE_URL` in `.env`
> — the bug where `asly` ended up calling `roka`'s API.

---

## Run the SSR server with pm2

Build, then run the standalone Node server (not `astro preview`) via the
committed `ecosystem.config.cjs`, which binds `127.0.0.1:3000` to match Nginx:

```bash
npm install
npm run build
pm2 start ecosystem.config.cjs     # first time
pm2 save
```

After future code pulls:

```bash
git pull origin astro-dev
npm install                        # only if package.json changed
npm run build
pm2 reload ecosystem.config.cjs
```

If you previously ran pm2 with `astro preview` (e.g. process id `0`), switch once:

```bash
pm2 delete 0                       # remove the old preview process
pm2 start ecosystem.config.cjs
pm2 save
```

---

## `.env` (per server, NOT committed)

With the Host header forwarded, `PUBLIC_BASE_URL` is only a **fallback** for the
rare case the header is missing. It must still be a valid **admin** origin:

```env
PUBLIC_BASE_URL=https://admin-asly.cashierthru.com
PUBLIC_DEV_API_ORIGIN=https://admin-asly.cashierthru.com
PUBLIC_LAST_ROUTE_API_URL=/api/
```

`.env` is gitignored, so `git pull` never touches it. **Never run
`git clean -fd` on the server** — it deletes `.env`.

---

## Verify

```bash
pm2 logs shop --lines 20
```

- Load `asly.cashierthru.com` → logs show it using `admin-asly`.
- Load `roka.cashierthru.com` → logs show `admin-roka`.
- No `[middleware] No tenant Host header …` warning means the Host header is
  being forwarded correctly.
