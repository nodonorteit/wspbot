# 📝 Instrucciones de Despliegue

## 🚀 Pasos para Desplegar en el Servidor

### 1. Preparar el Repositorio

```bash
# Después de clonar, ejecuta el script de setup
./setup.sh
```

Este script:
- Instala todas las dependencias
- Crea los symlinks necesarios para TypeScript
- Configura el entorno

### 2. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp env.example .env

# Editar con tus configuraciones
nano .env
```

**Variables importantes a configurar:**
- `JWT_SECRET`: Genera una clave segura (usa `openssl rand -base64 32`)
- `DB_*`: Si usas base de datos externa
- `CORS_ORIGIN`: Tu dominio en producción

### 3. Construir y Desplegar

#### Opción A: Script Automático (Recomendado)

```bash
./deploy.sh
```

#### Opción B: Manual

```bash
# Construir imágenes
docker-compose build

# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f
```

### 4. Verificar que Funciona

```bash
# Ver estado
docker-compose ps

# Verificar health checks
curl http://localhost:3001/health
curl http://localhost:3004/health

# Ver logs en tiempo real
docker-compose logs -f wspbot-app
```

## 🔄 Actualizar Aplicación

```bash
cd /ruta/al/proyecto

# Actualizar código
git pull origin main

# Reconstruir (requiere Docker)
docker-compose down
docker-compose build
docker-compose up -d

# O usar el script
./deploy.sh
```

## 🌐 Exponer al Mundo

### Con Nginx (Recomendado)

1. Instalar Nginx
2. Configurar reverse proxy (ver DEPLOYMENT.md)
3. Habilitar HTTPS con Let's Encrypt

### Sin Nginx (No recomendado para producción)

Los servicios estarán en:
- Auth: http://tu-servidor:3001
- WhatsApp: http://tu-servidor:3004
- WAHA: http://tu-servidor:3000

**⚠️ Asegúrate de configurar el firewall adecuadamente**

## 📊 Monitoreo

```bash
# Ver logs de un servicio
docker-compose logs -f wspbot-app

# Ver uso de recursos
docker stats

# Ver estado de contenedores
docker-compose ps
```

## 🛠️ Troubleshooting

### Los servicios no inician

```bash
# Ver logs completos
docker-compose logs

# Verificar puertos disponibles
netstat -tulpn | grep -E '3000|3001|3004|6379'

# Reconstruir desde cero
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Limpiar todo y empezar de nuevo

```bash
docker-compose down -v
docker system prune -a
git clean -fd
./setup.sh
cp env.example .env
# Editar .env
./deploy.sh
```

## 📚 Documentación Adicional

- **[README.md](./README.md)** - Información general del proyecto
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guía completa de despliegue
- **[QUICKSTART.md](./QUICKSTART.md)** - Inicio rápido local
- **[README.MONOLITH.md](./README.MONOLITH.md)** - Arquitectura monolítica

## 🔐 Seguridad

Antes de ir a producción:

1. ✅ Cambiar `JWT_SECRET` por una clave segura
2. ✅ Configurar HTTPS con Let's Encrypt
3. ✅ Configurar firewall (solo puertos necesarios)
4. ✅ Usar base de datos con credenciales seguras
5. ✅ Habilitar logs de auditoría
6. ✅ Configurar backups automáticos

## 💡 Tips

- Usa **screen** o **tmux** para mantener sesiones SSH activas
- Configura **fail2ban** para protección adicional
- Usa **PM2** o similar para auto-restart en caso de crash
- Implementa un sistema de backups automatizado

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs: `docker-compose logs -f`
2. Verifica la documentación
3. Abre un issue en GitHub

---

¡Listo para desplegar! 🎉
