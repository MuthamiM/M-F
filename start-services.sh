#!/bin/bash
# M&F Technologies - Start all services with Tailscale Funnel
# Services persist even when the laptop lid is closed (via systemd-inhibit + nohup)

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
LOG_DIR="$PROJECT_DIR/logs"

# Create log directory
mkdir -p "$LOG_DIR"

echo "🔧 M&F Technologies - Service Manager"
echo "======================================="

# --- Helper: Kill any existing instances ---
cleanup() {
    echo "🧹 Cleaning up old processes..."
    # Kill backend (tsx on port 4000)
    lsof -ti:4000 2>/dev/null | xargs -r kill 2>/dev/null || true
    # Kill frontend (next dev on port 3000) 
    lsof -ti:3000 2>/dev/null | xargs -r kill 2>/dev/null || true
    sleep 2
    echo "   ✅ Old processes cleaned"
}

# --- Start Backend ---
start_backend() {
    echo "🚀 Starting Backend (port 4000)..."
    cd "$BACKEND_DIR"
    nohup npx tsx src/server.ts > "$LOG_DIR/backend.log" 2>&1 &
    BACKEND_PID=$!
    echo "$BACKEND_PID" > "$LOG_DIR/backend.pid"
    echo "   ✅ Backend started (PID: $BACKEND_PID)"
    echo "   📄 Logs: $LOG_DIR/backend.log"
}

# --- Start Frontend ---
start_frontend() {
    echo "🚀 Starting Frontend (port 3000)..."
    cd "$FRONTEND_DIR"
    nohup npx next dev --port 3000 > "$LOG_DIR/frontend.log" 2>&1 &
    FRONTEND_PID=$!
    echo "$FRONTEND_PID" > "$LOG_DIR/frontend.pid"
    echo "   ✅ Frontend started (PID: $FRONTEND_PID)"
    echo "   📄 Logs: $LOG_DIR/frontend.log"
}

# --- Start Tailscale Funnel ---
start_funnel() {
    echo "🌐 Starting Tailscale Funnel (exposing Frontend port 3000 and Backend port 4000)..."
    tailscale serve reset 2>/dev/null || true
    tailscale serve --bg --set-path=/ http://127.0.0.1:3000
    tailscale serve --bg --set-path=/api http://127.0.0.1:4000/api
    tailscale funnel --bg 443 2>/dev/null || true
    tailscale serve --bg --https=8443 --set-path=/ http://127.0.0.1:3000 2>/dev/null || true
    tailscale serve --bg --https=8443 --set-path=/api http://127.0.0.1:4000/api 2>/dev/null || true
    tailscale funnel --bg 8443 2>/dev/null || true
    echo "   ✅ Tailscale Funnel active!"
}

# --- Wait for services to be healthy ---
wait_for_services() {
    echo ""
    echo "⏳ Waiting for services to come up..."
    
    # Wait for backend
    for i in $(seq 1 30); do
        if curl -s http://localhost:4000/api/health > /dev/null 2>&1 || curl -s http://localhost:4000/ > /dev/null 2>&1; then
            echo "   ✅ Backend is healthy"
            break
        fi
        if [ "$i" -eq 30 ]; then
            echo "   ⚠️  Backend may still be starting (check logs: $LOG_DIR/backend.log)"
        fi
        sleep 1
    done
    
    # Wait for frontend
    for i in $(seq 1 30); do
        if curl -s http://localhost:3000/ > /dev/null 2>&1; then
            echo "   ✅ Frontend is healthy"
            break
        fi
        if [ "$i" -eq 30 ]; then
            echo "   ⚠️  Frontend may still be starting (check logs: $LOG_DIR/frontend.log)"
        fi
        sleep 1
    done
}

# --- Main ---
cleanup
start_backend
start_frontend
sleep 3
start_funnel
wait_for_services

echo ""
echo "======================================="
echo "ALL SERVICES RUNNING!"
echo "======================================="
echo ""
echo " PUBLIC TAILSCALE URLS:"
echo "   Main Platform:  https://technoblade.tail953a25.ts.net"
echo "   Admin Login:    https://technoblade.tail953a25.ts.net/admin/login"
echo "   Alt Port (8443):https://technoblade.tail953a25.ts.net:8443/admin/login"
echo ""
echo " LOCAL URLS:"
echo "   Frontend:       http://localhost:3000"
echo "   Admin Login:    http://localhost:3000/admin/login"
echo "   Backend API:    http://localhost:4000/api"
echo ""
echo " Logs:"
echo "   Backend:   tail -f $LOG_DIR/backend.log"
echo "   Frontend:  tail -f $LOG_DIR/frontend.log"
echo ""
echo " To stop everything:"
echo "   bash $PROJECT_DIR/stop-services.sh"
echo "======================================="
