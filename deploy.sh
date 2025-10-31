#!/bin/bash

# Script de despliegue para servidor
# Uso: ./deploy.sh

set -e

echo "🚀 Desplegando WSPBot..."

# Variables
COMPOSE_FILE="docker-compose.yml"

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
    exit 1
fi

# Parar contenedores existentes
echo "🛑 Deteniendo contenedores existentes..."
docker-compose down

# Construir imágenes (opcional, con rebuild)
echo "🔨 Reconstruyendo imágenes..."
docker-compose build --no-cache

# Iniciar contenedores
echo "🚀 Iniciando contenedores..."
docker-compose up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Verificar estado
echo "📊 Estado de los contenedores:"
docker-compose ps

echo ""
echo "✅ Despliegue completado!"
echo ""
echo "📍 Servicios disponibles:"
echo "  - Auth Service: http://localhost:3001"
echo "  - WhatsApp Service: http://localhost:3004"
echo "  - WAHA: http://localhost:3000"
echo ""
echo "📋 Ver logs: docker-compose logs -f"
echo "🛑 Detener: docker-compose down"
