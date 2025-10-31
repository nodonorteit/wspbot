# 🚀 Desplegar WSPBot en tu Servidor

## ✅ Repositorio Actualizado

El código ya está actualizado en GitHub: https://github.com/nodonorteit/wspbot

## 📋 Pasos para Desplegar

### 1️⃣ Conectarte a tu Servidor

```bash
ssh usuario@tu-servidor.com
```

### 2️⃣ Instalar Prerrequisitos (si no están)

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker (si no está instalado)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Agregar usuario a grupo docker
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Reiniciar sesión para aplicar cambios de grupo
exit
ssh usuario@tu-servidor.com
```

### 3️⃣ Clonar el Repositorio

```bash
# Ir a directorio donde quieres el proyecto
cd /home/usuario/proyectos  # o donde prefieras

# Clonar repositorio
git clone https://github.com/nodonorteit/wspbot.git
cd wspbot
```

### 4️⃣ Configurar el Proyecto

```bash
# Ejecutar setup
./setup.sh
```

### 5️⃣ Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp env.example .env

# Editar variables
nano .env
```

**Variables importantes:**

```env
# JWT Secret - GENERA UNA CLAVE SEGURA
JWT_SECRET=tu-clave-super-secreta-aqui

# Base de datos (si tienes MySQL externo)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=wspbot_auth
DB_USER=usuario_db
DB_PASSWORD=password_segura

# CORS (tu dominio en producción)
CORS_ORIGIN=https://api.tudominio.com,https://tudominio.com
```

**Para generar JWT_SECRET:**
```bash
openssl rand -base64 32
```

### 6️⃣ Desplegar

```bash
# Ejecutar script de despliegue
./deploy.sh
```

O manualmente:
```bash
docker-compose build
docker-compose up -d
```

### 7️⃣ Verificar

```bash
# Ver logs
docker-compose logs -f

# Ver estado
docker-compose ps

# Probar servicios
curl http://localhost:3001/health
curl http://localhost:3004/health
```

## 🌐 Exponer al Mundo (Opcional)

Si quieres que sea accesible desde Internet:

### Con Nginx + Let's Encrypt

```bash
# Instalar Nginx
sudo apt install nginx

# Crear configuración
sudo nano /etc/nginx/sites-available/wspbot
```

Contenido:
```nginx
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
```

Activar:
```bash
sudo ln -s /etc/nginx/sites-available/wspbot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL con Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.tudominio.com
```

## 🔄 Actualizar Código

```bash
cd /path/to/wspbot
git pull origin main
./deploy.sh
```

## 🛑 Detener Servicios

```bash
docker-compose down
```

## 📊 Comandos Útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f wspbot-app

# Reiniciar un servicio
docker-compose restart wspbot-app

# Ver uso de recursos
docker stats

# Acceder a un contenedor
docker exec -it wspbot-app sh
```

## 🐛 Troubleshooting

### Error: "Permission denied"

```bash
# Dar permisos a scripts
chmod +x setup.sh deploy.sh

# Verificar que usuario está en grupo docker
groups
# Debe mostrar 'docker'
```

### Puerto ocupado

```bash
# Ver qué está usando los puertos
netstat -tulpn | grep -E '3000|3001|3004'

# Cambiar puertos en docker-compose.yml si es necesario
```

### Servicios no inician

```bash
# Ver logs detallados
docker-compose logs

# Reconstruir desde cero
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## 🔐 Seguridad

Antes de ir a producción:
- ✅ Configurar firewall
- ✅ Usar HTTPS
- ✅ Backups automáticos
- ✅ Monitoreo de logs
- ✅ Credenciales seguras

## 📚 Documentación

- [README.md](./README.md) - General
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Despliegue detallado
- [INSTRUCTIONS.md](./INSTRUCTIONS.md) - Instrucciones
- [QUICK_START_SERVER.md](./QUICK_START_SERVER.md) - Inicio rápido

---

✅ **¿Listo? Sigue los pasos arriba y tu WSPBot estará corriendo!**
