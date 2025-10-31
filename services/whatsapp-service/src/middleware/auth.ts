import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { User, UserRole } from '@wspbot/shared-types';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
      tenantId?: string;
    }
  }
}

// Configuration - in a real app, this would come from config
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access token required',
        timestamp: new Date()
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Add user info to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role as UserRole,
      tenantId: decoded.tenantId,
      isActive: decoded.isActive,
      createdAt: new Date(decoded.createdAt),
      updatedAt: new Date(decoded.updatedAt)
    };
    
    req.tenantId = decoded.tenantId;
    
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token',
        timestamp: new Date()
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expired',
        timestamp: new Date()
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Authentication failed',
        timestamp: new Date()
      });
    }
  }
};

export const requireRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        timestamp: new Date()
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        timestamp: new Date()
      });
      return;
    }

    next();
  };
};

export const requireTenant = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || !req.user.tenantId) {
    res.status(403).json({
      success: false,
      message: 'Tenant access required',
      timestamp: new Date()
    });
    return;
  }

  next();
};

export const requireSuperAdmin = requireRole([UserRole.SUPER_ADMIN]);
export const requireAdmin = requireRole([UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN]);
export const requireUser = requireRole([UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.TENANT_USER]);
