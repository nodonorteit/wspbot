import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import axios from 'axios';
import QRCode from 'qrcode';
import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware, requireTenant } from './middleware/auth';
import { WhatsAppController } from './controllers/WhatsAppController';
import { SessionManager } from './services/SessionManager';
import { MessageProcessor } from './services/MessageProcessor';

const app = express();

// Initialize services
const sessionManager = new SessionManager();
const messageProcessor = new MessageProcessor();
const whatsappController = new WhatsAppController(sessionManager, messageProcessor);

// Security middleware
app.use(helmet());
app.use(cors(config.cors));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Logging
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'whatsapp-service',
    version: process.env.npm_package_version || '1.0.0',
    activeSessions: sessionManager.getActiveSessionsCount()
  });
});

// Authentication middleware for all routes except health
app.use('/api', authMiddleware);

// Routes
app.get('/api/sessions/:tenantId/status', requireTenant, whatsappController.getSessionStatus);
app.post('/api/sessions/:tenantId/start', requireTenant, whatsappController.startSession);
app.delete('/api/sessions/:tenantId/stop', requireTenant, whatsappController.stopSession);
app.get('/api/sessions/:tenantId/qr', requireTenant, whatsappController.getQRCode);
app.get('/api/sessions/:tenantId/screenshot', requireTenant, whatsappController.getScreenshot);

app.post('/api/sessions/:tenantId/send-text', requireTenant, whatsappController.sendTextMessage);
app.post('/api/sessions/:tenantId/send-image', requireTenant, whatsappController.sendImageMessage);
app.post('/api/sessions/:tenantId/send-file', requireTenant, whatsappController.sendFileMessage);

app.get('/api/sessions/:tenantId/messages', requireTenant, whatsappController.getMessages);
app.get('/api/sessions/:tenantId/contacts', requireTenant, whatsappController.getContacts);

// Webhook for incoming messages (no auth required - uses API key)
app.post('/webhook/:tenantId', whatsappController.handleWebhook);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

const PORT = config.port || 3004;

app.listen(PORT, () => {
  logger.info(`WhatsApp Service running on port ${PORT}`);
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`WAHA Base URL: ${config.waha.baseUrl}`);
});

export default app;
