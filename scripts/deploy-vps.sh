#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

mkdir -p certs

if [ ! -f .env.production ]; then
  cp .env.production.example .env.production
  echo "Created .env.production from the example template. Edit it before deploying." >&2
  exit 1
fi

docker compose build --pull app
docker compose up -d --force-recreate

echo "Deployment complete. Check status with: docker compose ps"
