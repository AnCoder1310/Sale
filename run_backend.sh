#!/usr/bin/env bash
# ==============================================================================
# VINFAST AI SALES ENABLEMENT COACH (VFO2O-20) - BACKEND LAUNCHER
# Khởi chạy FastAPI Backend Server với Uvicorn và Hot-reload
# Tự động phát hiện xung đột cổng và chọn port khả dụng
# ==============================================================================

set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
HOST=${HOST:-0.0.0.0}

# Phát hiện cổng khả dụng (Ưu tiên 8000, dự phòng 8001)
if [ -z "$PORT" ]; then
    if lsof -nP -iTCP:8000 -sTCP:LISTEN >/dev/null 2>&1; then
        echo "⚠️  CẢNH BÁO: Port 8000 hiện đang bị chiếm (bởi Docker hoặc tiến trình khác)."
        echo "👉 Hệ thống tự động chuyển Backend sang Cổng 8001."
        echo "💡 Mẹo: Nếu muốn dùng cổng 8000, hãy tắt container: docker stop \$(docker ps -q)"
        echo ""
        PORT=8001
    else
        PORT=8000
    fi
fi

# Ghi lại cổng đang chạy để Frontend tự động kết nối
echo "$PORT" > /tmp/vfo20_backend_port 2>/dev/null || true

echo "=================================================================="
echo "   🚀 VINFAST AI ENABLEMENT COACH — STARTING BACKEND FASTAPI"
echo "   URL API:       http://localhost:${PORT}"
echo "   Tài liệu Docs: http://localhost:${PORT}/docs"
echo "   ReDoc:         http://localhost:${PORT}/redoc"
echo "   Health:        http://localhost:${PORT}/health"
echo "=================================================================="

# Ensure database tables exist
python3 -c "from src.platform.database import init_db; init_db()"

# Start Uvicorn server
exec python3 -m uvicorn src.main:app --host "${HOST}" --port "${PORT}" --reload
