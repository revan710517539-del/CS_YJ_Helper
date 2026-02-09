#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT=3223

echo "[1/4] dev-server status"
bash "${SCRIPT_DIR}/dev-server.sh" status || true

echo
echo "[2/4] port listener"
lsof -iTCP:${PORT} -sTCP:LISTEN -n -P || true

echo
echo "[3/4] http check"
if curl -fsS --max-time 3 "http://127.0.0.1:${PORT}/" >/dev/null 2>&1; then
  echo "OK: http://localhost:${PORT}/ 可访问"
else
  echo "FAIL: http://localhost:${PORT}/ 不可访问"
fi

echo
echo "[4/4] last logs"
bash "${SCRIPT_DIR}/dev-server.sh" logs || true
