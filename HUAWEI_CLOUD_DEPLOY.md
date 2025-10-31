# 🚀 Desplegar WSPBot desde Huawei Cloud Registry

## 📋 Overview

Este proyecto usa **Huawei Cloud Container Registry** para almacenar las imágenes Docker. Las imágenes se construyen automáticamente con GitHub Actions y se despliegan en tu servidor VPS.

## 🏗️ Workflow

```
GitHub Code → GitHub Actions → Huawei Cloud Registry → Tu Servidor VPS
```

## 🔧 Configuración Inicial

### 1. Configurar Secrets en GitHub

Ve a tu repositorio → Settings → Secrets and variables → Actions

Agrega estos secrets:

```
HUAWEI_ACCESS_KEY_ID=tu-access-key-id
HUAWEI_SECRET_ACCESS_KEY=tu-secret-access-key
HUAWEI_NAMESPACE=tu-namespace
```

### 2. Configurar Namespace

Edita `docker-compose.plesk.yml` y reemplaza `tu-namespace` con tu namespace real de Huawei Cloud.

## 🚀 Despliegue

### Opción A: Despliegue Automático (GitHub Actions)

El workflow `.github/workflows/docker-build.yml` construye automáticamente cuando hay push a `main` o `develop`.

**Para forzar build manual:**
1. Ve a GitHub → Actions
2. Click en "Build and Push Docker Image"
3. Click en "Run workflow"

### Opción B: Despliegue Manual en el Servidor

```bash
# 1. Clonar repositorio en tu servidor
cd /var/www/vhosts/tudominio.com
git clone https://github.com/nodonorteit/wspbot.git .
cd wspbot

# 2. Editar namespace en docker-compose.plesk.yml
nano docker-compose.plesk.yml
# Reemplazar 'tu-namespace' por tu namespace real

# 3. Configurar variables de entorno
cp env.example .env
nano .env

# 4. Login en Huawei Cloud
docker login swr.cn-north-4.myhuaweicloud.com

# 5. Desplegar
./deploy-huawei.sh

# O manualmente:
docker-compose -f docker-compose.plesk.yml pull
docker-compose -f docker-compose.plesk.yml up -d
```

## 🔄 Actualizar Aplicación

```bash
# Pull latest code
git pull origin main

# Pull latest images
docker login swr.cn-north-4.myhuaweicloud.com
docker-compose -f docker-compose.plesk.yml pull

# Restart
docker-compose -f docker-compose.plesk.yml restart wspbot-app
```

## 🔍 Verificar Imágenes

```bash
# Listar imágenes de Huawei Cloud
docker images | grep "swr.cn-north-4.myhuaweicloud.com"

# Ver detalles
docker images swr.cn-north-4.myhuaweicloud.com/tu-namespace/wspbot-app
```

## 📊 Monitoreo

```bash
# Ver logs
docker-compose -f docker-compose.plesk.yml logs -f

# Ver estado
docker-compose -f docker-compose.plesk.yml ps

# Estadísticas
docker stats
```

## 🐛 Troubleshooting

### Error: "unknown registry"

```bash
# Re-login en Huawei Cloud
docker logout swr.cn-north-4.myhuaweicloud.com
docker login swr.cn-north-4.myhuaweicloud.com
```

### Error: "unauthorized"

Verifica que tus credenciales de Huawei Cloud sean correctas en GitHub Secrets.

### Error: "image not found"

Asegúrate de que el workflow de GitHub Actions completó exitosamente:
- Ve a GitHub → Actions
- Verifica el último build

## 🔐 Seguridad

- ✅ Credenciales en GitHub Secrets (nunca en código)
- ✅ Imágenes privadas en Huawei Cloud
- ✅ HTTPS para tráfico
- ✅ Variables de entorno en `.env` (no en git)

## 📝 Notas Importantes

1. **Namespace**: Debe coincidir en GitHub Actions y docker-compose
2. **Región**: `cn-north-4` (ajusta si es diferente)
3. **Tags**: `latest` para producción, `sha` para versionado
4. **Builds**: Automáticos en push a main/develop

## 📚 Referencias

- [Huawei Cloud Container Registry](https://www.huaweicloud.com/product/swr.html)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Docker Compose](https://docs.docker.com/compose/)

