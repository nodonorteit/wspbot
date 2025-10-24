import { Request, Response } from 'express';
import { SessionManager } from '../services/SessionManager';
import { MessageProcessor } from '../services/MessageProcessor';
import { logger } from '../utils/logger';
import { ApiResponse } from '../../../shared/types';

export class WhatsAppController {
  constructor(
    private sessionManager: SessionManager,
    private messageProcessor: MessageProcessor
  ) {}

  async getSessionStatus(req: Request, res: Response): Promise<void> {
    try {
      const { tenantId } = req.params;
      
      if (req.tenantId !== tenantId) {
        res.status(403).json({
          success: false,
          message: 'Access denied to this tenant',
          timestamp: new Date()
        });
        return;
      }

      const session = await this.sessionManager.getSessionStatus(tenantId);
      
      const response: ApiResponse = {
        success: true,
        data: session,
        timestamp: new Date()
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting session status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get session status',
        timestamp: new Date()
      });
    }
  }

  async startSession(req: Request, res: Response): Promise<void> {
    try {
      const { tenantId } = req.params;
      
      if (req.tenantId !== tenantId) {
        res.status(403).json({
          success: false,
          message: 'Access denied to this tenant',
          timestamp: new Date()
        });
        return;
      }

      const session = await this.sessionManager.startSession(tenantId);
      
      const response: ApiResponse = {
        success: true,
        data: session,
        message: 'Session started successfully',
        timestamp: new Date()
      };

      res.json(response);
    } catch (error) {
      logger.error('Error starting session:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to start session',
        timestamp: new Date()
      });
    }
  }

  async stopSession(req: Request, res: Response): Promise<void> {
    try {
      const { tenantId } = req.params;
      
      if (req.tenantId !== tenantId) {
        res.status(403).json({
          success: false,
          message: 'Access denied to this tenant',
          timestamp: new Date()
        });
        return;
      }

      const success = await this.sessionManager.stopSession(tenantId);
      
      const response: ApiResponse = {
        success,
        message: success ? 'Session stopped successfully' : 'Session not found',
        timestamp: new Date()
      };

      res.json(response);
    } catch (error) {
      logger.error('Error stopping session:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to stop session',
        timestamp: new Date()
      });
    }
  }

  async getQRCode(req: Request, res: Response): Promise<void> {
    try {
      const { tenantId } = req.params;
      
      if (req.tenantId !== tenantId) {
        res.status(403).json({
          success: false,
          message: 'Access denied to this tenant',
          timestamp: new Date()
        });
        return;
      }

      const qrCode = await this.sessionManager.getQRCode(tenantId);
      
      if (qrCode) {
        res.json({
          success: true,
          data: { qrCode },
          timestamp: new Date()
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'QR code not available',
          timestamp: new Date()
        });
      }
    } catch (error) {
      logger.error('Error getting QR code:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get QR code',
        timestamp: new Date()
      });
    }
  }

  async getScreenshot(req: Request, res: Response): Promise<void> {
    try {
      const { tenantId } = req.params;
      
      if (req.tenantId !== tenantId) {
        res.status(403).json({
          success: false,
          message: 'Access denied to this tenant',
          timestamp: new Date()
        });
        return;
      }

      const screenshot = await this.sessionManager.getScreenshot(tenantId);
      
      if (screenshot) {
        res.json({
          success: true,
          data: { screenshot },
          timestamp: new Date()
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Screenshot not available',
          timestamp: new Date()
        });
      }
    } catch (error) {
      logger.error('Error getting screenshot:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get screenshot',
        timestamp: new Date()
      });
    }
  }

  async sendTextMessage(req: Request, res: Response): Promise<void> {
    try {
      const { tenantId } = req.params;
      const { chatId, text } = req.body;
      
      if (req.tenantId !== tenantId) {
        res.status(403).json({
          success: false,
          message: 'Access denied to this tenant',
          timestamp: new Date()
        });
        return;
      }

      if (!chatId || !text) {
        res.status(400).json({
          success: false,
          message: 'chatId and text are required',
          timestamp: new Date()
        });
        return;
      }

      const success = await this.sessionManager.sendMessage(tenantId, {
        chatId,
        text
      });
      
      const response: ApiResponse = {
        success,
        message: success ? 'Message sent successfully' : 'Failed to send message',
        timestamp: new Date()
      };

      res.json(response);
    } catch (error) {
      logger.error('Error sending text message:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send message',
        timestamp: new Date()
      });
    }
  }

  async sendImageMessage(req: Request, res: Response): Promise<void> {
    try {
      const { tenantId } = req.params;
      const { chatId, url, caption } = req.body;
      
      if (req.tenantId !== tenantId) {
        res.status(403).json({
          success: false,
          message: 'Access denied to this tenant',
          timestamp: new Date()
        });
        return;
      }

      if (!chatId || !url) {
        res.status(400).json({
          success: false,
          message: 'chatId and url are required',
          timestamp: new Date()
        });
        return;
      }

      const success = await this.sessionManager.sendMessage(tenantId, {
        chatId,
        url,
        caption: caption || ''
      });
      
      const response: ApiResponse = {
        success,
        message: success ? 'Image sent successfully' : 'Failed to send image',
        timestamp: new Date()
      };

      res.json(response);
    } catch (error) {
      logger.error('Error sending image message:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send image',
        timestamp: new Date()
      });
    }
  }

  async sendFileMessage(req: Request, res: Response): Promise<void> {
    try {
      const { tenantId } = req.params;
      const { chatId, url, filename } = req.body;
      
      if (req.tenantId !== tenantId) {
        res.status(403).json({
          success: false,
          message: 'Access denied to this tenant',
          timestamp: new Date()
        });
        return;
      }

      if (!chatId || !url) {
        res.status(400).json({
          success: false,
          message: 'chatId and url are required',
          timestamp: new Date()
        });
        return;
      }

      const success = await this.sessionManager.sendMessage(tenantId, {
        chatId,
        url,
        filename: filename || ''
      });
      
      const response: ApiResponse = {
        success,
        message: success ? 'File sent successfully' : 'Failed to send file',
        timestamp: new Date()
      };

      res.json(response);
    } catch (error) {
      logger.error('Error sending file message:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send file',
        timestamp: new Date()
      });
    }
  }

  async getMessages(req: Request, res: Response): Promise<void> {
    try {
      const { tenantId } = req.params;
      
      if (req.tenantId !== tenantId) {
        res.status(403).json({
          success: false,
          message: 'Access denied to this tenant',
          timestamp: new Date()
        });
        return;
      }

      const messages = await this.sessionManager.getMessages(tenantId);
      
      const response: ApiResponse = {
        success: true,
        data: messages,
        timestamp: new Date()
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting messages:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get messages',
        timestamp: new Date()
      });
    }
  }

  async getContacts(req: Request, res: Response): Promise<void> {
    try {
      const { tenantId } = req.params;
      
      if (req.tenantId !== tenantId) {
        res.status(403).json({
          success: false,
          message: 'Access denied to this tenant',
          timestamp: new Date()
        });
        return;
      }

      // This would typically fetch contacts from WAHA
      // For now, return empty array
      const response: ApiResponse = {
        success: true,
        data: [],
        timestamp: new Date()
      };

      res.json(response);
    } catch (error) {
      logger.error('Error getting contacts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get contacts',
        timestamp: new Date()
      });
    }
  }

  async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const { tenantId } = req.params;
      const webhookData = req.body;

      // Verify webhook authenticity (implement based on your needs)
      // const isValid = this.verifyWebhookSignature(req);
      // if (!isValid) {
      //   res.status(401).json({ success: false, message: 'Invalid webhook signature' });
      //   return;
      // }

      // Process incoming message
      await this.messageProcessor.processIncomingMessage(tenantId, webhookData);

      res.json({
        success: true,
        message: 'Webhook processed',
        timestamp: new Date()
      });
    } catch (error) {
      logger.error('Error processing webhook:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process webhook',
        timestamp: new Date()
      });
    }
  }
}
