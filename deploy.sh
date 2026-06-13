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
    echo "IMPORTANT: Edit .env with your real production values before using this server."
    cat "$ENV_FILE"
  else
    echo "ERROR: Neither .env nor .env.example found. Aborting."
    exit 1
  fi
fi

# 2. Pull latest code (safe — no --hard reset, no clean)
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"

# 3. Restore .env if git somehow lost it (shouldn't happen, but safety net)
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
