# Dockerfile para aplicación monolítica
FROM node:20-alpine AS builder

# Instalar dependencias del sistema para compilación
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar archivos de configuración del root
COPY package*.json ./

# Copiar estructura del proyecto
COPY services ./services
COPY shared ./shared

# Copiar configuraciones TypeScript
COPY services/auth-service/tsconfig.json ./services/auth-service/
COPY services/whatsapp-service/tsconfig.json ./services/whatsapp-service/

# Instalar todas las dependencias
RUN npm ci --workspace=services/auth-service --workspace=services/whatsapp-service --workspace=shared/types

# Crear symlinks para shared types
RUN cd services/auth-service && mkdir -p node_modules/@wspbot && ln -sf ../../../shared/types node_modules/@wspbot/shared-types
RUN cd services/whatsapp-service && mkdir -p node_modules/@wspbot && ln -sf ../../../shared/types node_modules/@wspbot/shared-types

# Construir los servicios TypeScript
RUN cd services/auth-service && npm run build && cd ../..
RUN cd services/whatsapp-service && npm run build && cd ../..

# Stage de producción - imagen final más pequeña
FROM node:20-alpine AS production

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Copiar dependencias y código construido desde builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services ./services
COPY --from=builder /app/shared ./shared

# Usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Exponer puertos de los servicios
EXPOSE 3001 3004

# Variables de entorno
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Script de inicio que ejecuta todos los servicios con concurrently
CMD ["npm", "run", "start:all"]