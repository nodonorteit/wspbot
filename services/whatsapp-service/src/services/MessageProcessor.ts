import { logger } from '../utils/logger';
import { WhatsAppMessage } from '../../../shared/types';

export class MessageProcessor {
  constructor() {}

  async processIncomingMessage(tenantId: string, webhookData: any): Promise<void> {
    try {
      logger.info(`Processing incoming message for tenant ${tenantId}:`, webhookData);

      // Extract message data from webhook
      const message: WhatsAppMessage = {
        id: webhookData.id || `msg_${Date.now()}`,
        tenantId,
        chatId: webhookData.chatId,
        body: webhookData.body || '',
        from: webhookData.from,
        to: webhookData.to,
        timestamp: new Date(webhookData.timestamp || Date.now()),
        messageType: webhookData.messageType || 'text',
        status: 'delivered'
      };

      // Process different types of messages
      switch (message.messageType) {
        case 'text':
          await this.processTextMessage(message);
          break;
        case 'image':
          await this.processImageMessage(message);
          break;
        case 'file':
          await this.processFileMessage(message);
          break;
        default:
          logger.warn(`Unknown message type: ${message.messageType}`);
      }

      // Forward to other services if needed
      await this.forwardToTurnService(tenantId, message);

    } catch (error) {
      logger.error(`Error processing incoming message for tenant ${tenantId}:`, error);
    }
  }

  private async processTextMessage(message: WhatsAppMessage): Promise<void> {
    try {
      logger.info(`Processing text message from ${message.from}: ${message.body}`);

      // Check if it's a command (starts with /)
      if (message.body.startsWith('/')) {
        await this.processCommand(message);
        return;
      }

      // Check for keywords that might trigger automatic responses
      await this.processKeywords(message);

    } catch (error) {
      logger.error('Error processing text message:', error);
    }
  }

  private async processImageMessage(message: WhatsAppMessage): Promise<void> {
    try {
      logger.info(`Processing image message from ${message.from}`);
      
      // Process image message logic here
      // For example, save image, analyze content, etc.
      
    } catch (error) {
      logger.error('Error processing image message:', error);
    }
  }

  private async processFileMessage(message: WhatsAppMessage): Promise<void> {
    try {
      logger.info(`Processing file message from ${message.from}`);
      
      // Process file message logic here
      // For example, save file, check file type, etc.
      
    } catch (error) {
      logger.error('Error processing file message:', error);
    }
  }

  private async processCommand(message: WhatsAppMessage): Promise<void> {
    try {
      const command = message.body.split(' ')[0].substring(1); // Remove /
      const args = message.body.split(' ').slice(1);

      logger.info(`Processing command: ${command} with args:`, args);

      // Route command to appropriate handler
      switch (command.toLowerCase()) {
        case 'turno':
        case 'reservar':
          await this.handleTurnBookingCommand(message, args);
          break;
        case 'myturnos':
        case 'misturnos':
          await this.handleMyTurnsCommand(message);
          break;
        case 'horarios':
          await this.handleAvailableTimesCommand(message, args);
          break;
        case 'cancelar':
          await this.handleCancelTurnCommand(message, args);
          break;
        case 'help':
          await this.handleHelpCommand(message);
          break;
        default:
          await this.handleUnknownCommand(message, command);
      }

    } catch (error) {
      logger.error('Error processing command:', error);
    }
  }

  private async processKeywords(message: WhatsAppMessage): Promise<void> {
    try {
      const text = message.body.toLowerCase();

      // Automatic responses for common keywords
      if (text.includes('hola') || text.includes('hi') || text.includes('hello')) {
        await this.sendAutomaticResponse(message, '👋 ¡Hola! Soy un bot de WhatsApp. ¿En qué puedo ayudarte? Usa /help para ver comandos disponibles.');
      } else if (text.includes('gracias') || text.includes('thanks')) {
        await this.sendAutomaticResponse(message, '😊 ¡De nada! Estoy aquí para ayudarte.');
      } else if (text.includes('bot')) {
        await this.sendAutomaticResponse(message, '🤖 Sí, soy un bot de WhatsApp. Usa /help para ver qué puedo hacer por ti.');
      }

    } catch (error) {
      logger.error('Error processing keywords:', error);
    }
  }

