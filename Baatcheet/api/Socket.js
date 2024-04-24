
const WebSocket = require('ws');

class WebSocketServer {
  constructor(port) {
    this.port = port;
    this.clients = [];
    this.server = null;
  }

  start() {
    this.server = new WebSocket.Server({ port: this.port });

    this.server.on('connection', (client) => {
      console.log('New client connected');
      this.clients.push(client);

      client.on('message', (message) => {
        console.log('Received message:', message);
        this.broadcast(message);
      });

      client.on('close', () => {
        console.log('Client disconnected');
        this.clients = this.clients.filter(c => c !== client);
      });
    });

    console.log('WebSocket server started on port', this.port);
  }

  broadcast(message) {
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  stop() {
    this.server.close();
    console.log('WebSocket server stopped');
  }
}
 
const port = 3000;
const server = new WebSocketServer(port);
server.start();

// Graceful shutdown
process.on('SIGINT', () => {
  server.stop();
  process.exit();
});
