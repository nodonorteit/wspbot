# WhatsApp Bot Multi-Tenant - Deployment Guide for Ubuntu with Plesk

## 🚀 Deployment Overview

This guide covers deploying the WhatsApp Bot Multi-Tenant system on an Ubuntu server with Plesk hosting control panel.

## 📋 Prerequisites

### Server Requirements
- **OS**: Ubuntu 20.04 LTS or later
- **RAM**: Minimum 4GB (8GB recommended)
- **CPU**: 2 cores minimum
- **Storage**: 50GB minimum SSD
- **Plesk**: Latest version installed

### Domain Setup
- Main domain: `yourdomain.com`
- Subdomains needed:
  - `api.yourdomain.com` - API Gateway
  - `admin.yourdomain.com` - Admin Panel
  - `waha.yourdomain.com` - WAHA API

## 🔧 Installation Steps

### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y curl wget git unzip software-properties-common
```

### 2. Manual Configuration

#### Configure Environment Variables
```bash
cd /var/www/wspbot
cp env.production .env
nano .env
```

Update the following variables:
```bash
DOMAIN=yourdomain.com
API_DOMAIN=api.yourdomain.com
ADMIN_DOMAIN=admin.yourdomain.com
WAHA_DOMAIN=waha.yourdomain.com
ACME_EMAIL=admin@yourdomain.com
```

#### Generate Secure Passwords
```bash
# Generate MySQL passwords
MYSQL_PASSWORD=$(openssl rand -base64 32)
MYSQL_ROOT_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 64)

# Update .env file
sed -i "s/your-secure-mysql-password/$MYSQL_PASSWORD/g" .env
sed -i "s/your-secure-root-password/$MYSQL_ROOT_PASSWORD/g" .env
sed -i "s/your-super-secret-jwt-key-change-in-production-make-it-very-long-and-random/$JWT_SECRET/g" .env
```

## 🗄️ Configuración de Base de Datos

### Opción 1: Base de Datos del Hosting (Recomendado)

Esta es la opción recomendada para producción, ya que utiliza la infraestructura de base de datos del hosting:

#### Ventajas:
- **Gestión Centralizada**: Administra todas las bases de datos desde Plesk
- **Backups Automáticos**: Los backups se incluyen en el plan de hosting
- **Seguridad Integrada**: Firewall y seguridad gestionados por Plesk
- **Escalabilidad**: Fácil escalado según las necesidades
- **Monitoreo**: Herramientas de monitoreo integradas
- **Soporte**: Soporte técnico del proveedor de hosting
- **Costo**: No necesitas recursos adicionales para contenedores de base de datos

#### Configuración desde Plesk:
1. Ve a **"Bases de Datos"** en el panel de Plesk
2. Crea las siguientes bases de datos:
   - `wspbot_auth` - Servicio de autenticación
   - `wspbot_tenants` - Gestión de tenants
   - `wspbot_turns` - Sistema de turnos
   - `wspbot_whatsapp` - Datos de WhatsApp
   - `wspbot_notifications` - Sistema de notificaciones
   - `wspbot_analytics` - Análisis y métricas
3. Crea un usuario `wspbot_user` con permisos completos en todas las bases de datos
4. Actualiza el archivo `.env` con las credenciales de la base de datos

#### Variables de Entorno para Base de Datos del Hosting:
```bash
# ===== DATABASE CONFIGURATION (Hosting Database) =====
DB_HOST=localhost
DB_PORT=3306
DB_NAME=wspbot_auth
DB_USER=wspbot_user
DB_PASSWORD=tu_contraseña_de_base_de_datos

# Database names for each service
DB_NAME_AUTH=wspbot_auth
DB_NAME_TENANTS=wspbot_tenants
DB_NAME_TURNS=wspbot_turns
DB_NAME_WHATSAPP=wspbot_whatsapp
DB_NAME_NOTIFICATIONS=wspbot_notifications
DB_NAME_ANALYTICS=wspbot_analytics
```

### Opción 2: Contenedor MySQL (Desarrollo)

Para desarrollo local, puedes usar un contenedor MySQL:

#### Configuración:
1. Descomenta el servicio `mysql` en `docker-compose.yml`
2. Descomenta el servicio `phpmyadmin` para desarrollo
3. Usa las variables de entorno por defecto

#### Variables de Entorno para Contenedor MySQL:
```bash
# ===== DATABASE CONFIGURATION =====
DB_HOST=mysql
DB_PORT=3306
DB_NAME=wspbot_auth
DB_USER=wspbot
DB_PASSWORD=password
```

### Crear Bases de Datos
El sistema requiere múltiples bases de datos para cada microservicio:

```sql
-- Ejecutar en MySQL
CREATE DATABASE IF NOT EXISTS wspbot_auth;
CREATE DATABASE IF NOT EXISTS wspbot_tenants;
CREATE DATABASE IF NOT EXISTS wspbot_turns;
CREATE DATABASE IF NOT EXISTS wspbot_whatsapp;
CREATE DATABASE IF NOT EXISTS wspbot_notifications;
CREATE DATABASE IF NOT EXISTS wspbot_analytics;

