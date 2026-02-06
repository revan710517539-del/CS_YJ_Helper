#!/usr/bin/env bash
set -euo pipefail

PORT=3223
HOST=localhost

cd /Users/revan/Documents/CS_YJ_Helper

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js 未安装，请先安装 Node.js（建议 LTS）。"
  exit 1
fi

if [ ! -f package-lock.json ] || [ ! -d node_modules ]; then
  echo "安装依赖中..."
  npm install
fi

if [ ! -f .env.local ]; then
  echo "GEMINI_API_KEY=PLACEHOLDER_API_KEY" > .env.local
fi

if lsof -iTCP:${PORT} -sTCP:LISTEN >/dev/null 2>&1; then
  echo "端口 ${PORT} 已被占用，尝试使用 3233..."
  PORT=3233
fi

echo "启动 Vite，访问 http://${HOST}:${PORT}/"
exec npm run dev -- --host ${HOST} --port ${PORT}
