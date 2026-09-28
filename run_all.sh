#!/usr/bin/env bash
# ==============================================================================
# VINFAST AI SALES ENABLEMENT COACH (VFO2O-20) - FULLSTACK LAUNCHER
# Khởi động đồng thời cả Backend FastAPI và Frontend Next.js
# ==============================================================================

set -e

DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=================================================================="
echo "    🚀 VINFAST AI SALES ENABLEMENT COACH — LAUNCHING FULLSTACK"
echo "=================================================================="

# Function to kill child processes on exit
cleanup() {
    echo ""
    echo ">> Đang dừng hệ thống..."
    kill $(jobs -p) 2>/dev/null || true
    echo ">> Đã tắt toàn bộ dịch vụ an toàn."
}
trap cleanup EXIT INT TERM

# Start Backend in background
echo ">> Khởi động Backend FastAPI..."
"$DIR/run_backend.sh" &
BACKEND_PID=$!

# Wait for backend port determination
sleep 2

# Start Frontend
echo ">> Khởi động Frontend Next.js..."
"$DIR/run_frontend.sh" &
FRONTEND_PID=$!

# Keep script running
wait
