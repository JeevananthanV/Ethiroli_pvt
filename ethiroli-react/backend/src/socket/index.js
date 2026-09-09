import { initSocketServer, broadcastToRole, broadcastToUser, getIO } from '../services/socketService.js';
import setupHandlers from './handlers.js';

import http from 'http';

const SOCKET_PORT = Number(process.env.SOCKET_PORT || 3003);

export let httpServer = http.createServer();

const io = initSocketServer(httpServer);
setupHandlers(io);

httpServer.listen(SOCKET_PORT, () => {
  console.log(`Socket.IO server listening on port ${SOCKET_PORT}`);
});

export { io, broadcastToRole, broadcastToUser, getIO };
