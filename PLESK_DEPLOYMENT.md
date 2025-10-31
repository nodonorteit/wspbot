# 🚀 Desplegar WSPBot en Plesk (Hosting Tradicional)

## ✅ Aplicación Unificada Simplificada

WSPBot ahora corre como **una sola aplicación Express** sin necesidad de Docker ni arquitectura compleja.

## 📋 Requisitos

- Hosting con **Node.js 18+** habilitado
- Base de datos **MySQL** (la de tu hosting o externa)
- **Redis** opcional (para cache y colas)
- Acceso SSH o File Manager en Plesk

## 🚀 Pasos de Instalación

### 1️⃣ Subir Código a tu Hosting

#### Opción A: Por SSH

```bash
# Conectarte por SSH
ssh usuario@tu-servidor.com

# Ir a directorio del dominio
cd /var/www/vhosts/tudominio.com/httpdocs

# Clonar repositorio
git clone https://github.com/nodonorteit/wspbot.git .

# O si ya tienes código, actualizar:
git pull origin main
```

#### Opción B: Por File Manager en Plesk

1. Ve a **File Manager** en Plesk
2. Navega a `httpdocs` o el directorio de tu dominio
3. Sube todos los archivos del proyecto

### 2️⃣ Instalar Dependencias

#### Por SSH:

```bash
cd /var/www/vhosts/tudominio.com/httpdocs

# Instalar dependencias
npm install

# Construir TypeScript (si usas versión completa)
npm run build
```

**⚠️ Si no tienes SSH**, necesitas que Plesk haga el `npm install` automáticamente

### 3️⃣ Configurar Variables de Entorno

Crea archivo `.env` en la raíz:

```env
# Puerto (Plesk lo configura automáticamente)
PORT=3000
NODE_ENV=production

# Base de datos (de tu hosting)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=nombre_bd
DB_USER=usuario_bd
DB_PASSWORD=password_bd

# JWT Secret (genera uno seguro)
JWT_SECRET=tu-clave-super-secreta

# CORS
CORS_ORIGIN=https://tudominio.com

# Redis (opcional)
REDIS_HOST=localhost
REDIS_PORT=6379

# WAHA (si tienes servidor separado)
WAHA_BASE_URL=http://otro-servidor:3000
```

**Generar JWT_SECRET:**
```bash
openssl rand -base64 32
```

### 4️⃣ Configurar en Plesk

En el panel de Plesk:

1. Ve a tu dominio
2. Click en **"Node.js"** en el menú
3. Haz lo siguiente:

**Configuración de Node.js:**
- ✅ Habilitar Node.js
- ✅ **Application Mode**: Production
- ✅ **Application Root**: `/` (o donde esté tu proyecto)
- ✅ **Application Startup File**: `app.js`
- ✅ **Application URL**: El que prefieras (ej: `/api` o raíz)

**Variables de Entorno:**
Agrega las variables desde `.env` en el panel de Plesk

4. Click en **"Run npm install"**
5. Click en **"Restart application"**

### 5️⃣ Verificar

```bash
# Ver logs
tail -f ~/logs/nodejs.log

# Probar endpoints
curl http://tudominio.com/health
curl http://tudominio.com/api/auth/login
```

## 🔄 Actualizar Código

### Por SSH:

```bash
cd /var/www/vhosts/tudominio.com/httpdocs
git pull origin main
npm install
# Reiniciar en Plesk: Node.js > Restart
```

### Por File Manager:

1. Sube archivos nuevos
2. Ve a Node.js en Plesk
3. Click en "Restart application"

## 🌐 Estructura de URLs

Tu aplicación estará disponible en:

- **Health**: `http://tudominio.com/health`
- **API Root**: `http://tudominio.com/`
- **Auth**: `http://tudominio.com/api/auth/*`
- **WhatsApp**: `http://tudominio.com/api/sessions/*`

## 🔧 Configuración Avanzada

### HTTPS/SSL

1. Ve a **SSL/TLS Settings** en Plesk
2. Instala certificado Let's Encrypt
3. Activa **"Force HTTPS"**

### Dominio Específico para API

1. Crea subdominio `api.tudominio.com`
2. Apunta a la misma carpeta
3. En Node.js, configura como aplicación separada

### Base de Datos

1. Ve a **"Databases"** en Plesk
2. Crea base de datos MySQL
3. Usa esas credenciales en `.env`

## 🐛 Troubleshooting

### App no inicia

```bash
# Ver logs en Plesk
tail -f ~/logs/nodejs.log

# Verificar Node.js version
node --version
# Debe ser >= 18

# Verificar que app.js existe
ls -la app.js

# Verificar dependencias
npm list
```

### Puerto ocupado

Plesk configura el puerto automáticamente. No necesitas cambiarlo en `.env` si Plesk lo maneja.

### Error en imports

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Permisos

```bash
# Dar permisos correctos
chmod +x app.js
chown -R usuario:psacln .
```

## 📊 Monitoreo

### Ver Logs

```bash
# Logs de Node.js
tail -f ~/logs/nodejs.log

# Logs de aplicación (si usas winston)
tail -f ~/logs/app.log
```

### Health Check

Configura un cron job o servicio que llame a `/health` periódicamente.

## 🔐 Seguridad

✅ **Activar HTTPS** con certificado SSL
✅ **JWT_SECRET** fuerte y único
✅ **Credenciales DB** seguras
✅ **Firewall** en Plesk habilitado
✅ **Backups** automáticos de BD

## 📝 Notas Importantes

1. **Plesk maneja el puerto**: No necesitas `docker-compose` ni configurar puertos manualmente
2. **Una sola app**: Todo corre en `app.js`, no en microservicios
3. **Base de datos del hosting**: Usa la MySQL que Plesk te da
4. **Redis opcional**: Si no lo tienes, la app funciona sin él
5. **WAHA separado**: Necesitas otro servidor o servicio para WhatsApp

## 🎯 Próximos Pasos

1. ✅ App funcionando en Plesk
2. ⏭️ Conectar WhatsApp (configurar WAHA en otro servidor)
3. ⏭️ Implementar autenticación real
4. ⏭️ Configurar base de datos
5. ⏭️ Agregar frontend (opcional)

## 📚 Documentación Adicional

- [README.md](./README.md) - Documentación general
- [DEPLOY_TO_SERVER.md](./DEPLOY_TO_SERVER.md) - Deploy en servidor VPS
- [CHECKLIST.md](./CHECKLIST.md) - Checklist de verificación

---

✅ **¿Listo? Tu aplicación está corriendo en Plesk!** 🎉
