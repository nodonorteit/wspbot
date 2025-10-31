import axios from 'axios';
import QRCode from 'qrcode';
import { config } from '../config';
import { logger } from '../utils/logger';
import { WhatsAppSession } from '@wspbot/shared-types';

export class SessionManager {
  private sessions: Map<string, WhatsAppSession> = new Map();
  private wahaClient = axios.create({
    baseURL: config.waha.baseUrl,
    timeout: config.waha.timeout,
    headers: {
      'Content-Type': 'application/json',
      ...(config.waha.apiKey && { 'Authorization': `Bearer ${config.waha.apiKey}` })
    }
  });

  constructor() {
    this.initializeSessions();
  }

  private async initializeSessions(): Promise<void> {
    try {
      // Load existing sessions from WAHA
      const response = await this.wahaClient.get('/api/sessions');
      const sessions = response.data;

      for (const session of sessions) {
        if (session.name.startsWith('tenant_')) {
          const tenantId = session.name.replace('tenant_', '');
          this.sessions.set(tenantId, {
            tenantId,
            sessionName: session.name,
            status: session.status,
            qrCode: session.qr,
            lastActivity: new Date()
          });
        }
      }

      logger.info(`Initialized ${this.sessions.size} tenant sessions`);
    } catch (error) {
      logger.error('Failed to initialize sessions:', error);
    }
  }

  async startSession(tenantId: string): Promise<WhatsAppSession> {
    try {
      const sessionName = `tenant_${tenantId}`;
      
      // Check if session already exists
      let session = this.sessions.get(tenantId);
      if (session && session.status === 'connected') {
        logger.info(`Session for tenant ${tenantId} already connected`);
        return session;
      }

      // Start new session
      const response = await this.wahaClient.post('/api/sessions', {
        name: sessionName
      });

      if (response.status === 201) {
        session = {
          tenantId,
          sessionName,
          status: 'connecting',
          lastActivity: new Date()
        };

        this.sessions.set(tenantId, session);
        logger.info(`Started session for tenant ${tenantId}`);
        
        return session;
      } else {
        throw new Error(`Failed to start session: ${response.statusText}`);
      }
    } catch (error) {
      logger.error(`Failed to start session for tenant ${tenantId}:`, error);
      throw error;
    }
  }

  async stopSession(tenantId: string): Promise<boolean> {
    try {
      const session = this.sessions.get(tenantId);
      if (!session) {
        return false;
      }

      await this.wahaClient.delete(`/api/sessions/${session.sessionName}`);
      this.sessions.delete(tenantId);
      
      logger.info(`Stopped session for tenant ${tenantId}`);
      return true;
    } catch (error) {
      logger.error(`Failed to stop session for tenant ${tenantId}:`, error);
      return false;
    }
  }

  async getQRCode(tenantId: string): Promise<string | null> {
    try {
      const session = this.sessions.get(tenantId);
      if (!session) {
        return null;
      }

      const response = await this.wahaClient.get(`/api/screenshot/${session.sessionName}`);
      
      if (response.data) {
        // Generate QR code from screenshot
        const qrCode = await QRCode.toDataURL(response.data);
        return qrCode;
      }

      return null;
    } catch (error) {
      logger.error(`Failed to get QR code for tenant ${tenantId}:`, error);
      return null;
    }
  }

  async getScreenshot(tenantId: string): Promise<string | null> {
    try {
      const session = this.sessions.get(tenantId);
      if (!session) {
        return null;
      }

      const response = await this.wahaClient.get(`/api/screenshot/${session.sessionName}`);
      return response.data || null;
    } catch (error) {
      logger.error(`Failed to get screenshot for tenant ${tenantId}:`, error);
      return null;
    }
  }

  async getSessionStatus(tenantId: string): Promise<WhatsAppSession | null> {
    try {
      const session = this.sessions.get(tenantId);
      if (!session) {
        return null;
      }

      // Update status from WAHA
      const response = await this.wahaClient.get(`/api/sessions/${session.sessionName}`);
      
      if (response.data) {
        session.status = response.data.status;
        session.lastActivity = new Date();
        this.sessions.set(tenantId, session);
      }

      return session;
    } catch (error) {
      logger.error(`Failed to get session status for tenant ${tenantId}:`, error);
      return null;
    }
  }

  async sendMessage(tenantId: string, message: any): Promise<boolean> {
    try {
      const session = this.sessions.get(tenantId);
      if (!session || session.status !== 'connected') {
        throw new Error(`Session not connected for tenant ${tenantId}`);
      }

      const response = await this.wahaClient.post(`/api/sendText`, {
        ...message,
        session: session.sessionName
      });

      return response.status === 201;
    } catch (error) {
      logger.error(`Failed to send message for tenant ${tenantId}:`, error);
      return false;
    }
  }

  async getMessages(tenantId: string): Promise<any[]> {
    try {
      const session = this.sessions.get(tenantId);
      if (!session) {
        return [];
      }

      const response = await this.wahaClient.get(`/api/messages/${session.sessionName}`);
      return response.data || [];
    } catch (error) {
      logger.error(`Failed to get messages for tenant ${tenantId}:`, error);
      return [];
    }
  }

  getActiveSessionsCount(): number {
    return Array.from(this.sessions.values()).filter(s => s.status === 'connected').length;
  }

  getAllSessions(): WhatsAppSession[] {
    return Array.from(this.sessions.values());
  }

  // Update session status (called by webhook)
  updateSessionStatus(tenantId: string, status: string): void {
    const session = this.sessions.get(tenantId);
    if (session) {
      session.status = status as any;
      session.lastActivity = new Date();
      this.sessions.set(tenantId, session);
    }
  }
}
