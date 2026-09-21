#!/bin/bash
# M&F Technologies Platform - VPS Setup & Configuration Script
# Works on any Ubuntu VPS (Linode, Vultr, DigitalOcean, etc.)
# Must be executed as root/sudo

set -euo pipefail

# Ensure script is run as root
if [ "$EUID" -ne 0 ]; then
  echo "[-] ERROR: This script must be run with root privileges (sudo)."
  exit 1
fi

echo "========================================================"
echo " Starting M&F Technologies Deployment Setup on Ubuntu"
echo "========================================================"

# 1. CONFIGURE SWAP SPACE (Essential for low-memory VPS instances e.g. 1-2GB plans)
echo "[+] Configuring swap space to prevent compiler memory crashes..."
if [ -f /swapfile ]; then
  echo "[*] Swap file already exists. Skipping allocation."
else
  # Allocate 2GB of swap space
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  # Persist swap across reboots
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  echo "[+] 2GB Swap space successfully configured."
fi

# 2. UPDATE SYSTEM PACKAGES
echo "[+] Updating system package repositories..."
apt-get update -y && apt-get upgrade -y

# 3. INSTALL DOCKER & DOCKER COMPOSE
echo "[+] Installing Docker and Docker Compose..."
if ! command -v docker &> /dev/null; then
  apt-get install -y apt-transport-https ca-certificates curl software-properties-common
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
  systemctl enable --now docker
  echo "[+] Docker successfully installed."
else
  echo "[*] Docker is already installed."
fi

# 4. INSTALL NGINX & CERTBOT
echo "[+] Installing Nginx and Certbot..."
apt-get install -y nginx certbot python3-certbot-nginx
systemctl enable --now nginx

# 5. INITIALIZE PRODUCTION ENVIRONMENT FILE
echo "[+] Configuring environment variables..."
PROJECT_DIR="$(pwd)"
ENV_FILE="$PROJECT_DIR/.env"

# Auto-detect public IP on VPS
DETECTED_IP=$(curl -s --max-time 5 ifconfig.me 2>/dev/null || curl -s --max-time 5 icanhazip.com 2>/dev/null || ip route get 1.1.1.1 2>/dev/null | awk '{print $7}' || echo "")

if [ -f "$ENV_FILE" ]; then
  echo "[*] Existing .env file found. Reading configuration."
  DOMAIN=$(grep '^DOMAIN=' "$ENV_FILE" | cut -d '=' -f2 || true)
  JWT_SECRET=$(grep '^JWT_SECRET=' "$ENV_FILE" | cut -d '=' -f2 || true)
  POSTGRES_PASSWORD=$(grep '^POSTGRES_PASSWORD=' "$ENV_FILE" | cut -d '=' -f2 || true)
else
  DOMAIN=${1:-"mftechnologies.org"}
  JWT_SECRET=$(openssl rand -hex 32)
  POSTGRES_PASSWORD=$(openssl rand -hex 24)
  
  cat <<EOF > "$ENV_FILE"
DOMAIN=$DOMAIN
JWT_SECRET=$JWT_SECRET
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
EOF
  echo "[+] Generated new .env configuration file with safe JWT_SECRET and POSTGRES_PASSWORD."
fi

# Validate domain
if [ -z "$DOMAIN" ]; then
  echo "[-] ERROR: Domain cannot be empty."
  exit 1
fi

# 6. CONFIGURING NGINX SITE
echo "[+] Creating Nginx site configuration for domain: $DOMAIN..."
NGINX_CONF="/etc/nginx/sites-available/mf-technologies"

SERVER_NAMES="$DOMAIN www.$DOMAIN"
if [ -n "$DETECTED_IP" ]; then
  SERVER_NAMES="$SERVER_NAMES $DETECTED_IP"
fi

cat <<EOF > "$NGINX_CONF"
server {
    listen 80;
    server_name $SERVER_NAMES;

    # Frontend proxy (Next.js server-side)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Expose Adminer Database Management console
    location /db/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_redirect off;
    }

    client_max_body_size 20M;
}
EOF

# Enable Nginx site and remove default config if present
if [ -f "/etc/nginx/sites-enabled/default" ]; then
  rm -f /etc/nginx/sites-enabled/default
fi

ln -sf "$NGINX_CONF" "/etc/nginx/sites-enabled/"

# Test Nginx syntax and reload
nginx -t
systemctl reload nginx
echo "[+] Nginx site configured and reloaded."

# 7. GENERATE SSL CERTIFICATE VIA CERTBOT
# Check if DOMAIN is a raw IP or default hostname that can't get Let's Encrypt
if [[ "$DOMAIN" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ || "$DOMAIN" == *".ip.linodeusercontent.com" || "$DOMAIN" == *"vultrusercontent.com" ]]; then
  echo "[*] Using raw IP or provider default hostname. Skipping Certbot SSL configuration."
else
  echo "[+] Obtaining SSL Certificate for $DOMAIN..."
  if [ "${NON_INTERACTIVE:-false}" = "true" ]; then
    certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --agree-tos --no-eff-email -m "admin@$DOMAIN" --non-interactive || true
  else
    echo "========================================================"
    echo " Ensure your DNS A Records for $DOMAIN and www.$DOMAIN"
    echo " point to this server's public IP address before proceeding!"
    echo "========================================================"
    read -p "Run Certbot SSL installer? (y/N): " RUN_CERTBOT
    if [[ "$RUN_CERTBOT" =~ ^[Yy]$ ]]; then
      certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --agree-tos --no-eff-email -m "admin@$DOMAIN"
      systemctl reload nginx
      echo "[+] SSL Certificates successfully configured."
    fi
  fi
fi

# 8. START CONTAINERS
echo "[+] Building and starting Docker services..."
docker compose build --no-cache
docker compose up -d

echo "========================================================"
echo " M&F Technologies Platform Setup Completed!"
echo " Visit:"
echo "   Website & Admin Console:  https://$DOMAIN"
echo "   Database Manager:        https://$DOMAIN/db/"
echo "========================================================"
