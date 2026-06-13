#!/bin/bash
# Run once on a new server to create .env and do the first build.
# Usage: ./setup.sh roka
#   or:  ./setup.sh        (will prompt for shop subdomain)

set -e

SHOP="${1}"

if [ -z "$SHOP" ]; then
  echo "Enter the shop subdomain (e.g. roka, asly, burger):"
  read -r SHOP
fi

if [ -z "$SHOP" ]; then
  echo "ERROR: shop subdomain is required."
  exit 1
fi

ENV_FILE=".env"

cat > "$ENV_FILE" << EOF
PUBLIC_BASE_URL=https://${SHOP}.cashierthru.com
PUBLIC_DEV_API_ORIGIN=https://admin-asly.cashierthru.com
PUBLIC_LAST_ROUTE_API_URL=/api/
EOF

echo "==> .env created:"
cat "$ENV_FILE"

echo ""
echo "==> Building..."
npm install
npm run build

echo "==> Restarting pm2..."
pm2 restart 0

echo ""
echo "==> Setup complete. Site: https://${SHOP}.cashierthru.com"
