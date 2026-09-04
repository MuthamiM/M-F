#!/bin/bash
# ============================================
# M&F Technologies - VPS WireGuard VPN Setup
# Run this ON YOUR VPS (18.188.142.27)
# ============================================
set -e

VPS_PUBLIC_IP="18.188.142.27"
WG_PORT=51820
WG_INTERFACE="wg0"
SERVER_SUBNET="10.66.66.1/24"
SERVER_IP="10.66.66.1"
CLIENT_IP="10.66.66.2/32"

echo "🔧 WireGuard VPN Server Setup"
echo "=============================="
echo ""

# --- Detect main network interface ---
MAIN_IFACE=$(ip -4 route show default | awk '{print $5}' | head -1)
if [ -z "$MAIN_IFACE" ]; then
    echo "❌ Could not detect main network interface"
    exit 1
fi
echo "📡 Detected network interface: $MAIN_IFACE"

# --- Install WireGuard ---
echo ""
echo "📦 Installing WireGuard..."
if command -v apt-get &>/dev/null; then
    sudo apt-get update -qq
    sudo apt-get install -y -qq wireguard qrencode
elif command -v yum &>/dev/null; then
    sudo yum install -y epel-release
    sudo yum install -y wireguard-tools qrencode
elif command -v dnf &>/dev/null; then
    sudo dnf install -y wireguard-tools qrencode
else
    echo "❌ Unsupported package manager. Install WireGuard manually."
    exit 1
fi
echo "   ✅ WireGuard installed"

# --- Generate server keys ---
echo ""
echo "🔑 Generating server keys..."
sudo mkdir -p /etc/wireguard
cd /etc/wireguard

if [ ! -f server_private.key ]; then
    wg genkey | sudo tee server_private.key | wg pubkey | sudo tee server_public.key > /dev/null
    sudo chmod 600 server_private.key
    echo "   ✅ New keys generated"
else
    echo "   ℹ️  Keys already exist, reusing"
fi

SERVER_PRIVKEY=$(sudo cat server_private.key)
SERVER_PUBKEY=$(sudo cat server_public.key)

# --- Generate client keys (for the laptop) ---
echo ""
echo "🔑 Generating laptop client keys..."
if [ ! -f client_private.key ]; then
    wg genkey | sudo tee client_private.key | wg pubkey | sudo tee client_public.key > /dev/null
    wg genpsk | sudo tee client_psk.key > /dev/null
    sudo chmod 600 client_private.key client_psk.key
    echo "   ✅ Client keys generated"
else
    echo "   ℹ️  Client keys already exist, reusing"
fi

CLIENT_PRIVKEY=$(sudo cat client_private.key)
CLIENT_PUBKEY=$(sudo cat client_public.key)
CLIENT_PSK=$(sudo cat client_psk.key)

# --- Enable IP forwarding ---
echo ""
echo "🌐 Enabling IP forwarding..."
sudo sysctl -w net.ipv4.ip_forward=1 > /dev/null
sudo sysctl -w net.ipv6.conf.all.forwarding=1 > /dev/null 2>&1 || true

# Make persistent
if ! grep -q "net.ipv4.ip_forward=1" /etc/sysctl.conf 2>/dev/null; then
    echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf > /dev/null
fi
if ! grep -q "net.ipv6.conf.all.forwarding=1" /etc/sysctl.conf 2>/dev/null; then
    echo "net.ipv6.conf.all.forwarding=1" | sudo tee -a /etc/sysctl.conf > /dev/null
fi
echo "   ✅ IP forwarding enabled"

# --- Create WireGuard server config ---
echo ""
echo "📝 Writing WireGuard server config..."
sudo tee /etc/wireguard/${WG_INTERFACE}.conf > /dev/null <<EOF
[Interface]
Address = ${SERVER_SUBNET}
ListenPort = ${WG_PORT}
PrivateKey = ${SERVER_PRIVKEY}

# NAT: Masquerade client traffic so it exits with the VPS public IP
PostUp = iptables -t nat -A POSTROUTING -s 10.66.66.0/24 -o ${MAIN_IFACE} -j MASQUERADE
PostUp = iptables -A FORWARD -i ${WG_INTERFACE} -j ACCEPT
PostUp = iptables -A FORWARD -o ${WG_INTERFACE} -j ACCEPT
PostDown = iptables -t nat -D POSTROUTING -s 10.66.66.0/24 -o ${MAIN_IFACE} -j MASQUERADE
PostDown = iptables -D FORWARD -i ${WG_INTERFACE} -j ACCEPT
PostDown = iptables -D FORWARD -o ${WG_INTERFACE} -j ACCEPT

# Laptop client
[Peer]
PublicKey = ${CLIENT_PUBKEY}
PresharedKey = ${CLIENT_PSK}
AllowedIPs = ${CLIENT_IP}
EOF

sudo chmod 600 /etc/wireguard/${WG_INTERFACE}.conf
echo "   ✅ Server config written"

# --- Open firewall port ---
echo ""
echo "🔥 Configuring firewall..."
# Try iptables directly
sudo iptables -A INPUT -p udp --dport ${WG_PORT} -j ACCEPT 2>/dev/null || true
# Try ufw if available
if command -v ufw &>/dev/null; then
    sudo ufw allow ${WG_PORT}/udp 2>/dev/null || true
fi
echo "   ✅ Port ${WG_PORT}/udp opened"

# --- AWS Security Group reminder ---
echo ""
echo "⚠️  IMPORTANT: Make sure your AWS Security Group allows:"
echo "   Inbound UDP port ${WG_PORT} from 0.0.0.0/0"
echo ""

# --- Start and enable WireGuard ---
echo "🚀 Starting WireGuard..."
sudo systemctl stop wg-quick@${WG_INTERFACE} 2>/dev/null || true
sudo systemctl enable wg-quick@${WG_INTERFACE}
sudo systemctl start wg-quick@${WG_INTERFACE}
echo "   ✅ WireGuard active and enabled at boot"

# --- Generate laptop client config ---
echo ""
echo "📱 Generating laptop config file..."
LAPTOP_CONF="/etc/wireguard/laptop-client.conf"
sudo tee ${LAPTOP_CONF} > /dev/null <<EOF
[Interface]
Address = 10.66.66.2/24
PrivateKey = ${CLIENT_PRIVKEY}
DNS = 1.1.1.1, 8.8.8.8

[Peer]
PublicKey = ${SERVER_PUBKEY}
PresharedKey = ${CLIENT_PSK}
Endpoint = ${VPS_PUBLIC_IP}:${WG_PORT}
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25
EOF

sudo chmod 600 ${LAPTOP_CONF}

echo ""
echo "======================================="
echo "✅ VPS WireGuard SERVER is READY!"
echo "======================================="
echo ""
echo "SERVER PUBLIC KEY:"
echo "   ${SERVER_PUBKEY}"
echo ""
echo "LAPTOP CONFIG has been saved to:"
echo "   ${LAPTOP_CONF}"
echo ""
echo "To view it (copy this to your laptop):"
echo "   sudo cat ${LAPTOP_CONF}"
echo ""
# Show QR code if terminal supports it
if command -v qrencode &>/dev/null; then
    echo "Or scan this QR code (for WireGuard mobile app):"
    sudo cat ${LAPTOP_CONF} | qrencode -t ansiutf8
fi
echo ""
echo "NEXT STEP: Copy the laptop config to your laptop and run setup-laptop.sh"
echo "======================================="
