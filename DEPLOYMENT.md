# 🚀 Guía de Despliegue en Servidor

Esta guía te ayudará a desplegar WSPBot en tu servidor de producción.

## 📋 Requisitos Previos

- Servidor con Ubuntu/Debian (recomendado)
- Docker y Docker Compose instalados
- Git instalado
- Puerto 3000, 3001, 3004 y 6379 disponibles
- Acceso SSH al servidor

## 🔧 Instalación Inicial

### 1. Instalar Docker y Docker Compose

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Agregar usuario a grupo docker (reemplazar 'usuario' con tu usuario)
sudo usermod -aG docker usuario

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalación
docker --version
docker-compose --version
```

### 2. Clonar el Repositorio

```bash
# Ir a directorio de proyectos
cd /home/usuario/proyectos  # o donde prefieras

# Clonar repositorio
git clone https://github.com/TU-USUARIO/wspbot.git
cd wspbot
```

### 3. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp env.example .env

# Editar variables de entorno
nano .env
```

Configura las siguientes variables importantes:

```env
# Base de datos (si usas una externa)
DB_HOST=tu-host-db
DB_PORT=3306
DB_NAME=wspbot_auth
DB_USER=tu-usuario
DB_PASSWORD=tu-password-segura

# JWT - CAMBIAR ESTA CLAVE
JWT_SECRET=genera-una-clave-super-secreta-aqui

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# WAHA
WAHA_BASE_URL=http://waha:3000

# Domains (si tienes)
CORS_ORIGIN=https://tudominio.com
```

### 4. Desplegar

```bash
# Opción A: Usar script de despliegue
./deploy.sh

# Opción B: Manual
docker-compose build
docker-compose up -d
```

## 📊 Verificar Despliegue

```bash
# Ver logs
docker-compose logs -f

# Ver estado de contenedores
docker-compose ps

# Verificar servicios
curl http://localhost:3001/health
curl http://localhost:3004/health
```

## 🔄 Actualizar Código

```bash
# Ir al directorio del proyecto
cd /home/usuario/proyectos/wspbot

# Actualizar desde GitHub
git pull origin main

# Reconstruir y redeployar
docker-compose down
docker-compose build
docker-compose up -d
```

## 🌐 Configurar Nginx (Recomendado)

Para exponer los servicios al mundo con HTTPS:

### 1. Instalar Nginx

```bash
sudo apt install nginx certbot python3-certbot-nginx
```

### 2. Configurar Nginx

Crear archivo `/etc/nginx/sites-available/wspbot`:

```nginx
# API Gateway
server {
    listen 80;
    server_name api.tudominio.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# WAHA
server {
    listen 80;
    server_name waha.tudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Activar y Habilitar HTTPS

```bash
# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/wspbot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Obtener certificado SSL
sudo certbot --nginx -d api.tudominio.com -d waha.tudominio.com
```

## 🔒 Seguridad

### Firewall (UFW)

```bash
# Permitir SSH
sudo ufw allow 22/tcp

# Permitir HTTP y HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Activar firewall
sudo ufw enable
```

### Backup

```bash
# Backup de volúmenes Docker
docker run --rm -v wspbot_waha_data:/data -v $(pwd):/backup alpine tar czf /backup/waha_backup.tar.gz /data
```

### Logs

```bash
# Ver logs de un servicio específico
docker-compose logs -f wspbot-app

# Limpiar logs antiguos
docker system prune -f
```

## 📝 Comandos Útiles

```bash
# Iniciar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Ver logs
docker-compose logs -f

# Reiniciar un servicio específico
docker-compose restart wspbot-app

# Entrar a un contenedor
docker exec -it wspbot-app sh

# Actualizar sin downtime (rolling update)
docker-compose up -d --scale wspbot-app=2
docker-compose up -d --scale wspbot-app=1
```

## 🐛 Troubleshooting

### Los servicios no inician

```bash
# Ver logs detallados
docker-compose logs

# Verificar puertos
netstat -tulpn | grep -E '3000|3001|3004|6379'
```

### Reiniciar desde cero

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Limpiar Docker

```bash
docker system prune -a
docker volume prune
```

## 📧 Monitoreo

Considera agregar:

- **PM2** o **supervisor** para monitoreo de procesos
- **LetsEncrypt** para SSL automático
- **Fail2ban** para protección contra fuerza bruta
- **Logwatch** para reportes de logs

## 🎯 Próximos Pasos

1. Configurar base de datos externa
2. Implementar autenticación real
3. Agregar monitoreo (Prometheus/Grafana)
4. Configurar backups automáticos
5. Implementar CI/CD con GitHub Actions

---

¿Problemas? Abre un issue en GitHub o consulta la documentación.
