#!/bin/bash

# Script de configuración inicial del proyecto
# Este script configura los symlinks para shared types

set -e

echo "🔧 Configurando WSPBot..."

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Crear symlinks para shared types en auth-service
echo "🔗 Configurando symlinks para auth-service..."
cd services/auth-service
mkdir -p node_modules/@wspbot
ln -sf ../../../shared/types node_modules/@wspbot/shared-types || true
cd ../..

# Crear symlinks para shared types en whatsapp-service
echo "🔗 Configurando symlinks para whatsapp-service..."
cd services/whatsapp-service
mkdir -p node_modules/@wspbot
ln -sf ../../../shared/types node_modules/@wspbot/shared-types || true
cd ../..

echo "✅ Configuración completada!"
echo ""
echo "📝 Próximos pasos:"
echo "  1. Configura tu .env: cp env.example .env"
echo "  2. Edita .env con tus configuraciones"
echo "  3. Construye Docker: docker-compose build"
echo "  4. Inicia servicios: docker-compose up -d"
echo ""
echo "📖 Lee README.md y DEPLOYMENT.md para más información"
