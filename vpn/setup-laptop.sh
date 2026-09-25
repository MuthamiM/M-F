#!/bin/bash
# =====================================================
# M&F Technologies - Laptop WireGuard VPN Client Setup
# Run this ON YOUR LAPTOP
# =====================================================
#
# BEFORE running this script, you need the laptop config
# from your VPS. Run this on your VPS first:
#   sudo cat /etc/wireguard/laptop-client.conf
# Then paste it when prompted, OR copy it here manually.
set -e

WG_PORT=51820
WG_INTERFACE="wg0"
CONFIG_FILE="/etc/wireguard/${WG_INTERFACE}.conf"
VPS_PUBLIC_IP="${2:-${VPS_IP:-}}"

echo "🔧 WireGuard VPN Client Setup (Laptop)"
echo "========================================"
echo ""

# --- Install WireGuard ---
echo "📦 Installing WireGuard..."
if command -v apt-get &>/dev/null; then
    sudo apt-get update -qq
    sudo apt-get install -y -qq wireguard wireguard-tools resolvconf
elif command -v pacman &>/dev/null; then
    sudo pacman -S --noconfirm wireguard-tools
elif command -v dnf &>/dev/null; then
    sudo dnf install -y wireguard-tools
elif command -v yum &>/dev/null; then
    sudo yum install -y wireguard-tools
else
    echo "❌ Unsupported package manager. Install WireGuard manually."
    exit 1
fi
echo "   ✅ WireGuard installed"

# --- Check if config already exists ---
if [ -f "$CONFIG_FILE" ]; then
    echo ""
    echo "⚠️  Config already exists at ${CONFIG_FILE}"
    read -p "   Overwrite? (y/N): " OVERWRITE
    if [[ "$OVERWRITE" != "y" && "$OVERWRITE" != "Y" ]]; then
        echo "   Keeping existing config. Skipping to service setup..."
        goto_service=true
    fi
fi

if [ "$goto_service" != "true" ]; then
    # --- Get the config ---
    echo ""
    echo "📋 You need the WireGuard client config from your VPS."
    echo "   If you ran setup-vps.sh, it was saved at:"
    echo "   /etc/wireguard/laptop-client.conf on the VPS"
    echo ""

    # Check if config was passed as argument
    if [ -n "$1" ] && [ -f "$1" ]; then
        echo "   Using config file: $1"
        sudo cp "$1" "$CONFIG_FILE"
    else
        echo "   Paste your WireGuard client config below."
        echo "   (When done, press Ctrl+D on a new line)"
        echo "   ---"
        sudo tee "$CONFIG_FILE" > /dev/null
        echo "   ---"
    fi

    sudo chmod 600 "$CONFIG_FILE"
    echo "   ✅ Config saved to ${CONFIG_FILE}"
fi

# --- Enable and start WireGuard at boot ---
echo ""
echo "🚀 Enabling WireGuard VPN (starts at boot)..."
sudo systemctl stop wg-quick@${WG_INTERFACE} 2>/dev/null || true
sudo systemctl enable wg-quick@${WG_INTERFACE}
sudo systemctl start wg-quick@${WG_INTERFACE}

# --- Verify connection ---
echo ""
echo "⏳ Verifying VPN connection..."
sleep 3

# Check interface is up
if ip a show ${WG_INTERFACE} &>/dev/null; then
    echo "   ✅ WireGuard interface is UP"
else
    echo "   ❌ WireGuard interface failed to start"
    echo "   Check: sudo journalctl -u wg-quick@${WG_INTERFACE} --no-pager -n 20"
    exit 1
fi

# Check we can ping the VPS through the tunnel
if ping -c 1 -W 3 10.66.66.1 &>/dev/null; then
    echo "   ✅ VPS reachable through tunnel"
else
    echo "   ⚠️  Cannot reach VPS through tunnel (may still work for internet)"
fi

# Check public IP
echo ""
echo "🌐 Checking your public IP..."
PUBLIC_IP=$(curl -s --max-time 10 ifconfig.me 2>/dev/null || curl -s --max-time 10 icanhazip.com 2>/dev/null || echo "unknown")
echo ""
if [ "$PUBLIC_IP" = "$VPS_PUBLIC_IP" ]; then
    echo "   ✅ SUCCESS! Your public IP is now: $PUBLIC_IP (USA 🇺🇸)"
else
    echo "   ℹ️  Your public IP: $PUBLIC_IP"
    if [ "$PUBLIC_IP" != "unknown" ]; then
        echo "   ⚠️  IP doesn't match VPS yet. It may take a moment to route."
        echo "   Try: curl ifconfig.me"
    fi
fi

echo ""
echo "======================================="
echo "✅ VPN CLIENT CONFIGURED!"
echo "======================================="
echo ""
echo " Status:    sudo wg show"
echo " Stop VPN:  sudo systemctl stop wg-quick@${WG_INTERFACE}"
echo " Start VPN: sudo systemctl start wg-quick@${WG_INTERFACE}"
echo " Disable:   sudo systemctl disable wg-quick@${WG_INTERFACE}"
echo " Check IP:  curl ifconfig.me"
echo ""
echo " VPN starts automatically on boot."
echo "======================================="
