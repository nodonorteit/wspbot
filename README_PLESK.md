# ⚡ WSPBot para Plesk - Quick Start

## Instalación en 3 pasos

### 1️⃣ Subir código

```bash
ssh usuario@tu-servidor.com
cd /var/www/vhosts/tudominio.com/httpdocs
git clone https://github.com/nodonorteit/wspbot.git .
npm install
```

### 2️⃣ Configurar en Plesk

- Ve a tu dominio → **Node.js**
- ✅ Habilitar Node.js
- 📄 Application Startup File: `app.js`
- 🏠 Application Root: `/`
- Click **"Run npm install"**
- Click **"Restart application"**

### 3️⃣ Variables de entorno

En Plesk Node.js → Variables:

```env
NODE_ENV=production
JWT_SECRET=tu-clave-secreta-generar
DB_HOST=localhost
DB_NAME=nombre_bd
DB_USER=usuario_bd
DB_PASSWORD=password_bd
```

**Generar JWT_SECRET:** `openssl rand -base64 32`

## ✅ Verificar

```
curl https://tudominio.com/health
```

## 🐛 Problemas

**App no inicia:**
```bash
tail -f ~/logs/nodejs.log
```

**Reinstalar dependencias:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentación

- **[PLESK_DEPLOYMENT.md](PLESK_DEPLOYMENT.md)** - Guía completa detallada
- **[README.md](README.md)** - Documentación general

---

✅ ¡Listo! Bot corriendo en Plesk 🎉
