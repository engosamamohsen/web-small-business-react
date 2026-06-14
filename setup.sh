#!/bin/bash
# Run once on a new server to create .env and do the first build.
#
# The argument is the ADMIN tenant used for SERVER-SIDE rendering only.
# (The browser always derives admin-<tenant> from the visited URL, so all
#  tenants work client-side regardless of this value.)
#
# Usage: ./setup.sh asly            → PUBLIC_BASE_URL=https://admin-asly.cashierthru.com
#   or:  ./setup.sh                 (defaults to asly)

set -e

SHOP="${1:-asly}"
ADMIN_ORIGIN="https://admin-${SHOP}.cashierthru.com"

ENV_FILE=".env"

cat > "$ENV_FILE" << EOF
PUBLIC_BASE_URL=${ADMIN_ORIGIN}
PUBLIC_DEV_API_ORIGIN=${ADMIN_ORIGIN}
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
echo "==> Setup complete. SSR API origin: ${ADMIN_ORIGIN}"
