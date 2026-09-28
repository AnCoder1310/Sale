#!/usr/bin/env bash
# ==============================================================================
# VINFAST AI SALES ENABLEMENT COACH (VFO2O-20) - FRONTEND LAUNCHER
# Khởi chạy Next.js 16 Web Application
# ==============================================================================

set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR/frontend"

# Lấy cổng backend đang chạy (mặc định 8000, nếu bận thì 8001)
BACKEND_PORT=8000
if [ -f /tmp/vfo20_backend_port ]; then
    BACKEND_PORT=$(cat /tmp/vfo20_backend_port 2>/dev/null || echo "8000")
fi
export NEXT_PUBLIC_API_URL="http://localhost:${BACKEND_PORT}/api/v1"

echo "=================================================================="
echo "   🚀 VINFAST AI ENABLEMENT COACH — STARTING FRONTEND NEXT.JS"
echo "   Backend Target: $NEXT_PUBLIC_API_URL"
echo "   Giao diện Web:  http://localhost:3000 (hoặc http://localhost:3001 nếu 3000 bận)"
echo "   Advisor:        http://localhost:3000/advisor"
echo "   Manager:        http://localhost:3000/manager"
echo "   Admin:          http://localhost:3000/admin"
echo "=================================================================="

# Check package manager (pnpm -> npm)
if command -v pnpm >/dev/null 2>&1; then
    pnpm dev
elif [ -x "/Users/truongan/.npm-global/bin/pnpm" ]; then
    /Users/truongan/.npm-global/bin/pnpm dev
else
    npm run dev
fi
