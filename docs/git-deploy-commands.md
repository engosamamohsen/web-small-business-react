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
pm2 restart 0               # restart the running app
```

> **Never run `git reset --hard` or `git clean -fd` on the server.**
> These commands delete your `.env` file and break the site.

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

# 5. Start with pm2
pm2 start npm --name "shop" -- run preview -- --port 3000
pm2 save
```

### `.env` values to fill in

```env
PUBLIC_BASE_URL=https://YOURSHOP.cashierthru.com
PUBLIC_DEV_API_ORIGIN=https://admin-YOURSHOP.cashierthru.com
PUBLIC_LAST_ROUTE_API_URL=/api/
```

Replace `YOURSHOP` with the shop subdomain (e.g. `asly`, `burger`, `fashion`).

---

## Recovery — If the Site Broke After a Reset

If someone ran `git reset --hard` + `git clean -fd` and the site stopped working:

```bash
# 1. Recreate the .env file
cat > .env << 'EOF'
PUBLIC_BASE_URL=https://YOURSHOP.cashierthru.com
PUBLIC_DEV_API_ORIGIN=https://admin-YOURSHOP.cashierthru.com
PUBLIC_LAST_ROUTE_API_URL=/api/
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
