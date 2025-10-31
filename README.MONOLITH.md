# WSPBot - Monolithic Container Setup

Esta versión del proyecto está configurada para ejecutarse en un **único contenedor Docker** con todos los servicios integrados.

## 🏗️ Arquitectura Simplificada

- **Contenedor único**: Todos los microservicios en un solo contenedor
- **WAHA**: WhatsApp HTTP API externa (contenedor separado)
- **Redis**: Cache y colas (contenedor separado)
- **wspbot-app**: Aplicación monolítica con Auth Service y WhatsApp Service

## 🚀 Inicio Rápido

### 1. Construir la imagen

```bash
docker-compose build
```

### 2. Iniciar todos los servicios

```bash
docker-compose up -d
```

### 3. Ver logs

```bash
docker-compose logs -f wspbot-app
```

### 4. Verificar que está funcionando

```bash
# Health check del Auth Service
curl http://localhost:3001/health

# Health check del WhatsApp Service
curl http://localhost:3004/health
```

## 📋 Servicios Disponibles

### Auth Service
- **Puerto**: 3001
- **Endpoints**:
  - `POST /api/auth/login` - Iniciar sesión
  - `POST /api/auth/register` - Registrarse
  - `POST /api/auth/refresh` - Refrescar token
  - `GET /health` - Health check

### WhatsApp Service
- **Puerto**: 3004
- **Endpoints**:
  - `GET /api/sessions/:tenantId/status` - Estado de sesión
  - `POST /api/sessions/:tenantId/start` - Iniciar sesión WhatsApp
  - `GET /api/sessions/:tenantId/qr` - Obtener QR code
  - `GET /health` - Health check

### WAHA
- **Puerto**: 3000
- **Documentación**: http://localhost:3000/docs

### Redis
- **Puerto**: 6379
- **Uso**: Cache y colas de mensajes

## 🔧 Variables de Entorno

Crea un archivo `.env` con las siguientes variables:

```env
# Database (si usas base de datos externa)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=wspbot_auth
DB_USER=wspbot
DB_PASSWORD=password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# WAHA
WAHA_BASE_URL=http://waha:3000
```

## 🛠️ Desarrollo

Para desarrollo local sin Docker:

```bash
# Instalar dependencias
npm install

# Iniciar todos los servicios
npm run start:all

# O solo desarrollo
npm run dev
```

## 📦 Estructura del Contenedor

```
/app
├── services/
│   ├── auth-service/
│   │   ├── src/
│   │   └── dist/
│   └── whatsapp-service/
│       ├── src/
│       └── dist/
├── shared/
│   └── types/
└── node_modules/
```

## 🔄 Migración Futura

Cuando necesites escalar o separar los servicios:

1. Cada cliente puede tener su propio contenedor
2. Migra a microservicios independientes
3. Usa `docker-compose.production.yml` como referencia

## 🐛 Troubleshooting

### Los servicios no inician
```bash
# Ver logs detallados
docker-compose logs wspbot-app

# Reconstruir desde cero
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Puerto ya en uso
Modifica los puertos en `docker-compose.yml` si necesitas usar diferentes puertos.

### Problemas de permisos
```bash
# En Linux/Mac
chmod +x start-dev.js
```

## 📝 Notas

- Esta versión usa **Concurrently** para ejecutar múltiples servicios en el mismo contenedor
- Los logs se muestran en la consola con prefijos de color
- WAHA y Redis están en contenedores separados para facilitar el reinicio del app
