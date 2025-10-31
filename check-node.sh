#!/bin/bash

# Script para buscar Node.js en el sistema

echo "🔍 Buscando Node.js y npm en el sistema..."
echo ""

# Buscar en ubicaciones comunes
paths=(
  "/usr/bin"
  "/usr/local/bin"
  "/opt"
  "/var"
  "/home"
)

for path in "${paths[@]}"; do
  if [ -d "$path" ]; then
    echo "Buscando en: $path"
    find "$path" -name "node" -o -name "npm" 2>/dev/null | head -5
    echo ""
  fi
done

# Verificar PATH
echo "📋 PATH actual:"
echo $PATH
echo ""

# Verificar comandos disponibles
echo "📋 Comandos disponibles:"
which node 2>/dev/null || echo "❌ node: no encontrado"
which npm 2>/dev/null || echo "❌ npm: no encontrado"
which nodejs 2>/dev/null || echo "❌ nodejs: no encontrado"
echo ""

# Verificar versión de sistema
echo "📋 Sistema operativo:"
if [ -f /etc/os-release ]; then
  cat /etc/os-release | grep -E "^(NAME|VERSION)="
fi
echo ""

# Verificar si hay extensiones instaladas
echo "📋 Extensiones Plesk:"
if command -v plesk &> /dev/null; then
  plesk bin extension --list 2>/dev/null | grep -i node || echo "No extensiones Node.js encontradas"
else
  echo "Plesk CLI no disponible"
fi
echo ""

echo "✅ Búsqueda completada"

