#!/bin/bash

# WhatsApp Bot Multi-Tenant - Ubuntu Server Deployment Script
# For Plesk hosting environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="wspbot"
PROJECT_DIR="/var/www/$PROJECT_NAME"
DOMAIN="yourdomain.com"
MYSQL_ROOT_PASSWORD=""
MYSQL_PASSWORD=""
JWT_SECRET=""

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

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        log_error "This script should not be run as root"
        exit 1
    fi
}

# Check if user has sudo privileges
check_sudo() {
    if ! sudo -n true 2>/dev/null; then
        log_error "This script requires sudo privileges"
        exit 1
    fi
}

# Install system dependencies
install_dependencies() {
    log_info "Installing system dependencies..."
    
    sudo apt update
    sudo apt install -y \
        curl \
        wget \
        git \
        unzip \
        software-properties-common \
        apt-transport-https \
        ca-certificates \
        gnupg \
        lsb-release
    
    log_success "System dependencies installed"
}

# Install Docker
install_docker() {
    log_info "Installing Docker..."
    
    # Remove old versions
    sudo apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true
    
    # Add Docker's official GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Set up the stable repository
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker Engine
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # Add user to docker group
    sudo usermod -aG docker $USER
    
    # Start and enable Docker
    sudo systemctl start docker
    sudo systemctl enable docker
    
    log_success "Docker installed successfully"
}

# Install Node.js
install_nodejs() {
    log_info "Installing Node.js..."
    
    # Install Node.js 18.x
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
    
    log_success "Node.js installed: $(node --version)"
}

# Create project directory
create_project_dir() {
    log_info "Creating project directory..."
    
    sudo mkdir -p $PROJECT_DIR
    sudo chown $USER:$USER $PROJECT_DIR
    
    log_success "Project directory created: $PROJECT_DIR"
}

# Clone repository
clone_repository() {
    log_info "Cloning repository..."
    
    cd $PROJECT_DIR
    git clone https://github.com/nodonorteit/wspbot.git .
    
    log_success "Repository cloned"
}

# Install project dependencies
install_project_dependencies() {
    log_info "Installing project dependencies..."
    
    cd $PROJECT_DIR
    npm install
    
    log_success "Project dependencies installed"
}

# Configure environment
configure_environment() {
    log_info "Configuring environment..."
    
    cd $PROJECT_DIR
    
    # Copy production environment file
    cp env.production .env
    
    # Generate secure passwords if not provided
    if [ -z "$MYSQL_ROOT_PASSWORD" ]; then
        MYSQL_ROOT_PASSWORD=$(openssl rand -base64 32)
    fi
    
    if [ -z "$MYSQL_PASSWORD" ]; then
        MYSQL_PASSWORD=$(openssl rand -base64 32)
    fi
    
    if [ -z "$JWT_SECRET" ]; then
        JWT_SECRET=$(openssl rand -base64 64)
    fi
    
    # Update environment file
    sed -i "s/yourdomain.com/$DOMAIN/g" .env
    sed -i "s/your-secure-mysql-password/$MYSQL_PASSWORD/g" .env
    sed -i "s/your-secure-root-password/$MYSQL_ROOT_PASSWORD/g" .env
    sed -i "s/your-super-secret-jwt-key-change-in-production-make-it-very-long-and-random/$JWT_SECRET/g" .env
    sed -i "s/admin@yourdomain.com/admin@$DOMAIN/g" .env
    
    log_success "Environment configured"
    log_warning "Please update the domain configuration in .env file"
}

# Create systemd service
create_systemd_service() {
    log_info "Creating systemd service..."
    
    sudo tee /etc/systemd/system/wspbot.service > /dev/null <<EOF
[Unit]
Description=WhatsApp Bot Multi-Tenant
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$PROJECT_DIR
ExecStart=/usr/bin/docker compose -f docker-compose.production.yml up -d
ExecStop=/usr/bin/docker compose -f docker-compose.production.yml down
TimeoutStartSec=0
User=$USER
Group=$USER

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable wspbot.service
    
    log_success "Systemd service created"
}

# Setup firewall
setup_firewall() {
    log_info "Setting up firewall..."
    
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw --force enable
    
    log_success "Firewall configured"
}

# Create backup script
create_backup_script() {
    log_info "Creating backup script..."
    
    sudo tee /usr/local/bin/wspbot-backup > /dev/null <<'EOF'
#!/bin/bash

BACKUP_DIR="/var/backups/wspbot"
PROJECT_DIR="/var/www/wspbot"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup MySQL databases
docker exec wspbot-mysql mysqldump --all-databases --single-transaction --routines --triggers > $BACKUP_DIR/mysql_backup_$DATE.sql

# Backup Redis data
docker exec wspbot-redis redis-cli BGSAVE
docker cp wspbot-redis:/data/dump.rdb $BACKUP_DIR/redis_backup_$DATE.rdb

# Backup application data
tar -czf $BACKUP_DIR/app_data_$DATE.tar.gz -C $PROJECT_DIR .

# Clean old backups (keep 30 days)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.rdb" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
EOF

    sudo chmod +x /usr/local/bin/wspbot-backup
    
    # Add to crontab
    (crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/wspbot-backup") | crontab -
    
    log_success "Backup script created"
}

# Main deployment function
main() {
    log_info "Starting WhatsApp Bot Multi-Tenant deployment..."
    
    check_root
    check_sudo
    
    install_dependencies
    install_docker
    install_nodejs
    create_project_dir
    clone_repository
    install_project_dependencies
    configure_environment
    create_systemd_service
    setup_firewall
    create_backup_script
    
    log_success "Deployment completed successfully!"
    log_info "Next steps:"
    echo "1. Update domain configuration in $PROJECT_DIR/.env"
    echo "2. Configure Plesk domains:"
    echo "   - api.$DOMAIN"
    echo "   - admin.$DOMAIN"
    echo "   - waha.$DOMAIN"
    echo "3. Start the service: sudo systemctl start wspbot"
    echo "4. Check logs: sudo journalctl -u wspbot -f"
    echo "5. Access admin panel: https://admin.$DOMAIN"
}

# Run main function
main "$@"
