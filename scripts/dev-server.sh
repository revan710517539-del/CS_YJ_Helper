#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
PID_FILE="${SCRIPT_DIR}/.dev-server.pid"
PORT_FILE="${SCRIPT_DIR}/.dev-server.port"
LOG_FILE="${SCRIPT_DIR}/.dev-server.log"
PORT=3223

cleanup_state() {
  rm -f "${PID_FILE}" "${PORT_FILE}"
}

listener_pids() {
  lsof -tiTCP:"${PORT}" -sTCP:LISTEN 2>/dev/null || true
}

is_port_listening() {
  [[ -n "$(listener_pids)" ]]
}

health_check() {
  curl -fsS --max-time 2 "http://127.0.0.1:${PORT}/" >/dev/null 2>&1
}

is_running() {
  if [[ -f "${PID_FILE}" ]]; then
    local pid
    pid="$(cat "${PID_FILE}")"
    if [[ -n "${pid}" ]] && kill -0 "${pid}" >/dev/null 2>&1 && is_port_listening; then
      return 0
    fi
  fi
  return 1
}

kill_port_listeners() {
  local pids
  pids="$(listener_pids)"
  if [[ -n "${pids}" ]]; then
    kill ${pids} >/dev/null 2>&1 || true
    sleep 0.5
    pids="$(listener_pids)"
    if [[ -n "${pids}" ]]; then
      kill -9 ${pids} >/dev/null 2>&1 || true
    fi
  fi
}

start_server() {
  if ! command -v node >/dev/null 2>&1; then
    echo "未检测到 Node.js，请先安装后再启动。"
    exit 1
  fi

  cd "${PROJECT_ROOT}"

  if [[ ! -d node_modules ]]; then
    echo "安装依赖中..."
    npm install
  fi

  if [[ ! -x "${PROJECT_ROOT}/node_modules/.bin/vite" ]]; then
    echo "未找到 Vite 可执行文件，请先执行 npm install。"
    exit 1
  fi

  # 清理陈旧状态，确保固定端口 3223 可用。
  stop_server >/dev/null 2>&1 || true
  kill_port_listeners

  echo "启动开发服务，固定端口: ${PORT}"
  local pid
  pid="$(node -e '
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const projectRoot = process.argv[1];
const logFile = process.argv[2];
const port = process.argv[3];
const viteBin = path.join(projectRoot, "node_modules", ".bin", "vite");
const out = fs.openSync(logFile, "a");
const child = spawn(viteBin, ["--host", "0.0.0.0", "--port", String(port), "--strictPort"], {
  cwd: projectRoot,
  detached: true,
  stdio: ["ignore", out, out],
});
child.unref();
process.stdout.write(String(child.pid));
' "${PROJECT_ROOT}" "${LOG_FILE}" "${PORT}")"
  echo "${pid}" > "${PID_FILE}"
  echo "${PORT}" > "${PORT_FILE}"

  local ok=0
  for _ in {1..30}; do
    if kill -0 "${pid}" >/dev/null 2>&1 && is_port_listening && health_check; then
      ok=1
      break
    fi
    sleep 0.25
  done

  if [[ "${ok}" -ne 1 ]]; then
    echo "启动失败，请查看日志: ${LOG_FILE}"
    stop_server >/dev/null 2>&1 || true
    cleanup_state
    exit 1
  fi

  echo "启动成功"
  echo "访问地址: http://localhost:${PORT}/"
  echo "日志文件: ${LOG_FILE}"
}

stop_server() {
  local stopped=0

  if [[ -f "${PID_FILE}" ]]; then
    local pid
    pid="$(cat "${PID_FILE}")"
    if [[ -n "${pid}" ]] && kill -0 "${pid}" >/dev/null 2>&1; then
      kill "${pid}" >/dev/null 2>&1 || true
      sleep 0.5
      if kill -0 "${pid}" >/dev/null 2>&1; then
        kill -9 "${pid}" >/dev/null 2>&1 || true
      fi
      stopped=1
    fi
  fi

  if is_port_listening; then
    kill_port_listeners
    stopped=1
  fi

  cleanup_state

  if [[ "${stopped}" -eq 1 ]]; then
    echo "开发服务已停止。"
  else
    echo "开发服务未运行。"
  fi
}

status_server() {
  if is_running; then
    local pid
    pid="$(cat "${PID_FILE}")"
    echo "运行中: PID=${pid}, PORT=${PORT}"
    echo "访问地址: http://localhost:${PORT}/"
    if health_check; then
      echo "健康检查: 通过"
    else
      echo "健康检查: 失败（端口在监听，但首页不可访问）"
    fi
    return 0
  fi

  if is_port_listening; then
    echo "运行中: PID=$(listener_pids), PORT=${PORT}（非脚本托管进程）"
    echo "访问地址: http://localhost:${PORT}/"
    if health_check; then
      echo "健康检查: 通过"
    else
      echo "健康检查: 失败（端口在监听，但首页不可访问）"
    fi
    return 0
  fi

  echo "未运行"
}

cmd="${1:-start}"
case "${cmd}" in
  start) start_server ;;
  stop) stop_server ;;
  restart) stop_server; start_server ;;
  status) status_server ;;
  logs) tail -n 100 "${LOG_FILE}" ;;
  *)
    echo "用法: $0 {start|stop|restart|status|logs}"
    exit 1
    ;;
esac
