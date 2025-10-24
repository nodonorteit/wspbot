# WhatsApp Bot Multi-Tenant - Configuración Manual de Plesk

## 🎯 Configuración Manual desde el Panel de Plesk

Esta guía te llevará paso a paso para configurar el WhatsApp Bot Multi-Tenant desde el panel web de Plesk, usando la base de datos del hosting en lugar de contenedores.

## 📋 Prerrequisitos

- Servidor Ubuntu con Plesk instalado
- WhatsApp Bot Multi-Tenant desplegado con `deploy.sh`
- Acceso al panel de Plesk (https://tu-servidor:8443)
- Dominio principal configurado

## 🗄️ Paso 1: Configurar Base de Datos desde Plesk

### 1.1 Acceder a Bases de Datos
1. Ve a `https://tu-servidor:8443`
2. Inicia sesión con tus credenciales de administrador
3. Ve a **"Bases de Datos"** en el menú principal

### 1.2 Crear Base de Datos Principal
1. Haz clic en **"Crear Base de Datos"**
2. Configura:
   - **Nombre**: `wspbot_main`
   - **Usuario**: `wspbot_user`
   - **Contraseña**: Genera una contraseña segura
   - **Tipo**: MySQL
3. Haz clic en **"Aceptar"**

### 1.3 Crear Bases de Datos para Servicios
Repite el proceso para crear estas bases de datos adicionales:

| Base de Datos | Usuario | Descripción |
|---------------|---------|-------------|
| `wspbot_auth` | `wspbot_user` | Servicio de autenticación |
| `wspbot_tenants` | `wspbot_user` | Gestión de tenants |
| `wspbot_turns` | `wspbot_user` | Sistema de turnos |
| `wspbot_whatsapp` | `wspbot_user` | Datos de WhatsApp |
| `wspbot_notifications` | `wspbot_user` | Sistema de notificaciones |
| `wspbot_analytics` | `wspbot_user` | Análisis y métricas |

### 1.4 Configurar Permisos
Para cada base de datos:
1. Haz clic en la base de datos
2. Ve a la pestaña **"Usuarios"**
3. Asigna el usuario `wspbot_user` con permisos completos
4. Haz clic en **"Aceptar"**

## 🌐 Paso 2: Crear Subdominios

### 2.1 Acceder al Panel de Plesk
1. Ve a **"Dominios"** en el menú principal
2. Haz clic en tu dominio principal

### 2.2 Crear Subdominio para API
1. Ve a la pestaña **"Subdominios"**
2. Haz clic en **"Crear Subdominio"**
3. Configura:
   - **Nombre**: `api`
   - **Document Root**: `/var/www/wspbot`
   - **PHP**: Deshabilitado
   - **SSL**: Habilitado
4. Haz clic en **"Aceptar"**

### 2.3 Crear Subdominio para Admin
1. Haz clic en **"Crear Subdominio"** nuevamente
2. Configura:
   - **Nombre**: `admin`
   - **Document Root**: `/var/www/wspbot/frontend/admin-panel/dist`
   - **PHP**: Deshabilitado
   - **SSL**: Habilitado
3. Haz clic en **"Aceptar"**

### 2.4 Crear Subdominio para WAHA
1. Haz clic en **"Crear Subdominio"** nuevamente
2. Configura:
   - **Nombre**: `waha`
   - **Document Root**: `/var/www/wspbot`
   - **PHP**: Deshabilitado
   - **SSL**: Habilitado
3. Haz clic en **"Aceptar"**

## 🔄 Paso 3: Configurar Reverse Proxy

### 3.1 Configurar Proxy para API
1. Ve al subdominio `api.tudominio.com`
2. Ve a **"Hosting y DNS"** → **"Configuración de Hosting"**
3. Marca **"Proxy"**
4. Configura:
   - **Proxy Host**: `localhost`
   - **Proxy Port**: `8080`
   - **Proxy Scheme**: `http`
5. Haz clic en **"Aceptar"**

### 3.2 Configurar Proxy para WAHA
1. Ve al subdominio `waha.tudominio.com`
2. Ve a **"Hosting y DNS"** → **"Configuración de Hosting"**
3. Marca **"Proxy"**
4. Configura:
   - **Proxy Host**: `localhost`
   - **Proxy Port**: `3000`
   - **Proxy Scheme**: `http`
5. Haz clic en **"Aceptar"**

## 🔒 Paso 4: Configurar Certificados SSL

### 4.1 Habilitar Let's Encrypt para Dominio Principal
1. Ve a tu dominio principal
2. Ve a **"SSL/TLS Certificates"**
3. Haz clic en **"Let's Encrypt"**
4. Configura:
   - **Email**: `admin@tudominio.com`
   - **Include www subdomain**: Marcado
5. Haz clic en **"Obtener"**

### 4.2 Habilitar Let's Encrypt para Subdominios
Repite el proceso para cada subdominio:
- `api.tudominio.com`
- `admin.tudominio.com`
- `waha.tudominio.com`

### 4.3 Habilitar Redirección HTTPS
Para cada dominio/subdominio:
1. Ve a **"SSL/TLS Certificates"**
2. Marca **"Redirigir de HTTP a HTTPS"**
3. Haz clic en **"Aplicar"**

## 🔧 Paso 5: Configurar Variables de Entorno

### 5.1 Acceder al Servidor
1. Conecta por SSH al servidor
2. Ve a `/var/www/wspbot`

### 5.2 Actualizar Archivo .env
Edita el archivo `.env` con los datos de tu base de datos:

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

# ===== DOMAIN CONFIGURATION =====
DOMAIN=tudominio.com
API_DOMAIN=api.tudominio.com
ADMIN_DOMAIN=admin.tudominio.com
WAHA_DOMAIN=waha.tudominio.com

# ===== REDIS CONFIGURATION =====
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=tu_contraseña_redis

# ===== WAHA CONFIGURATION =====
WAHA_BASE_URL=http://localhost:3000

# ===== JWT CONFIGURATION =====
JWT_SECRET=tu-jwt-secret-super-seguro-y-largo

# ===== CORS CONFIGURATION =====
CORS_ORIGIN=https://admin.tudominio.com,https://api.tudominio.com
```

### 5.3 Reiniciar Servicios
```bash
# Reiniciar el bot
sudo systemctl restart wspbot

# Verificar estado
sudo systemctl status wspbot
```

## 🔥 Paso 6: Configurar Firewall

### 6.1 Acceder al Firewall
1. Ve a **"Herramientas y Configuración"** → **"Firewall"**
2. Haz clic en **"Reglas de Firewall"**

### 6.2 Crear Reglas
Agrega estas reglas:

| Puerto | Protocolo | Acción | Descripción |
|--------|-----------|--------|-------------|
| 22 | TCP | Permitir | SSH |
| 80 | TCP | Permitir | HTTP |
| 443 | TCP | Permitir | HTTPS |
| 8080 | TCP | Permitir | API Gateway |
| 3000 | TCP | Permitir | WAHA API |
| 6379 | TCP | Permitir | Redis |

## 📊 Paso 7: Configurar Monitoreo

### 7.1 Habilitar Logs
Para cada dominio/subdominio:
1. Ve a **"Logs"**
2. Marca **"Habilitar logs de acceso"**
3. Marca **"Habilitar logs de error"**

### 7.2 Configurar Rotación de Logs
1. Ve a **"Herramientas y Configuración"** → **"Configuración de Logs"**
2. Configura:
   - **Rotación**: Diaria
   - **Retención**: 30 días
   - **Compresión**: Habilitada

## 🔄 Paso 8: Configurar Backups

### 8.1 Acceder a Backups
1. Ve a **"Herramientas y Configuración"** → **"Copias de Seguridad"**
2. Haz clic en **"Crear Copia de Seguridad"**

### 8.2 Configurar Backup Automático
1. Ve a **"Configuración de Copias de Seguridad"**
2. Configura:
   - **Frecuencia**: Diaria
   - **Hora**: 02:00
   - **Incluir**: Bases de datos + Archivos
   - **Destino**: Local
3. Haz clic en **"Aplicar"**

## 🧪 Paso 9: Probar Configuración

### 9.1 Verificar Dominios
Prueba estos URLs en tu navegador:

- `https://tudominio.com` - Panel principal
- `https://api.tudominio.com/health` - API Gateway
- `https://admin.tudominio.com` - Panel de administración
- `https://waha.tudominio.com/api/sessions` - WAHA API

### 9.2 Verificar SSL
1. Haz clic en el candado en la barra de direcciones
2. Verifica que el certificado sea válido
3. Confirma que la redirección HTTP → HTTPS funcione

### 9.3 Verificar Base de Datos
1. Ve a **"Bases de Datos"** en Plesk
2. Haz clic en **"phpMyAdmin"** para cada base de datos
3. Verifica que puedas conectarte y ver las tablas

## 🚨 Solución de Problemas

### Problema: No se puede conectar a la base de datos
**Solución:**
1. Verifica las credenciales en el archivo `.env`
2. Confirma que el usuario tenga permisos en todas las bases de datos
3. Revisa que el puerto 3306 esté abierto

### Problema: Subdominio no carga
**Solución:**
1. Verifica que el DNS esté propagado
2. Revisa la configuración del proxy
3. Confirma que los puertos estén abiertos

### Problema: SSL no funciona
**Solución:**
1. Verifica que Let's Encrypt esté habilitado
2. Confirma que el dominio apunte al servidor
3. Revisa los logs de SSL en Plesk

### Problema: Proxy no funciona
**Solución:**
1. Verifica que el servicio esté corriendo
2. Confirma los puertos en la configuración
3. Revisa los logs de Nginx

## 📋 Checklist Final

- [ ] Bases de datos creadas en Plesk
- [ ] Usuarios de base de datos configurados
- [ ] Subdominios creados (api, admin, waha)
- [ ] Reverse proxy configurado
- [ ] SSL habilitado para todos los dominios
- [ ] Variables de entorno actualizadas
- [ ] Firewall configurado
- [ ] Logs habilitados
- [ ] Backups configurados
- [ ] Servicios reiniciados
- [ ] URLs probadas y funcionando
- [ ] Conexión a base de datos verificada

## 🎉 ¡Configuración Completada!

Una vez completados todos los pasos, tu WhatsApp Bot Multi-Tenant estará completamente configurado y funcionando en Plesk con:

- ✅ Base de datos del hosting configurada
- ✅ SSL automático
- ✅ Dominios configurados
- ✅ Proxy funcionando
- ✅ Monitoreo habilitado
- ✅ Backups automáticos
- ✅ Seguridad configurada

**Próximo paso**: Accede a `https://admin.tudominio.com` para configurar tu primer tenant y conectar WhatsApp.

## 💡 Ventajas de usar la Base de Datos del Hosting

- **Gestión Centralizada**: Administra todas las bases de datos desde Plesk
- **Backups Automáticos**: Los backups se incluyen en el plan de hosting
- **Seguridad Integrada**: Firewall y seguridad gestionados por Plesk
- **Escalabilidad**: Fácil escalado según las necesidades
- **Monitoreo**: Herramientas de monitoreo integradas
- **Soporte**: Soporte técnico del proveedor de hosting
- **Costo**: No necesitas recursos adicionales para contenedores de base de datos
