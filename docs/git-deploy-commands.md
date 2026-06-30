# Git & Server Deploy Commands

## On Your Local Machine (Windows)

### Normal daily push

```bash
# 1. Stage the files you changed
git add src/path/to/file.ts

# 2. Commit with a message
git commit -m "describe what you changed"

# 3. Push to GitHub
git push origin astro-dev
```

### Stage everything at once (use carefully)

```bash
git add -A
git commit -m "describe what you changed"
git push origin astro-dev
```

### Check what changed before staging

```bash
git status          # show modified / untracked files
git diff            # show exact line changes
```

> ⚠️ **Push and pull the SAME branch.** Whatever branch you `git push origin <branch>`
> from your machine, the server must `git pull origin <branch>` the same one, or it
> gets nothing. (Examples here say `astro-dev` — replace with your live branch,
> e.g. `astro-dev-order`.)

---

## On the Server (SSH)

### Safe update — use this every time

```bash
cd /path/to/web-small-business-react
./deploy.sh
```

The `deploy.sh` script:
- Backs up `.env` before touching anything
- Pulls latest code from `astro-dev`
- Restores `.env` if it was lost
- Runs `npm install` and `npm run build`
- Restarts pm2

---

### Manual update (if you don't use deploy.sh)

```bash
cd /path/to/web-small-business-react

git pull origin astro-dev   # pull latest code
npm install                 # only needed if package.json changed
npm run build               # rebuild the site
pm2 reload ecosystem.config.cjs   # reload the running app
```

> **Never run `git reset --hard` or `git clean -fd` on the server.**
> These commands delete your `.env` file and break the site.

---

## Environment variables are NOT in git — set them on the server

`.env` is gitignored, so **`PUBLIC_*` values never deploy via push/pull.**
`deploy.sh` backs up and restores the server's existing `.env`, so a deploy keeps
whatever is already on the server. And because Astro **inlines `PUBLIC_*` at build
time**, the value must be in the server's `.env` **before** `npm run build` runs.

➡️ To add or change one (e.g. Google Analytics), SSH in **once**, append it to
`.env`, then deploy:

```bash
cd /path/to/web-small-business-react
echo "PUBLIC_GA_ID=G-C5EM0V4EH6" >> .env   # one-time; future deploys keep it
./deploy.sh                                # pulls + npm install + npm run build (bakes it in) + pm2 restart
```

Optional `PUBLIC_*` vars (omit/empty to disable the feature):

| Variable | Purpose |
| --- | --- |
| `PUBLIC_GA_ID` | Google Analytics 4 Measurement ID (`G-…`). One shared property for all stores; segment by Hostname. |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console **HTML-tag** token ONLY. The **DNS / Domain** method (recommended) needs nothing here. |

Full value reference: [web-instructions.md](web-instructions.md).

### Verify after deploying

```bash
# GA tag is live (replace the host with a real store):
curl -s https://asly.cashierthru.com/ | grep -o "gtag/js?id=G-[A-Z0-9]*"
# Sitemap + robots are live:
curl -sI https://asly.cashierthru.com/sitemap.xml | head -1
curl -s  https://asly.cashierthru.com/robots.txt
```
Then check **GA → Reports → Realtime** for your own visit.

> **Google Search Console is NOT a deploy step.** Domain verification is a
> **Cloudflare DNS TXT record** (`google-site-verification=…`) + clicking *Verify* —
> push/pull does nothing for it. Deploying only makes `/sitemap.xml` reachable so
> you can submit it in GSC afterward.

---

## First-Time Server Setup

Run these once when setting up a new server:

```bash
# 1. Clone the repo
git clone git@github.com:engosamamohsen/web-small-business-react.git
cd web-small-business-react

# 2. Switch to the correct branch
git checkout astro-dev

# 3. Create the .env file (edit with your real shop subdomain)
cp .env.example .env
nano .env

# 4. Install dependencies and build
npm install
npm run build

# 5. Start the SSR server with pm2
pm2 start ecosystem.config.cjs
pm2 save
```

### `.env` values to fill in

```env
PUBLIC_BASE_URL=https://admin-YOURSHOP.cashierthru.com
PUBLIC_DEV_API_ORIGIN=https://admin-YOURSHOP.cashierthru.com
PUBLIC_LAST_ROUTE_API_URL=/api/

# Optional — leave empty to disable:
PUBLIC_GA_ID=G-C5EM0V4EH6           # Google Analytics 4 (shared across all stores)
PUBLIC_GOOGLE_SITE_VERIFICATION=    # only for the Search Console HTML-tag method
```

Replace `YOURSHOP` with the shop subdomain (e.g. `asly`, `burger`, `fashion`).

---

## Recovery — If the Site Broke After a Reset

If someone ran `git reset --hard` + `git clean -fd` and the site stopped working:

```bash
# 1. Recreate the .env file
cat > .env << 'EOF'
PUBLIC_BASE_URL=https://admin-YOURSHOP.cashierthru.com
PUBLIC_DEV_API_ORIGIN=https://admin-YOURSHOP.cashierthru.com
PUBLIC_LAST_ROUTE_API_URL=/api/
PUBLIC_GA_ID=G-C5EM0V4EH6
EOF

# 2. Rebuild and restart
npm run build
pm2 restart 0
```

---

## Useful pm2 Commands

```bash
pm2 list              # show running apps and their status
pm2 logs 0            # stream logs for app #0
pm2 logs 0 --lines 50 # show last 50 log lines
pm2 restart 0         # restart app #0
pm2 stop 0            # stop app #0
pm2 delete 0          # remove app from pm2
```

---

## Useful Git Commands

```bash
git log --oneline -10       # last 10 commits
git diff HEAD~1             # what changed in the last commit
git stash                   # temporarily save local changes
git stash pop               # restore stashed changes
git branch                  # list local branches
git checkout astro-dev      # switch to astro-dev branch
```
