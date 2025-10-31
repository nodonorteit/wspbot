# 🚀 Inicio Rápido - Despliegue en Servidor

## ⚡ 3 Pasos para Desplegar

### 1️⃣ Clonar y Configurar

```bash
# Clonar el repositorio
git clone https://github.com/TU-USUARIO/wspbot.git
cd wspbot

# Ejecutar setup
./setup.sh
```

### 2️⃣ Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp env.example .env

# Editar con tu editor favorito
nano .env
```

**Minimo que debes cambiar:**
```env
JWT_SECRET=tu-clave-super-secreta-genera-con-openssl-rand-base64-32
```

### 3️⃣ Desplegar

```bash
# Ejecutar script de despliegue
./deploy.sh
```

## ✅ Verificar

```bash
# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f

# Probar servicios
curl http://localhost:3001/health
curl http://localhost:3004/health
```

## 🔄 Actualizar Código

```bash
git pull origin main
./deploy.sh
```

## 📚 Más Información

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guía completa
- **[INSTRUCTIONS.md](./INSTRUCTIONS.md)** - Instrucciones detalladas
- **[README.md](./README.md)** - Documentación general

---

¡Listo! Tu aplicación está corriendo 🎉
