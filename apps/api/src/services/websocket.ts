import { WebSocketServer, WebSocket } from 'ws';
import { logger } from '../config/logger';

let wss: WebSocketServer;

export function initWebSocketServer(port: number | string) {
  wss = new WebSocketServer({ port: Number(port) });

  wss.on('connection', (ws: WebSocket) => {
    logger.info('New WebSocket connection');

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        logger.info('Received WebSocket message:', data);

        // Echo back for now
        ws.send(JSON.stringify({
          type: 'ack',
          message: 'Message received',
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        logger.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      logger.info('WebSocket connection closed');
    });

    ws.on('error', (error) => {
      logger.error('WebSocket error:', error);
    });

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connected',
      message: 'Connected to Enterprise Agentic IDE',
      timestamp: new Date().toISOString()
    }));
  });

  logger.info(`🔌 WebSocket Server running on port ${port}`);
}

export function broadcast(data: any) {
  if (!wss) return;

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

export { wss };
