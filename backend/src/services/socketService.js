import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createAdapter as createClusterAdapter } from '@socket.io/cluster-adapter';
import Session from '../models/Session.js';
import { logger } from '../config/logger.js';
import { ALLOWED_ORIGINS } from '../config/constants.js';
import { getRedisClient } from '../config/redis.js';
import { lookupSession } from '../middleware/auth.js';

let io = null;

export const initSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: ALLOWED_ORIGINS,
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling'],
    pingTimeout: Number(process.env.SOCKET_PING_TIMEOUT || 60000),
    pingInterval: Number(process.env.SOCKET_PING_INTERVAL || 25000)
  });

  // Initialize adapters for horizontal scaling
  const isClusterMode = process.env.CLUSTER_MODE === 'true';

  try {
    if (isClusterMode) {
      // Use Redis adapter for cluster mode
      const pubClient = getRedisClient();
      const subClient = pubClient.duplicate();

      const adapter = createAdapter(pubClient, subClient);
      io.adapter(adapter);

      logger.info('Socket.IO Redis adapter initialized for cluster mode');

      // Handle Redis adapter events
      pubClient.on('connect', () => {
        logger.info('Redis publisher client connected');
      });

      subClient.on('connect', () => {
        logger.info('Redis subscriber client connected');
      });

      pubClient.on('error', (err) => {
        logger.error('Redis publisher client error', { error: err.message });
      });

      subClient.on('error', (err) => {
        logger.error('Redis subscriber client error', { error: err.message });
      });
    } else if (typeof process.send === 'function') {
      // Use cluster adapter for backward compatibility if running in cluster worker
      const clusterAdapter = createClusterAdapter();
      io.adapter(clusterAdapter);

      logger.info('Socket.IO cluster adapter initialized for backward compatibility');
    } else {
      logger.info('Socket.IO running in standalone single instance mode');
    }
  } catch (err) {
    logger.error('Failed to initialize Socket.IO adapter', { error: err.message, stack: err.stack });
    // Continue without adapter - will work in single instance mode
    logger.warn('Socket.IO running without adapter (single instance mode)');
  }

  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;

    if (!token) {
      return next(new Error('Authentication failed. No token provided.'));
    }

    try {
      const session = await lookupSession(token);
      if (!session || !session.is_active) {
        return next(new Error('Authentication failed. Invalid or inactive session.'));
      }

      socket.user = {
        id: session.user_id,
        role: session.role,
        email: session.email
      };

      logger.info('Socket client authenticated', {
        socketId: socket.id,
        userId: session.user_id,
        role: session.role
      });

      next();
    } catch (err) {
      logger.error('Socket authentication error', { error: err.message });
      next(new Error('Authentication failed. Database error.'));
    }
  });

  io.on('connection', (socket) => {
    logger.info('Socket client connected', {
      socketId: socket.id,
      userId: socket.user.id,
      role: socket.user.role
    });

    socket.join(`user:${socket.user.id}`);
    socket.join(`role:${socket.user.role}`);

    socket.on('join_room', (room) => {
      if (room && typeof room === 'string') {
        socket.join(room);
        logger.info(`Socket ${socket.id} joined room ${room}`);
      }
    });

    socket.on('leave_room', (room) => {
      if (room && typeof room === 'string') {
        socket.leave(room);
        logger.info(`Socket ${socket.id} left room ${room}`);
      }
    });

    socket.on('disconnect', (reason) => {
      logger.info('Socket client disconnected', {
        socketId: socket.id,
        userId: socket.user.id,
        role: socket.user.role,
        reason
      });
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

export const broadcastToRoom = (room, event, data) => {
  if (io) {
    io.to(room).emit(event, data);
  }
};

export const getIO = () => io;
