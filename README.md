# WSPBot - WhatsApp Bot Multi-Tenant

Sistema de gestión de turnos con WhatsApp - Arquitectura monolítica simplificada.

## 🏗️ Arquitectura

```
wspbot/
├── services/
│   ├── auth-service/         # Autenticación y autorización
│   └── whatsapp-service/     # Integración con WAHA
├── shared/
│   └── types/                # Tipos TypeScript compartidos
├── infrastructure/
│   ├── mysql/                # Configuración MySQL
│   └── redis/                # Configuración Redis
├── docs/                     # Documentación
├── docker-compose.yml        # Orquestación Docker
├── Dockerfile               # Imagen monolítica
└── package.json             # Configuración npm workspaces
```

## 🚀 Inicio Rápido

### Despliegue en Servidor (Producción)

```bash
# 1. Clonar repositorio
git clone https://github.com/TU-USUARIO/wspbot.git
cd wspbot

# 2. Configurar
./setup.sh
cp env.example .env
nano .env  # Editar variables

# 3. Desplegar
./deploy.sh
```

📖 **[Ver guía completa de despliegue →](./DEPLOYMENT.md)**

### Usando Docker (Local)

```bash
# Construir y levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev

# Iniciar en producción
npm run start:all
```

## 📋 Servicios

### Auth Service (Puerto 3001)
- Autenticación JWT
- Registro de usuarios
- Gestión de sesiones
- Endpoint: `/api/auth/*`

### WhatsApp Service (Puerto 3004)
- Integración con WAHA
- Gestión de sesiones WhatsApp por tenant
- Envío de mensajes
- Webhooks
- Endpoint: `/api/sessions/*`

### WAHA (Puerto 3000)
- WhatsApp HTTP API
- Administración de sesiones WhatsApp
- Documentación: http://localhost:3000/docs

### Redis (Puerto 6379)
- Cache de sesiones
- Colas de mensajes

## 🔧 Configuración

Crea un archivo `.env` basado en `env.example`:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=wspbot_auth
DB_USER=wspbot
DB_PASSWORD=password

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# WAHA
WAHA_BASE_URL=http://waha:3000
```

## 📦 Estructura de Contenedores

La aplicación corre en **3 contenedores**:
1. **waha** - WhatsApp HTTP API
2. **redis** - Cache y colas
3. **wspbot-app** - Aplicación monolítica con todos los servicios

## 🔄 Escalamiento

Cada cliente puede tener su propio contenedor `wspbot-app`:

```bash
docker-compose up -d --scale wspbot-app=3
```

## 📚 Documentación Adicional

- [README.MONOLITH.md](./README.MONOLITH.md) - Guía detallada de la arquitectura monolítica
- [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Guía de despliegue

## 🛠️ Tecnologías

- **Backend**: Node.js + TypeScript + Express
- **Database**: MySQL 8.0 (opcional, externa)
- **Cache**: Redis
- **WhatsApp**: WAHA (devlikeapro/waha)
- **Container**: Docker + Docker Compose
- **Orquestation**: Concurrently para ejecutar múltiples servicios

## 📄 Licencia

MIT

## 👤 Autor

nodonorteit

## 📞 Soporte

Para más información, consulta la [documentación](./docs/) o abre un issue.