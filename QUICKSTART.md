# WSPBot - Guía de Inicio Rápido

## 🚀 Ejecutar la Aplicación en 3 Pasos

### 1. Configurar variables de entorno

```bash
cp env.example .env
# Edita .env con tus configuraciones (o déjalo como está para desarrollo local)
```

### 2. Construir la imagen Docker

```bash
docker-compose build
```

### 3. Iniciar los servicios

```bash
docker-compose up -d
```

¡Listo! La aplicación está corriendo.

## 📍 Verificar que funciona

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Health check de Auth Service
curl http://localhost:3001/health

# Health check de WhatsApp Service
curl http://localhost:3004/health

# Ver interfaz de WAHA
open http://localhost:3000/docs
```

## 🛑 Detener la aplicación

```bash
docker-compose down
```

## 🔄 Comandos útiles

```bash
# Ver solo logs de la app monolítica
docker-compose logs -f wspbot-app

# Reconstruir desde cero
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Acceder al contenedor
docker exec -it wspbot-app sh

# Ver contenedores corriendo
docker ps
```

## 📝 Próximos pasos

1. **Conectar WhatsApp**: Ve a http://localhost:3000 y escanea el QR code
2. **Testear API**: Usa los endpoints en http://localhost:3001/health y http://localhost:3004/health
3. **Configurar base de datos**: Edita `.env` con tu conexión MySQL
4. **Leer documentación**: Revisa [README.md](./README.md) y [README.MONOLITH.md](./README.MONOLITH.md)

## ⚠️ Problemas comunes

### Puerto ya en uso
```bash
# Edita docker-compose.yml para cambiar puertos
ports:
  - "3002:3001"  # Cambia 3001 por otro puerto
```

### Error al construir
```bash
# Limpia todo y reconstruye
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Los servicios no responden
```bash
# Verifica los logs
docker-compose logs wspbot-app
docker-compose logs waha
docker-compose logs redis
```

## 🎯 Desarrollo

Para desarrollo sin Docker:

```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo (con nodemon y hot reload)
npm run dev

# Iniciar en producción (sin hot reload)
npm run start:all
```

¡Disfruta de tu WSPBot! 🎉
