#!/bin/bash

# Script de despliegue para servidor VPS con Huawei Cloud Registry

set -e

echo "🚀 Desplegando WSPBot desde Huawei Cloud..."

# Variables
COMPOSE_FILE="docker-compose.plesk.yml"

# Verificar que existe docker-compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose no está instalado"
    exit 1
fi

# Verificar que existe el archivo .env
if [ ! -f .env ]; then
    echo "⚠️  Archivo .env no encontrado. Copiando desde env.example..."
    cp env.example .env
    echo "✅ Por favor, edita el archivo .env con tus configuraciones"
    echo "   Especialmente: cambia 'tu-namespace' por tu namespace de Huawei Cloud"
    exit 1
fi

# Verificar que existe el namespace correcto en docker-compose
if grep -q "tu-namespace" docker-compose.plesk.yml; then
    echo "⚠️  IMPORTANTE: Necesitas editar docker-compose.plesk.yml"
    echo "   Cambia 'tu-namespace' por tu namespace real de Huawei Cloud"
    echo ""
    read -p "¿Quieres continuar de todos modos? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Login en Huawei Cloud
echo "🔐 Login en Huawei Cloud Registry..."
read -p "Huawei Access Key ID: " HUAWEI_ACCESS_KEY_ID
read -sp "Huawei Secret Access Key: " HUAWEI_SECRET_ACCESS_KEY
echo ""

docker login swr.cn-north-4.myhuaweicloud.com -u "$HUAWEI_ACCESS_KEY_ID" -p "$HUAWEI_SECRET_ACCESS_KEY"

# Parar contenedores existentes
echo "🛑 Deteniendo contenedores existentes..."
docker-compose -f $COMPOSE_FILE down || true

# Descargar imágenes
echo "📥 Descargando imágenes desde Huawei Cloud..."
docker-compose -f $COMPOSE_FILE pull

# Iniciar contenedores
echo "🚀 Iniciando contenedores..."
docker-compose -f $COMPOSE_FILE up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Verificar estado
echo "📊 Estado de los contenedores:"
docker-compose -f $COMPOSE_FILE ps

echo ""
echo "✅ Despliegue completado!"
echo ""
echo "📍 Servicios disponibles:"
echo "  - Auth Service: http://localhost:3001"
echo "  - WhatsApp Service: http://localhost:3004"
echo "  - WAHA: http://localhost:3000"
echo ""
echo "📋 Ver logs: docker-compose -f $COMPOSE_FILE logs -f"
echo "🛑 Detener: docker-compose -f $COMPOSE_FILE down"

