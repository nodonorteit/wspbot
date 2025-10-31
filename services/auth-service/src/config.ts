import dotenv from 'dotenv';
import { ServiceConfig } from '@wspbot/shared-types';

dotenv.config();

export const config: ServiceConfig & {
  nodeEnv: string;
  jwt: {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  database: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  };
} = {
  port: parseInt(process.env.AUTH_SERVICE_PORT || '3001', 10),
  host: process.env.AUTH_SERVICE_HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10) // limit each IP to 100 requests per windowMs
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    database: process.env.DB_NAME || 'wspbot_auth',
    username: process.env.DB_USER || 'wspbot',
    password: process.env.DB_PASSWORD || 'password'
  }
};