-- Crear usuario
CREATE USER 'wspbot'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON wspbot_auth.* TO 'wspbot'@'%';
GRANT ALL PRIVILEGES ON wspbot_tenants.* TO 'wspbot'@'%';
GRANT ALL PRIVILEGES ON wspbot_turns.* TO 'wspbot'@'%';
GRANT ALL PRIVILEGES ON wspbot_whatsapp.* TO 'wspbot'@'%';
GRANT ALL PRIVILEGES ON wspbot_notifications.* TO 'wspbot'@'%';
GRANT ALL PRIVILEGES ON wspbot_analytics.* TO 'wspbot'@'%';
FLUSH PRIVILEGES;
```

## 🌐 Plesk Configuration

### 1. Create Domains

In Plesk control panel:

1. **Main Domain**: `yourdomain.com`
   - Document root: `/var/www/wspbot/frontend/admin-panel/dist`
   - PHP: Disabled (static files only)

2. **API Subdomain**: `api.yourdomain.com`
   - Document root: `/var/www/wspbot`
   - PHP: Disabled
   - Proxy: Enable reverse proxy to `http://localhost:8080`

3. **Admin Subdomain**: `admin.yourdomain.com`
   - Document root: `/var/www/wspbot/frontend/admin-panel/dist`
   - PHP: Disabled

4. **WAHA Subdomain**: `waha.yourdomain.com`
   - Document root: `/var/www/wspbot`
   - PHP: Disabled
   - Proxy: Enable reverse proxy to `http://localhost:3000`

### 2. SSL Certificates

Enable Let's Encrypt SSL for all domains:
- Go to **SSL/TLS Certificates**
- Click **Let's Encrypt**
- Enable for all domains
- Enable **Redirect from HTTP to HTTPS**

### 3. Firewall Configuration

In Plesk:
1. Go to **Tools & Settings** → **Firewall**
2. Allow ports:
   - 80 (HTTP)
   - 443 (HTTPS)
   - 22 (SSH)

## 🐳 Docker Services

### Start Services
```bash
# Start all services
sudo systemctl start wspbot

# Check status
sudo systemctl status wspbot

# View logs
sudo journalctl -u wspbot -f
```

### Service Management
```bash
# Stop services
sudo systemctl stop wspbot

# Restart services
sudo systemctl restart wspbot

# Enable auto-start
sudo systemctl enable wspbot
```

## 📊 Monitoring

### Health Checks
```bash
# Check service health
curl https://api.yourdomain.com/health

# Check WAHA status
curl https://waha.yourdomain.com/api/sessions

# Check admin panel
curl https://admin.yourdomain.com
```

### Log Monitoring
```bash
# Application logs
sudo journalctl -u wspbot -f

# Docker logs
docker-compose -f /var/www/wspbot/docker-compose.production.yml logs -f

# MySQL logs
docker logs wspbot-mysql

# Redis logs
docker logs wspbot-redis
```

## 🔄 Backup Strategy

### Automated Backups
The deployment script creates automated daily backups:

```bash
# Manual backup
/usr/local/bin/wspbot-backup

# Backup location
/var/backups/wspbot/
```

### Backup Contents
- MySQL databases (all services)
- Redis data
- Application files
- Configuration files

### Restore from Backup
```bash
# Restore MySQL
docker exec -i wspbot-mysql mysql -u root -p < /var/backups/wspbot/mysql_backup_YYYYMMDD_HHMMSS.sql

# Restore Redis
docker cp /var/backups/wspbot/redis_backup_YYYYMMDD_HHMMSS.rdb wspbot-redis:/data/dump.rdb
docker restart wspbot-redis

# Restore application
tar -xzf /var/backups/wspbot/app_data_YYYYMMDD_HHMMSS.tar.gz -C /var/www/wspbot/
```

## 🔧 Maintenance

### Update Application
```bash
cd /var/www/wspbot
git pull origin main
docker-compose -f docker-compose.production.yml build
sudo systemctl restart wspbot
```

### Database Maintenance
```bash
# Connect to MySQL
docker exec -it wspbot-mysql mysql -u wspbot -p

# Optimize databases
docker exec wspbot-mysql mysqlcheck -u wspbot -p --optimize --all-databases
```

### Clean Up
```bash
# Remove unused Docker images
docker image prune -f

# Remove unused volumes
docker volume prune -f

# Clean old logs
sudo journalctl --vacuum-time=30d
```

## 🚨 Troubleshooting

### Common Issues

#### Services Not Starting
```bash
# Check Docker status
sudo systemctl status docker

# Check service logs
sudo journalctl -u wspbot -n 50

# Restart Docker
sudo systemctl restart docker
```

#### Database Connection Issues
```bash
# Check MySQL container
docker logs wspbot-mysql

# Test connection
docker exec wspbot-mysql mysql -u wspbot -p -e "SHOW DATABASES;"
```

#### SSL Certificate Issues
```bash
# Check Traefik logs
docker logs wspbot-traefik

# Renew certificates manually
docker exec wspbot-traefik traefik --configFile=/etc/traefik/traefik.yml
```

### Performance Optimization

#### MySQL Tuning
```bash
# Monitor MySQL performance
docker exec wspbot-mysql mysqladmin -u root -p status

# Check slow queries
docker exec wspbot-mysql mysql -u root -p -e "SHOW VARIABLES LIKE 'slow_query_log%';"
```

#### Redis Monitoring
```bash
# Check Redis memory usage
docker exec wspbot-redis redis-cli info memory

# Monitor Redis performance
docker exec wspbot-redis redis-cli monitor
```

## 📞 Support

### Log Locations
- Application logs: `sudo journalctl -u wspbot`
- Docker logs: `docker logs <container-name>`
- Plesk logs: `/var/log/plesk/`

### Useful Commands
```bash
# Check all containers
docker ps -a

# Check resource usage
docker stats

# Check disk usage
df -h

# Check memory usage
free -h
```

## 🔐 Security Considerations

### Firewall
- Only allow necessary ports
- Use fail2ban for SSH protection
- Regular security updates

### Database Security
- Use strong passwords
- Regular backups
- Monitor access logs

### Application Security
- Keep dependencies updated
- Use HTTPS everywhere
- Regular security audits
