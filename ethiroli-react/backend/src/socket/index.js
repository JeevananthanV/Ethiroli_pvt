import { initSocketServer, broadcastToRole, broadcastToUser, getIO } from '../services/socketService.js';
import setupHandlers from './handlers.js';

let ioInstance = null;

/**
 * Attaches Socket.IO to the main Express HTTP server.
 * This ensures WebSockets run on the exact same port (PORT) via /socket.io,
 * making it fully compatible with Hostinger, reverse proxies, and single-port cloud hosts.
 */
export const attachSocket = (httpServer) => {
  ioInstance = initSocketServer(httpServer);
  setupHandlers(ioInstance);
  return ioInstance;
};

export const getIOInstance = () => ioInstance || getIO();

export { broadcastToRole, broadcastToUser, getIO };
export default attachSocket;
