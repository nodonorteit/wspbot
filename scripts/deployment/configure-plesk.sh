#!/bin/bash

# Plesk Configuration Script for WhatsApp Bot Multi-Tenant
# This script helps configure Plesk domains and SSL certificates

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN=""
ADMIN_EMAIL=""
PROJECT_DIR="/var/www/wspbot"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Get user input
get_domain() {
    read -p "Enter your main domain (e.g., yourdomain.com): " DOMAIN
    if [ -z "$DOMAIN" ]; then
        log_error "Domain cannot be empty"
        exit 1
    fi
}

get_admin_email() {
    read -p "Enter admin email for SSL certificates: " ADMIN_EMAIL
    if [ -z "$ADMIN_EMAIL" ]; then
        log_error "Admin email cannot be empty"
        exit 1
    fi
}

# Check if Plesk is installed
check_plesk() {
    if ! command -v plesk &> /dev/null; then
        log_error "Plesk is not installed or not in PATH"
        exit 1
    fi
    log_success "Plesk is installed"
}

# Create domains in Plesk
create_domains() {
    log_info "Creating domains in Plesk..."
    
    # Main domain
    plesk bin domain --create $DOMAIN -owner admin -ip 0.0.0.0
    
    # API subdomain
    plesk bin subdomain --create api -domain $DOMAIN -subdomain api -owner admin
    
    # Admin subdomain
    plesk bin subdomain --create admin -domain $DOMAIN -subdomain admin -owner admin
    
    # WAHA subdomain
    plesk bin subdomain --create waha -domain $DOMAIN -subdomain waha -owner admin
    
    log_success "Domains created successfully"
}

# Configure document roots
configure_document_roots() {
    log_info "Configuring document roots..."
    
    # Main domain - Admin Panel
    plesk bin domain --update $DOMAIN -document_root $PROJECT_DIR/frontend/admin-panel/dist
    
    # API subdomain - Reverse proxy
    plesk bin subdomain --update api -domain $DOMAIN -document_root $PROJECT_DIR
    
    # Admin subdomain - Admin Panel
    plesk bin subdomain --update admin -domain $DOMAIN -document_root $PROJECT_DIR/frontend/admin-panel/dist
    
    # WAHA subdomain - Reverse proxy
    plesk bin subdomain --update waha -domain $DOMAIN -document_root $PROJECT_DIR
    
    log_success "Document roots configured"
}

# Configure reverse proxies
configure_reverse_proxies() {
    log_info "Configuring reverse proxies..."
    
    # API subdomain proxy
    plesk bin subdomain --update api -domain $DOMAIN -proxy true -proxy_host localhost -proxy_port 8080
    
    # WAHA subdomain proxy
    plesk bin subdomain --update waha -domain $DOMAIN -proxy true -proxy_host localhost -proxy_port 3000
    
    log_success "Reverse proxies configured"
}

# Configure SSL certificates
configure_ssl() {
    log_info "Configuring SSL certificates..."
    
    # Enable Let's Encrypt for all domains
    plesk bin certificate --create $DOMAIN -domain $DOMAIN -email $ADMIN_EMAIL -letsencrypt true
    plesk bin certificate --create api.$DOMAIN -domain api.$DOMAIN -email $ADMIN_EMAIL -letsencrypt true
    plesk bin certificate --create admin.$DOMAIN -domain admin.$DOMAIN -email $ADMIN_EMAIL -letsencrypt true
    plesk bin certificate --create waha.$DOMAIN -domain waha.$DOMAIN -email $ADMIN_EMAIL -letsencrypt true
    
    # Enable HTTPS redirect
    plesk bin domain --update $DOMAIN -ssl_redirect true
    plesk bin subdomain --update api -domain $DOMAIN -ssl_redirect true
    plesk bin subdomain --update admin -domain $DOMAIN -ssl_redirect true
    plesk bin subdomain --update waha -domain $DOMAIN -ssl_redirect true
    
    log_success "SSL certificates configured"
}

# Configure firewall
configure_firewall() {
    log_info "Configuring firewall..."
    
    # Allow necessary ports
    plesk bin firewall --add-port 80 -protocol tcp -comment "HTTP"
    plesk bin firewall --add-port 443 -protocol tcp -comment "HTTPS"
    plesk bin firewall --add-port 22 -protocol tcp -comment "SSH"
    
    log_success "Firewall configured"
}

# Create nginx configuration
create_nginx_config() {
    log_info "Creating nginx configuration..."
    
    # API subdomain nginx config
    cat > /var/www/vhosts/system/$DOMAIN/conf/vhost_nginx.conf <<EOF
location / {
    proxy_pass http://localhost:8080;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_connect_timeout 30s;
    proxy_send_timeout 30s;
    proxy_read_timeout 30s;
}
EOF

    # WAHA subdomain nginx config
    cat > /var/www/vhosts/system/$DOMAIN/conf/vhost_nginx_waha.conf <<EOF
location / {
    proxy_pass http://localhost:3000;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_connect_timeout 30s;
    proxy_send_timeout 30s;
    proxy_read_timeout 30s;
}
EOF

    # Reload nginx
    plesk bin domain --update $DOMAIN -nginx true
    
    log_success "Nginx configuration created"
}

# Update environment file
update_environment() {
    log_info "Updating environment file..."
    
    cd $PROJECT_DIR
    
    # Update domain in .env file
    sed -i "s/yourdomain.com/$DOMAIN/g" .env
    sed -i "s/admin@yourdomain.com/$ADMIN_EMAIL/g" .env
    
    log_success "Environment file updated"
}

# Test configuration
test_configuration() {
    log_info "Testing configuration..."
    
    # Test domains
    echo "Testing domains:"
    echo "- https://$DOMAIN"
    echo "- https://api.$DOMAIN"
    echo "- https://admin.$DOMAIN"
    echo "- https://waha.$DOMAIN"
    
    # Test API health
    if curl -s https://api.$DOMAIN/health > /dev/null; then
        log_success "API is responding"
    else
        log_warning "API is not responding yet"
    fi
    
    # Test WAHA
    if curl -s https://waha.$DOMAIN/api/sessions > /dev/null; then
        log_success "WAHA is responding"
    else
        log_warning "WAHA is not responding yet"
    fi
}

# Main function
main() {
    log_info "Starting Plesk configuration for WhatsApp Bot Multi-Tenant..."
    
    check_plesk
    get_domain
    get_admin_email
    
    create_domains
    configure_document_roots
    configure_reverse_proxies
    configure_ssl
    configure_firewall
    create_nginx_config
    update_environment
    test_configuration
    
    log_success "Plesk configuration completed!"
    log_info "Next steps:"
    echo "1. Start the WhatsApp Bot service: sudo systemctl start wspbot"
    echo "2. Check service status: sudo systemctl status wspbot"
    echo "3. Access admin panel: https://admin.$DOMAIN"
    echo "4. Configure WhatsApp connection in admin panel"
}

# Run main function
main "$@"
