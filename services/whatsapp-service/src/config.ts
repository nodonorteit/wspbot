import dotenv from 'dotenv';
import { ServiceConfig, WhatsAppConfig } from '../../../shared/types';

dotenv.config();

export const config: ServiceConfig & {
  nodeEnv: string;
  waha: WhatsAppConfig;
  redis: {
    host: string;
    port: number;
    password?: string;
    db?: number;
  };
} = {
  port: parseInt(process.env.WHATSAPP_SERVICE_PORT || '3004', 10),
  host: process.env.WHATSAPP_SERVICE_HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '1000', 10) // Higher limit for WhatsApp service
  },
  
  waha: {
    baseUrl: process.env.WAHA_BASE_URL || 'http://localhost:3000',
    apiKey: process.env.WAHA_API_KEY,
    timeout: parseInt(process.env.WAHA_TIMEOUT || '30000', 10),
    retryAttempts: parseInt(process.env.WAHA_RETRY_ATTEMPTS || '3', 10)
  },
  
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0', 10)
  }
};
