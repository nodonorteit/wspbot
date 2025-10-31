# WSPBot - WhatsApp Bot Multi-Tenant

Sistema de gestión de turnos con WhatsApp - Aplicación monolítica simplificada.

## 🚀 Instalación

### Opción 1: Hosting Plesk (Sin Docker)

```bash
# 1. Clonar repositorio
git clone https://github.com/nodonorteit/wspbot.git
cd wspbot
npm install

# 2. Configurar en Plesk
# - Ve a Node.js en tu dominio
# - Habilitar Node.js
# - Application Startup File: app.js
# - Run npm install
# - Restart application

# 3. Variables de entorno
# Crear .env o configurar en Plesk:
JWT_SECRET=tu-clave-secreta-generar-con-openssl-rand-base64-32
DB_HOST=localhost
DB_NAME=nombre_bd
DB_USER=usuario_db
DB_PASSWORD=password_db
```

**📖 [Ver guía completa de Plesk →](PLESK_DEPLOYMENT.md)**

### Opción 2: Servidor VPS (Con Docker)

```bash
# 1. Conectarte al servidor
ssh usuario@tu-servidor.com

# 2. Clonar y configurar
git clone https://github.com/nodonorteit/wspbot.git
cd wspbot
./setup.sh

# 3. Configurar variables
cp env.example .env
nano .env

# 4. Desplegar
./deploy.sh
```

**📖 [Ver guía completa de VPS →](DEPLOY_TO_SERVER.md)**

## 📋 Estructura

```
wspbot/
├── app.js                  # App principal (Plesk)
├── services/
│   ├── auth-service/       # Autenticación
│   └── whatsapp-service/   # WhatsApp
├── shared/types/           # Tipos compartidos
├── docker-compose.yml      # Docker (VPS)
└── Dockerfile             # Docker build
```

## 🔧 Endpoints

- **Health**: `GET /health`
- **Auth**: `POST /api/auth/login`, `POST /api/auth/register`
- **WhatsApp**: `GET /api/sessions/:tenantId/status`

## 🛠️ Desarrollo Local

```bash
npm install
node app.js
# App corriendo en http://localhost:3000
```

## 🔐 Seguridad

Antes de producción:
- ✅ Cambiar `JWT_SECRET`
- ✅ Configurar HTTPS
- ✅ Credenciales de BD seguras
- ✅ Firewall configurado

## 📚 Tecnologías

- Node.js + Express
- TypeScript
- MySQL
- Redis (opcional)
- WAHA (WhatsApp API)

## 📖 Documentación

- **[PLESK_DEPLOYMENT.md](PLESK_DEPLOYMENT.md)** - Despliegue en Plesk
- **[DEPLOY_TO_SERVER.md](DEPLOY_TO_SERVER.md)** - Despliegue en VPS
- **[README_PLESK.md](README_PLESK.md)** - Guía rápida Plesk

## 📞 Soporte

- Repositorio: https://github.com/nodonorteit/wspbot
- Issues: Abre un issue en GitHub

## 📄 Licencia

MIT © nodonorteit
