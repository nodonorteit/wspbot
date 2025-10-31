#!/usr/bin/env node

/**
 * WSPBot - Aplicación Unificada para Plesk y Hosting Tradicional
 * Una sola app Express que combina todos los servicios
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Configuración
const PORT = process.env.PORT || process.env.NODE_PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';

// Crear app Express
const app = express();

// ============================================
// MIDDLEWARE GLOBAL
// ============================================

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
}));
app.use(compression());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// ROUTES - HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'wspbot-unified',
    version: require('./package.json').version,
    environment: NODE_ENV
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'WSPBot API',
    version: require('./package.json').version,
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      whatsapp: '/api/sessions'
    }
  });
});

// ============================================
// ROUTES - AUTH (Simulado por ahora)
// ============================================

app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    data: {
      user: { id: '1', name: 'Test', email: req.body.email },
      accessToken: 'mock-token-' + Date.now(),
      expiresIn: 900000
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    message: 'Registration successful',
    data: {
      user: { id: '1', name: req.body.name, email: req.body.email }
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    success: true,
    data: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com'
    }
  });
});

// ============================================
// ROUTES - WHATSAPP (Simulado)
// ============================================

app.get('/api/sessions/:tenantId/status', (req, res) => {
  res.json({
    success: true,
    data: {
      tenantId: req.params.tenantId,
      status: 'disconnected',
      lastActivity: null
    }
  });
});

app.post('/api/sessions/:tenantId/start', (req, res) => {
  res.json({
    success: true,
    message: 'Session started',
    data: {
      tenantId: req.params.tenantId,
      status: 'connecting'
    }
  });
});

app.get('/api/sessions/:tenantId/qr', (req, res) => {
  res.json({
    success: true,
    message: 'QR code generated',
    data: {
      qr: 'data:image/svg+xml;base64,mock-qr-code',
      tenantId: req.params.tenantId
    }
  });
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: NODE_ENV === 'development' ? err.message : undefined
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ============================================
// START SERVER
// ============================================

const server = app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════╗');
  console.log('║      WSPBot - Unified Server          ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📦 Environment: ${NODE_ENV}`);
  console.log(`🌐 Health: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
  console.log(`💬 WhatsApp: http://localhost:${PORT}/api/sessions`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

module.exports = app;
