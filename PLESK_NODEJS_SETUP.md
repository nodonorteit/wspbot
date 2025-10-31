# 🔧 Instalar Node.js en Plesk (si no está)

## Opción 1: Plesk Node.js Management (Recomendado)

Si tienes acceso al panel de Plesk:

1. Ve a tu dominio en Plesk
2. Busca **"Node.js"** en el menú izquierdo
3. Si no aparece, necesita instalarse el módulo

### Instalar Node.js en Plesk

```bash
# Si tienes acceso root al servidor
plesk bin extension --install nodejs
```

O desde Plesk Extensions:
1. Ve a **"Extensions"**
2. Busca "Node.js"
3. Instálalo

## Opción 2: Instalar Node.js Manualmente (SSH)

```bash
# Conectarte como root
ssh root@vps01

# Instalar Node.js via nvm (recommendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recargar perfil
source ~/.bashrc

# Instalar Node.js LTS
nvm install --lts
nvm use --lts

# Verificar instalación
node --version
npm --version

# Hacer disponible globalmente
npm config set prefix /usr/local
```

## Opción 3: Instalar Node.js Directo

```bash
# Para Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar
node --version
npm --version
```

## Opción 4: Usar la versión que ya viene en tu servidor

A veces Plesk tiene Node.js en otra ubicación:

```bash
# Buscar node en el sistema
which node
find /usr -name "node" 2>/dev/null
find /opt -name "node" 2>/dev/null

# O ver en PATH
echo $PATH

# Si lo encuentras, crear symlink
sudo ln -s /ruta/al/node /usr/local/bin/node
sudo ln -s /ruta/al/npm /usr/local/bin/npm
```

## ✅ Después de instalar Node.js

```bash
# Ir a tu proyecto
cd /var/www/vhosts/nodonorte.com/wspbot.nodonorte.com

# Instalar dependencias
npm install

# Verificar
node --version
npm --version
```

## 🆘 Si nada funciona

En ese caso, sube el código **ya compilado** o usa otra estrategia. Dime qué opción prefieres:

1. Instalar Node.js (necesitas acceso root o permisos)
2. Usar Docker si tienes Docker en el servidor
3. Subir código precompilado
4. Otra opción?

