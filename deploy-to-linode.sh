#!/bin/bash
# ============================================================
# M&F Technologies - One-Shot Linode Deployment
# Run this FROM YOUR LAPTOP after creating a Linode instance
# ============================================================
# Usage:
#   bash deploy-to-linode.sh <LINODE_IP> [DOMAIN]
#
# Example:
#   bash deploy-to-linode.sh 172.234.56.78
#   bash deploy-to-linode.sh 172.234.56.78 mftechnologies.org
# ============================================================

set -euo pipefail

# ---- Configuration ----
LINODE_IP="${1:-}"
DOMAIN="${2:-mftechnologies.org}"
SSH_USER="root"
REMOTE_DIR="/opt/mf-technologies"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

print_header() { echo -e "\n${CYAN}${BOLD}═══════════════════════════════════════════════${NC}"; echo -e "${CYAN}${BOLD} $1${NC}"; echo -e "${CYAN}${BOLD}═══════════════════════════════════════════════${NC}"; }
print_step()   { echo -e "${GREEN}[+]${NC} $1"; }
print_warn()   { echo -e "${YELLOW}[!]${NC} $1"; }
print_error()  { echo -e "${RED}[-]${NC} $1"; }
print_info()   { echo -e "    ${BOLD}→${NC} $1"; }

# ---- Validate ----
if [ -z "$LINODE_IP" ]; then
    print_error "Usage: $0 <LINODE_IP> [DOMAIN]"
    echo ""
    echo "  1. Create a Linode at https://cloud.linode.com/linodes/create"
    echo "     → Ubuntu 24.04 LTS, Nanode 2GB+, add your SSH key"
    echo "  2. Copy the IP address"
    echo "  3. Run: bash $0 <IP_ADDRESS>"
    exit 1
fi

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

print_header "M&F Technologies → Linode Deployment"
echo ""
print_info "Linode IP:    ${BOLD}$LINODE_IP${NC}"
print_info "Domain:       ${BOLD}$DOMAIN${NC}"
print_info "Project Dir:  ${BOLD}$PROJECT_DIR${NC}"
echo ""

# ---- Test SSH Connection ----
print_step "Testing SSH connection to $LINODE_IP..."
if ! ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=accept-new ${SSH_USER}@${LINODE_IP} "echo 'SSH OK'" 2>/dev/null; then
    print_error "Cannot connect via SSH. Make sure:"
    echo "  1. The Linode is fully booted (wait 1-2 minutes after creation)"
    echo "  2. Your SSH key is added to the Linode"
    echo "  3. The IP address is correct: $LINODE_IP"
    exit 1
fi
print_info "SSH connection verified ✅"

# ---- Upload Project Files ----
print_header "Uploading Project Files"
print_step "Syncing project to Linode..."

# Create a temporary exclude file for rsync
EXCLUDE_FILE=$(mktemp)
cat > "$EXCLUDE_FILE" <<'EXCLUDES'
node_modules/
.next/
dist/
.git/
logs/
*.log
uploads/
scratch/
EXCLUDES

rsync -avz --progress \
    --exclude-from="$EXCLUDE_FILE" \
    -e "ssh -o StrictHostKeyChecking=accept-new" \
    "$PROJECT_DIR/" "${SSH_USER}@${LINODE_IP}:${REMOTE_DIR}/"

rm -f "$EXCLUDE_FILE"
print_info "Project files uploaded ✅"

# ---- Remote Setup (everything else runs on the Linode) ----
print_header "Running Remote Setup on Linode"
print_step "This will install Docker, Nginx, SSL, and start all services..."
echo ""

ssh -o StrictHostKeyChecking=accept-new ${SSH_USER}@${LINODE_IP} bash -s -- "$DOMAIN" "$LINODE_IP" "$REMOTE_DIR" <<'REMOTE_SCRIPT'
#!/bin/bash
set -euo pipefail

DOMAIN="$1"
SERVER_IP="$2"
PROJECT_DIR="$3"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

