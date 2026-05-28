#!/usr/bin/env bash
# standardize-library.sh — shell wrapper
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec npx tsx "$SCRIPT_DIR/standardize-library.ts" "$@"
