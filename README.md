# WhatsApp Bot Multi-Tenant - Microservices Architecture

Sistema completo de gestión de turnos con WhatsApp usando arquitectura de microservicios.

## 🏗️ Arquitectura

```
wspbot-microservices/
├── services/
│   ├── api-gateway/          # API Gateway (Kong/Nginx)
│   ├── auth-service/         # Autenticación y autorización
│   ├── tenant-service/       # Gestión de tenants
│   ├── turns-service/        # Gestión de turnos
│   ├── whatsapp-service/     # Integración con WAHA
│   ├── notifications-service/ # Notificaciones y scheduling
│   └── analytics-service/    # Analytics y reportes
├── frontend/
│   ├── admin-panel/          # Panel de administración
│   ├── tenant-dashboard/     # Dashboard por tenant
│   └── mobile-app/           # App móvil (opcional)
├── shared/
│   ├── types/                # Tipos TypeScript compartidos
│   ├── utils/                # Utilidades compartidas
│   └── database/             # Configuración de BD
├── infrastructure/
│   ├── docker/               # Docker configs
│   ├── kubernetes/           # K8s manifests
│   └── monitoring/           # Prometheus, Grafana
└── docs/                     # Documentación
```

## 🚀 Servicios

### 1. **API Gateway**
- **Tecnología**: Kong/Nginx + Express
- **Responsabilidad**: Routing, rate limiting, autenticación
- **Puerto**: 3000

### 2. **Auth Service**
- **Tecnología**: Node.js + Express + JWT
- **Responsabilidad**: Autenticación, autorización, gestión de usuarios
- **Puerto**: 3001

### 3. **Tenant Service**
- **Tecnología**: Node.js + Express + Prisma
- **Responsabilidad**: CRUD de tenants, configuración multi-tenant
- **Puerto**: 3002

### 4. **Turns Service**
- **Tecnología**: Node.js + Express + Prisma
- **Responsabilidad**: Gestión de turnos, disponibilidad, reservas
- **Puerto**: 3003

### 5. **WhatsApp Service**
- **Tecnología**: Node.js + Express + WAHA API
- **Responsabilidad**: Integración con WhatsApp, envío de mensajes
- **Puerto**: 3004

### 6. **Notifications Service**
- **Tecnología**: Node.js + Express + Bull Queue
- **Responsabilidad**: Notificaciones programadas, emails, SMS
- **Puerto**: 3005

### 7. **Analytics Service**
- **Tecnología**: Node.js + Express + ClickHouse
- **Responsabilidad**: Métricas, reportes, dashboards
- **Puerto**: 3006

## 🗄️ Base de Datos

- **MySQL 8.0**: Datos principales (tenants, usuarios, turnos)
- **Redis**: Cache, sesiones, colas de trabajo
- **ClickHouse**: Analytics y métricas (opcional)

## 🔧 Tecnologías

- **Backend**: Node.js + TypeScript + Express
- **Frontend**: React + TypeScript + Tailwind CSS
- **Database**: MySQL 8.0 + Prisma ORM
- **Cache**: Redis
- **Queue**: Bull Queue + Redis
- **Monitoring**: Prometheus + Grafana
- **Container**: Docker + Docker Compose
- **Orchestration**: Kubernetes (opcional)

## 📦 Instalación

### Desarrollo Rápido
```bash
# Clonar repositorio
git clone https://github.com/nodonorteit/wspbot.git
cd wspbot

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env

# Iniciar entorno de desarrollo
node start-dev.js
```

### Desarrollo Completo
```bash
# Instalar dependencias de todos los servicios
npm run install:all

# Iniciar todos los servicios
npm run dev

# O iniciar servicios individualmente
npm run dev:services
npm run dev:frontend
```

### Producción con Docker
```bash
# Construir y ejecutar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar servicios
docker-compose down
```

## 🌐 URLs

- **API Gateway**: http://localhost:8080
- **Admin Panel**: http://localhost:3006
- **Tenant Dashboard**: http://localhost:3007
- **API Docs**: http://localhost:8080/docs
- **phpMyAdmin**: http://localhost:8081 (development only)

## 🔐 Autenticación Multi-Tenant

### **¿Cómo funciona la autenticación WhatsApp?**

Cada tenant tiene su **propia sesión de WhatsApp independiente**:

1. **Admin del Tenant** se loguea → JWT con `tenantId`
2. Va a configuración → "Conectar WhatsApp"
3. Sistema genera QR único para ese tenant
4. Admin escanea QR con SU número de WhatsApp
5. Sesión queda vinculada al tenant específico

### **Flujo de Autenticación:**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Tenant A      │    │   Tenant B      │    │   Tenant C      │
│   (Clínica)     │    │   (Veterinaria) │    │   (Salón)       │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          ▼                      ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ tenant_a_session│    │ tenant_b_session│    │ tenant_c_session│
│   WhatsApp      │    │   WhatsApp      │    │   WhatsApp      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Características:**

- **JWT Tokens** con refresh tokens
- **Multi-tenant isolation** por tenant_id
- **Role-based access** (super-admin, tenant-admin, tenant-user, end-user)
- **API Keys** para integraciones
- **Sesiones WhatsApp independientes** por tenant
- **Aislamiento completo** de datos entre tenants

## 📊 Monitoreo

- **Health checks** en cada servicio
- **Métricas** con Prometheus
- **Logs** centralizados
- **Alertas** automáticas

## 🚀 Deployment

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm run start:prod
```

### Docker
```bash
docker-compose up -d
```

### Kubernetes
```bash
kubectl apply -f infrastructure/kubernetes/
```
