#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="${BACKEND_DIR:-$ROOT_DIR/backend}"
FRONTEND_DIR="${FRONTEND_DIR:-$ROOT_DIR/frontend}"

if [[ ! -d "$BACKEND_DIR" ]]; then
  echo "Erreur: dossier backend introuvable: $BACKEND_DIR"
  exit 1
fi

if [[ ! -d "$FRONTEND_DIR" ]]; then
  echo "Erreur: dossier frontend introuvable: $FRONTEND_DIR"
  exit 1
fi

install_deps_if_needed() {
  local dir="$1"
  local name="$2"

  if [[ -d "$dir/node_modules" ]]; then
    return
  fi

  echo "Installation des dependances pour $name..."
  if [[ -f "$dir/package-lock.json" ]]; then
    (cd "$dir" && npm ci)
  else
    (cd "$dir" && npm install)
  fi
}

install_deps_if_needed "$BACKEND_DIR" "backend"
install_deps_if_needed "$FRONTEND_DIR" "frontend"

echo "Lancement du backend..."
(cd "$BACKEND_DIR" && npm run dev) &
BACK_PID=$!

cleanup() {
  if kill -0 "$BACK_PID" >/dev/null 2>&1; then
    kill "$BACK_PID" >/dev/null 2>&1 || true
  fi
}

trap cleanup EXIT INT TERM

echo "Lancement du frontend..."
cd "$FRONTEND_DIR"
npm run dev
