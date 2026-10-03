#!/usr/bin/env bash
# Rebuild NISER Mobile for physical Android device testing.
# Usage:
#   ./scripts/rebuild-physical.sh [staging|prod|local]
#   ./scripts/rebuild-physical.sh local 192.168.1.50:3000  # your dev machine IP
#
# Produces:
#   build/app/outputs/flutter-apk/app-debug.apk          (debug, fast, 180MB)
#   build/app/outputs/flutter-apk/app-release.apk        (release, obfuscated, ~45MB)
#   build/app/outputs/bundle/release/app-release.aab     (Play bundle)
#
set -euo pipefail
cd "$(dirname "$0")/.."

FLUTTER=${FLUTTER:-/home/adebayo/flutter/bin/flutter}
ENVIRON=${1:-staging}
LOCAL_IP=${2:-}

case "$ENVIRON" in
  staging)
    API_URL="https://staging.niser.gov.ng"
    APP_ENV="staging"
    ;;
  prod)
    API_URL="https://www.niser.gov.ng"
    APP_ENV="prod"
    ;;
  local)
    if [[ -z "$LOCAL_IP" ]]; then
      # Auto-detect LAN IP (Linux)
      LOCAL_IP=$(hostname -I | awk '{print $1}'):3000
      echo "No IP supplied — using detected $LOCAL_IP"
      echo "If wrong, run: $0 local 192.168.x.x:3000"
    fi
    API_URL="http://${LOCAL_IP}"
    APP_ENV="dev"
    ;;
  *)
    echo "Unknown env $ENVIRON (use staging|prod|local)"
    exit 1
    ;;
esac

echo "== NISER Mobile — physical rebuild =="
echo "Env: $ENVIRON  API: $API_URL  APP_ENV: $APP_ENV"
echo ""

echo "1/4  flutter clean + pub get"
$FLUTTER clean
$FLUTTER pub get

echo ""
echo "2/4  flutter analyze"
$FLUTTER analyze

echo ""
echo "3/4  build APK (debug — for quick sideload)"
$FLUTTER build apk --debug \
  --dart-define=API_BASE_URL="$API_URL" \
  --dart-define=APP_ENV="$APP_ENV"

echo ""
echo "4/4  build APK + AAB (release — obfuscated, split-debug-info)"
$FLUTTER build apk --release \
  --obfuscate --split-debug-info=build/symbols \
  --dart-define=API_BASE_URL="$API_URL" \
  --dart-define=APP_ENV="$APP_ENV"

$FLUTTER build appbundle --release \
  --obfuscate --split-debug-info=build/symbols \
  --dart-define=API_BASE_URL="$API_URL" \
  --dart-define=APP_ENV="$APP_ENV"

echo ""
echo "== Artifacts =="
ls -lh build/app/outputs/flutter-apk/app-debug.apk build/app/outputs/flutter-apk/app-release.apk build/app/outputs/bundle/release/app-release.aab 2>&1
echo ""
echo "SHA1 (debug): $(sha1sum build/app/outputs/flutter-apk/app-debug.apk | awk '{print $1}')"
echo "SHA1 (release): $(sha1sum build/app/outputs/flutter-apk/app-release.apk | awk '{print $1}')"
echo ""
echo "Install on connected device:"
echo "  adb install -r build/app/outputs/flutter-apk/app-debug.apk"
echo "  # or: $FLUTTER install --dart-define=API_BASE_URL=$API_URL --dart-define=APP_ENV=$APP_ENV"
echo ""
echo "Serve over HTTP for QR sideload (phone + laptop same Wi-Fi):"
echo "  cd build/app/outputs/flutter-apk && python3 -m http.server 8000"
echo "  # then open http://<your-laptop-ip>:8000/app-debug.apk on phone"
