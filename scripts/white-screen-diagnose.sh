#!/usr/bin/env bash
set -euo pipefail

SHARED_SCRIPT="/Users/revan/Documents/Shell_Order/diagnose/white-screen-diagnose.sh"

if [[ ! -x "${SHARED_SCRIPT}" ]]; then
  echo "Shared diagnose script not found: ${SHARED_SCRIPT}"
  exit 1
fi

exec bash "${SHARED_SCRIPT}" "$@"
