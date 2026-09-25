#!/bin/bash
# Quick VPN status check and control
set -e

WG_INTERFACE="wg0"
VPS_IP=$(sudo grep -oP 'Endpoint\s*=\s*\K[^:]+' "/etc/wireguard/${WG_INTERFACE}.conf" 2>/dev/null || echo "${VPS_PUBLIC_IP:-}")

case "${1:-status}" in
    status)
        echo "🔍 VPN Status"
        echo "============="
        if ip a show $WG_INTERFACE &>/dev/null 2>&1; then
            echo "Interface: ✅ UP"
            sudo wg show $WG_INTERFACE 2>/dev/null | grep -E "endpoint|latest|transfer" | sed 's/^/  /'
            PUBLIC_IP=$(curl -s --max-time 5 ifconfig.me 2>/dev/null || echo "unknown")
            if [ "$PUBLIC_IP" = "$VPS_IP" ]; then
                echo "Public IP: ✅ $PUBLIC_IP (USA 🇺🇸)"
            else
                echo "Public IP: ⚠️  $PUBLIC_IP (NOT routing through VPS)"
            fi
        else
            echo "Interface: ❌ DOWN"
            echo ""
            echo "Start with: $0 up"
        fi
        ;;
    up)
        echo "🚀 Starting VPN..."
        sudo systemctl start wg-quick@${WG_INTERFACE}
        sleep 2
        $0 status
        ;;
    down)
        echo "⏹️  Stopping VPN..."
        sudo systemctl stop wg-quick@${WG_INTERFACE}
        echo "   ✅ VPN stopped"
        PUBLIC_IP=$(curl -s --max-time 5 ifconfig.me 2>/dev/null || echo "unknown")
        echo "   Public IP: $PUBLIC_IP (real IP)"
        ;;
    restart)
        echo "🔄 Restarting VPN..."
        sudo systemctl restart wg-quick@${WG_INTERFACE}
        sleep 2
        $0 status
        ;;
    *)
        echo "Usage: $0 {status|up|down|restart}"
        ;;
esac
