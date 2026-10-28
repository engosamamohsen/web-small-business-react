#!/bin/bash
# Safe deployment script — never wipes .env
set -e

BRANCH="${1:-astro-dev}"
ENV_FILE=".env"
ENV_BACKUP=".env.bak"

echo "==> Deploying branch: $BRANCH"

# 1. Back up .env so git operations can't lose it
if [ -f "$ENV_FILE" ]; then
  cp "$ENV_FILE" "$ENV_BACKUP"
  echo "==> .env backed up to $ENV_BACKUP"
else
  echo "WARNING: No .env file found. Creating one from .env.example ..."
  if [ -f ".env.example" ]; then
    cp ".env.example" "$ENV_FILE"
    echo "IMPORTANT: Edit .env with your real production values before continuing."
    cat "$ENV_FILE"
  else
    echo "ERROR: Neither .env nor .env.example found. Aborting."
    exit 1
  fi
fi

# 2. Discard any local changes to tracked source files so git pull never blocks.
#    dist/ and .astro/ are now in .gitignore so they are safe — git won't touch them.
echo "==> Resetting tracked source files to match origin..."
git fetch origin
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"

# 3. Restore .env (reset --hard would have removed it if it were tracked; it's not, but just in case)
if [ ! -f "$ENV_FILE" ] && [ -f "$ENV_BACKUP" ]; then
  cp "$ENV_BACKUP" "$ENV_FILE"
  echo "==> .env restored from backup"
fi

# 4. Install dependencies and build
echo "==> Installing dependencies..."
npm install

echo "==> Building..."
npm run build

# 5. Restart app
echo "==> Restarting pm2..."
pm2 restart 0

echo ""
echo "==> Deploy complete."
echo "    Shop URL: $(grep PUBLIC_BASE_URL $ENV_FILE | cut -d= -f2)"
