# 🎯 WSPBot para Plesk - Guía Rápida

## ⚡ Instalación en 3 Pasos

### 1️⃣ Subir Código

**Por SSH:**
```bash
cd /var/www/vhosts/tudominio.com/httpdocs
git clone https://github.com/nodonorteit/wspbot.git .
npm install
```

**Por File Manager:**
- Sube todos los archivos a `httpdocs`

### 2️⃣ Configurar en Plesk

1. Abre tu dominio en Plesk
2. Ve a **"Node.js"**
3. Configura:
   - ✅ Habilitar Node.js
   - 📄 Application Startup File: `app.js`
   - 🏠 Application Root: `/`
4. Click **"Run npm install"**
5. Click **"Restart application"**

### 3️⃣ Variables de Entorno

Crea `.env` o agrégala en Plesk:

```env
NODE_ENV=production
JWT_SECRET=tu-clave-secreta
DB_HOST=localhost
DB_NAME=tu_bd
DB_USER=tu_usuario
DB_PASSWORD=tu_password
```

## ✅ Verificar

```
curl https://tudominio.com/health
```

## 📖 Documentación Completa

📚 **[PLESK_DEPLOYMENT.md](./PLESK_DEPLOYMENT.md)** - Guía detallada paso a paso

## 🆘 Problemas

**La app no inicia:**
- Ver logs: `tail -f ~/logs/nodejs.log`
- Verificar Node.js >= 18
- Reinstalar: `npm install`

**Puerto ocupado:**
- Plesk lo configura automáticamente
- No cambies PORT en .env

---

✅ **¡Listo! Tu bot está corriendo en Plesk** 🎉