step() { echo -e "${GREEN}[+]${NC} $1"; }
info() { echo -e "    ${BOLD}→${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }

cd "$PROJECT_DIR"

# ---- 1. SWAP SPACE (critical for 2GB instances) ----
step "Configuring 2GB swap space..."
if [ -f /swapfile ]; then
    info "Swap already exists, skipping"
else
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile >/dev/null
    swapon /swapfile
    grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
    info "Swap configured ✅"
fi

# ---- 2. SYSTEM UPDATE ----
step "Updating system packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get upgrade -y -qq
info "System updated ✅"

# ---- 3. INSTALL DOCKER ----
step "Installing Docker..."
if ! command -v docker &>/dev/null; then
    apt-get install -y -qq apt-transport-https ca-certificates curl software-properties-common gnupg
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update -qq
    apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-compose-plugin
    systemctl enable --now docker
    info "Docker installed ✅"
else
    info "Docker already installed ✅"
fi

# ---- 4. INSTALL NGINX + CERTBOT ----
step "Installing Nginx and Certbot..."
apt-get install -y -qq nginx certbot python3-certbot-nginx
systemctl enable --now nginx
info "Nginx + Certbot installed ✅"

# ---- 5. CONFIGURE NGINX ----
step "Configuring Nginx reverse proxy for $DOMAIN..."
NGINX_CONF="/etc/nginx/sites-available/mf-technologies"

SERVER_NAMES="$DOMAIN www.$DOMAIN $SERVER_IP"

cat > "$NGINX_CONF" <<NGINX_EOF
server {
    listen 80;
    server_name $SERVER_NAMES;

    # Frontend (Next.js)
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

    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Database Admin (Adminer)
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
NGINX_EOF

rm -f /etc/nginx/sites-enabled/default
ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
info "Nginx configured ✅"

# ---- 6. BUILD & START DOCKER SERVICES ----
step "Building and starting Docker containers..."
cd "$PROJECT_DIR"
docker compose build --no-cache 2>&1 | tail -5
docker compose up -d
info "Docker services started ✅"

# Wait for services
step "Waiting for services to come online..."
for i in $(seq 1 60); do
    if curl -s http://127.0.0.1:3000/ > /dev/null 2>&1; then
        info "Frontend is UP ✅"
        break
    fi
    [ "$i" -eq 60 ] && warn "Frontend still starting... check 'docker compose logs frontend'"
    sleep 2
done

for i in $(seq 1 30); do
    if curl -s http://127.0.0.1:4000/ > /dev/null 2>&1 || curl -s http://127.0.0.1:4000/api/health > /dev/null 2>&1; then
        info "Backend is UP ✅"
        break
    fi
    [ "$i" -eq 30 ] && warn "Backend still starting... check 'docker compose logs backend'"
    sleep 2
done

# ---- 7. SSL CERTIFICATE ----
step "SSL Certificate setup..."
if [[ "$DOMAIN" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    warn "Domain is a raw IP — skipping SSL (add your domain later)"
    warn "To add SSL later: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
else
    warn "DNS must point $DOMAIN → $SERVER_IP before SSL will work"
    warn "Attempting Certbot (will succeed only if DNS is already pointing here)..."
    certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --agree-tos --no-eff-email -m "admin@$DOMAIN" --non-interactive 2>&1 || {
        warn "SSL failed — DNS probably hasn't propagated yet."
        warn "After updating DNS, run:"
        echo "    certbot --nginx -d $DOMAIN -d www.$DOMAIN --agree-tos --no-eff-email -m admin@$DOMAIN --non-interactive"
    }
fi

# ---- 8. INSTALL TAILSCALE (exit node) ----
step "Installing Tailscale..."
curl -fsSL https://tailscale.com/install.sh | sh
info "Tailscale installed ✅"

# Enable IP forwarding (required for exit node)
step "Enabling IP forwarding for exit node..."
sysctl -w net.ipv4.ip_forward=1 > /dev/null
sysctl -w net.ipv6.conf.all.forwarding=1 > /dev/null 2>&1 || true
grep -q "net.ipv4.ip_forward=1" /etc/sysctl.conf || echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
grep -q "net.ipv6.conf.all.forwarding=1" /etc/sysctl.conf || echo "net.ipv6.conf.all.forwarding=1" >> /etc/sysctl.conf
info "IP forwarding enabled ✅"

# Start Tailscale as exit node
step "Starting Tailscale as exit node..."
warn "═══════════════════════════════════════════════"
warn "  TAILSCALE AUTH REQUIRED"
warn "  A login URL will appear below."
warn "  Open it in your browser to authorize this server."
warn "═══════════════════════════════════════════════"
echo ""
tailscale up --advertise-exit-node --hostname=linode-mia --ssh
info "Tailscale connected ✅"

# ---- 9. CONFIGURE SYSTEM FIREWALL ----
step "Configuring system firewall..."
if command -v ufw &>/dev/null; then
    ufw allow 22/tcp    2>/dev/null || true  # SSH
    ufw allow 80/tcp    2>/dev/null || true  # HTTP
    ufw allow 443/tcp   2>/dev/null || true  # HTTPS
    # Allow Tailscale traffic
    ufw allow in on tailscale0 2>/dev/null || true
    echo "y" | ufw enable 2>/dev/null || true
    info "UFW firewall configured ✅"
fi

# ---- FINAL SUMMARY ----
TAILSCALE_IP=$(tailscale ip -4 2>/dev/null || echo "pending")
echo ""
echo -e "${CYAN}${BOLD}═══════════════════════════════════════════════${NC}"
echo -e "${CYAN}${BOLD} ✅  M&F TECHNOLOGIES — LINODE DEPLOYMENT COMPLETE${NC}"
echo -e "${CYAN}${BOLD}═══════════════════════════════════════════════${NC}"
echo ""
echo -e " ${BOLD}Server IP:${NC}       $SERVER_IP"
echo -e " ${BOLD}Tailscale IP:${NC}    $TAILSCALE_IP"
echo -e " ${BOLD}Domain:${NC}          $DOMAIN"
echo ""
echo -e " ${BOLD}Website:${NC}         http://$SERVER_IP"
echo -e "                  https://$DOMAIN (after DNS cutover)"
echo ""
echo -e " ${BOLD}DB Admin:${NC}        http://$SERVER_IP/db/"
echo ""
echo -e " ${BOLD}Docker Status:${NC}"
docker compose -f "$PROJECT_DIR/docker-compose.yml" ps --format "table {{.Name}}\t{{.Status}}" 2>/dev/null || docker compose -f "$PROJECT_DIR/docker-compose.yml" ps
echo ""
echo -e " ${BOLD}Tailscale:${NC}       $(tailscale status --self 2>/dev/null | head -1 || echo 'check: tailscale status')"
echo ""
echo -e "${YELLOW}[!] NEXT STEPS:${NC}"
echo "  1. Approve exit node in Tailscale admin: https://login.tailscale.com/admin/machines"
echo "     → Find 'linode-mia' → ⋮ menu → 'Edit route settings' → Enable 'Use as exit node'"
echo "  2. On your laptop:  tailscale set --exit-node=linode-mia"
echo "  3. Remove old vultr-server from Tailscale admin panel"
echo "  4. Update DNS: Point $DOMAIN → $SERVER_IP"
echo "  5. After DNS propagates, run SSL:"
echo "     ssh root@$SERVER_IP 'certbot --nginx -d $DOMAIN -d www.$DOMAIN'"
echo ""
echo -e "${CYAN}${BOLD}═══════════════════════════════════════════════${NC}"
REMOTE_SCRIPT

# ---- LOCAL SUMMARY ----
print_header "Deployment Complete!"
echo ""
echo -e "${BOLD}Your M&F Technologies platform is now running on Linode.${NC}"
echo ""
echo "  🌐 Website:    http://$LINODE_IP"
echo "  🗄  DB Admin:   http://$LINODE_IP/db/"
echo ""
echo -e "${YELLOW}NEXT STEPS:${NC}"
echo "  1. Approve exit node: https://login.tailscale.com/admin/machines"
echo "     → Find 'linode-mia' → Edit route settings → Enable exit node"
echo "  2. Use as exit node:  sudo tailscale set --exit-node=linode-mia"
echo "  3. Remove vultr-server from Tailscale admin"
echo "  4. Update DNS A records for $DOMAIN → $LINODE_IP"

