import { Server } from 'socket.io';
import Session from '../models/Session.js';

let io = null;

export const initSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // We can restrict this or read ALLOWED_ORIGINS
      methods: ['GET', 'POST']
    }
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      return next(new Error('Authentication failed. No token provided.'));
    }

    try {
      const session = await Session.findByToken(token);
      if (!session || !session.is_active) {
        return next(new Error('Authentication failed. Invalid or inactive session.'));
      }

      socket.user = {
        id: session.user_id,
        role: session.role
      };
      next();
    } catch (err) {
      next(new Error('Authentication failed. Database error.'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket client connected: ${socket.id} (User: ${socket.user.id}, Role: ${socket.user.role})`);

    // Subscribe to rooms
    socket.join(`user:${socket.user.id}`);
    socket.join(`role:${socket.user.role}`);

    socket.on('disconnect', () => {
      console.log(`Socket client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const broadcastToRole = (role, event, data) => {
  if (io) {
    io.to(`role:${role}`).emit(event, data);
  }
};

export const broadcastToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

export const getIO = () => io;
