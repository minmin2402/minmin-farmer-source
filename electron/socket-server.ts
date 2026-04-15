import { WebSocketServer, WebSocket as WSWebSocket } from 'ws';
import { IncomingMessage } from 'http';

// Định nghĩa kiểu mở rộng để lưu deviceId vào socket
export type ExtendedWebSocket = WSWebSocket & {
  deviceId?: string | null;
};

class StreamServer {
  private wss: WebSocketServer | null = null;

  init(port: number = 8080) {
    this.wss = new WebSocketServer({ port });

    this.wss.on('connection', (ws: ExtendedWebSocket, req: IncomingMessage) => {
      const url = req.url || '';
      const params = new URLSearchParams(url.split('?')[1]);
      ws.deviceId = params.get('id');

      console.log(`📡 [WS] New connection for device: ${ws.deviceId}`);

      ws.on('close', () => {
        console.log(`🔌 [WS] Device ${ws.deviceId} disconnected`);
      });
    });

    console.log(`🚀 [WS] Server started on port ${port}`);
  }

  // Gửi data đến đúng thiết bị
  broadcastToDevice(deviceId: string, data: Buffer | Uint8Array) {
    if (!this.wss) return;

    this.wss.clients.forEach((client) => {
      const ws = client as ExtendedWebSocket;
      if (ws.readyState === WSWebSocket.OPEN && ws.deviceId === deviceId) {
        ws.send(data);
      }
    });
  }
}

export const streamServer = new StreamServer();