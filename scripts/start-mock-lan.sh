#!/bin/sh

set -eu

LAN_IP="${LAN_IP:-$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || true)}"

if [ -z "$LAN_IP" ]; then
    echo "Could not determine a LAN IP automatically. Run with LAN_IP=<your-mac-ip> npm run start:mock:lan"
    exit 1
fi

USE_MOCK=true \
HOST=0.0.0.0 \
HTTPS=true \
MOBILE_LAN=true \
URL="$LAN_IP" \
FULL_PATH="https://$LAN_IP:2020" \
NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=2048}" \
./node_modules/.bin/webpack-dev-server