  private async handleTurnBookingCommand(message: WhatsAppMessage, args: string[]): Promise<void> {
    try {
      if (args.length < 2) {
        await this.sendAutomaticResponse(message, `
📅 *Reservar Turno*

Uso: \`/turno [fecha] [hora] [servicio]\`

Ejemplos:
• \`/turno mañana 10:00 consulta\`
• \`/turno 2024-01-15 14:30 emergencia\`

📋 *Servicios disponibles:*
• consulta - Consulta general
• emergencia - Atención de emergencia  
• seguimiento - Control de seguimiento
• cita - Cita médica
        `.trim());
        return;
      }

      // Forward to turns service for processing
      await this.forwardToTurnService(message.tenantId, message, 'BOOK_TURN', { args });

    } catch (error) {
      logger.error('Error handling turn booking command:', error);
    }
  }

  private async handleMyTurnsCommand(message: WhatsAppMessage): Promise<void> {
    try {
      // Forward to turns service
      await this.forwardToTurnService(message.tenantId, message, 'GET_MY_TURNS');

    } catch (error) {
      logger.error('Error handling my turns command:', error);
    }
  }

  private async handleAvailableTimesCommand(message: WhatsAppMessage, args: string[]): Promise<void> {
    try {
      // Forward to turns service
      await this.forwardToTurnService(message.tenantId, message, 'GET_AVAILABLE_TIMES', { args });

    } catch (error) {
      logger.error('Error handling available times command:', error);
    }
  }

  private async handleCancelTurnCommand(message: WhatsAppMessage, args: string[]): Promise<void> {
    try {
      if (args.length < 1) {
        await this.sendAutomaticResponse(message, '❌ Uso: `/cancelar [ID del turno]`\n💡 Usa `/myturnos` para ver tus turnos y sus IDs');
        return;
      }

      // Forward to turns service
      await this.forwardToTurnService(message.tenantId, message, 'CANCEL_TURN', { args });

    } catch (error) {
      logger.error('Error handling cancel turn command:', error);
    }
  }

  private async handleHelpCommand(message: WhatsAppMessage): Promise<void> {
    try {
      const helpText = `
🤖 *Comandos disponibles:*

/turno - Reservar un turno
/myturnos - Ver mis turnos
/horarios - Ver horarios disponibles
/cancelar - Cancelar un turno
/help - Mostrar esta ayuda

*Palabras clave:*
- 'hola' → Saludo automático
- 'gracias' → Respuesta de cortesía
- 'bot' → Información sobre el bot
      `.trim();

      await this.sendAutomaticResponse(message, helpText);

    } catch (error) {
      logger.error('Error handling help command:', error);
    }
  }

  private async handleUnknownCommand(message: WhatsAppMessage, command: string): Promise<void> {
    try {
      await this.sendAutomaticResponse(message, `❌ Comando '${command}' no encontrado. Usa /help para ver comandos disponibles.`);

    } catch (error) {
      logger.error('Error handling unknown command:', error);
    }
  }

  private async sendAutomaticResponse(message: WhatsAppMessage, responseText: string): Promise<void> {
    try {
      // This would typically send the response back through the WhatsApp service
      // For now, just log it
      logger.info(`Sending automatic response to ${message.from}: ${responseText}`);

      // TODO: Implement actual message sending
      // await this.whatsappService.sendMessage(message.tenantId, {
      //   chatId: message.from,
      //   text: responseText
      // });

    } catch (error) {
      logger.error('Error sending automatic response:', error);
    }
  }

  private async forwardToTurnService(tenantId: string, message: WhatsAppMessage, action: string, data?: any): Promise<void> {
    try {
      logger.info(`Forwarding to turns service - Tenant: ${tenantId}, Action: ${action}`, data);

      // This would typically make an HTTP request to the turns service
      // For now, just log it
      // TODO: Implement actual service communication
      // await this.httpClient.post(`http://turns-service:3003/api/whatsapp/webhook`, {
      //   tenantId,
      //   message,
      //   action,
      //   data
      // });

    } catch (error) {
      logger.error('Error forwarding to turns service:', error);
    }
  }
}
