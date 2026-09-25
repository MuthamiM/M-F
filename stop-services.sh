#!/bin/bash
# M&F Technologies - Stop all services

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="$PROJECT_DIR/logs"

echo " Stopping M&F Technologies services..."

# Kill backend
if [ -f "$LOG_DIR/backend.pid" ]; then
    kill "$(cat "$LOG_DIR/backend.pid")" 2>/dev/null && echo "    Backend stopped" || echo "   ℹ️  Backend was not running"
    rm -f "$LOG_DIR/backend.pid"
fi

# Kill frontend
if [ -f "$LOG_DIR/frontend.pid" ]; then
    kill "$(cat "$LOG_DIR/frontend.pid")" 2>/dev/null && echo "   ✅ Frontend stopped" || echo "   ℹ️  Frontend was not running"
    rm -f "$LOG_DIR/frontend.pid"
fi

# Also kill by port in case PIDs are stale
lsof -ti:4000 2>/dev/null | xargs -r kill 2>/dev/null || true
lsof -ti:3000 2>/dev/null | xargs -r kill 2>/dev/null || true

echo ""
echo "All services stopped."
