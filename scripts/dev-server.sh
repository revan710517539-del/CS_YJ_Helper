#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
PID_FILE="${SCRIPT_DIR}/.dev-server.pid"
PORT_FILE="${SCRIPT_DIR}/.dev-server.port"
LOG_FILE="${SCRIPT_DIR}/.dev-server.log"
DEFAULT_PORT=3223

is_running() {
  if [[ -f "${PID_FILE}" ]]; then
    local pid
    pid="$(cat "${PID_FILE}")"
    if [[ -n "${pid}" ]] && kill -0 "${pid}" >/dev/null 2>&1; then
      return 0
    fi
  fi
  return 1
}

resolve_port() {
  local port="${DEFAULT_PORT}"
  while lsof -iTCP:"${port}" -sTCP:LISTEN >/dev/null 2>&1; do
    port=$((port + 1))
  done
  echo "${port}"
}

start_server() {
  if is_running; then
    local current_port="unknown"
    [[ -f "${PORT_FILE}" ]] && current_port="$(cat "${PORT_FILE}")"
    echo "开发服务已在运行，端口: ${current_port}"
    return 0
  fi

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

  local port
  port="$(resolve_port)"
  echo "启动开发服务，端口: ${port}"
  nohup "${PROJECT_ROOT}/node_modules/.bin/vite" --host 0.0.0.0 --port "${port}" --strictPort >"${LOG_FILE}" 2>&1 &
  local pid=$!
  echo "${pid}" > "${PID_FILE}"
  echo "${port}" > "${PORT_FILE}"

  sleep 1
  if ! kill -0 "${pid}" >/dev/null 2>&1; then
    echo "启动失败，请查看日志: ${LOG_FILE}"
    rm -f "${PID_FILE}" "${PORT_FILE}"
    exit 1
  fi

  echo "启动成功"
  echo "本机地址: http://localhost:${port}/"
  echo "日志文件: ${LOG_FILE}"
}

stop_server() {
  local stopped=0

  if is_running; then
    local pid
    pid="$(cat "${PID_FILE}")"
    kill "${pid}" >/dev/null 2>&1 || true

    for _ in {1..20}; do
      if ! kill -0 "${pid}" >/dev/null 2>&1; then
        break
      fi
      sleep 0.2
    done

    if kill -0 "${pid}" >/dev/null 2>&1; then
      kill -9 "${pid}" >/dev/null 2>&1 || true
    fi
    stopped=1
  fi

  if [[ -f "${PORT_FILE}" ]]; then
    local port listener_pid
    port="$(cat "${PORT_FILE}")"
    listener_pid="$(lsof -tiTCP:"${port}" -sTCP:LISTEN 2>/dev/null || true)"
    if [[ -n "${listener_pid}" ]]; then
      kill ${listener_pid} >/dev/null 2>&1 || true
      stopped=1
    fi
  fi

  rm -f "${PID_FILE}" "${PORT_FILE}"
  if [[ "${stopped}" -eq 1 ]]; then
    echo "开发服务已停止。"
  else
    echo "开发服务未运行。"
  fi
}

status_server() {
  if is_running; then
    local pid port
    pid="$(cat "${PID_FILE}")"
    port="unknown"
    [[ -f "${PORT_FILE}" ]] && port="$(cat "${PORT_FILE}")"
    echo "运行中: PID=${pid}, PORT=${port}"
    echo "访问地址: http://localhost:${port}/"
  else
    echo "未运行"
  fi
}

cmd="${1:-start}"
case "${cmd}" in
  start) start_server ;;
  stop) stop_server ;;
  restart) stop_server; start_server ;;
  status) status_server ;;
  *)
    echo "用法: $0 {start|stop|restart|status}"
    exit 1
    ;;
esac
