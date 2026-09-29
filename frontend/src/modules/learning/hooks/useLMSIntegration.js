import { useState, useEffect, useRef, useCallback, useReducer } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import axiosInstance from '../../../../services/api/axiosInstance.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const LMS_API_BASE_URL = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;

const REFRESH_THRESHOLD_MS = 60000;
const RECONNECT_DELAYS = [1000, 2000, 4000, 8000, 16000];
const MAX_RECONNECT_ATTEMPTS = 5;
const MAX_QUEUE_SIZE = 500;

const DB_NAME = 'lms_telemetry_db';
const DB_VERSION = 1;
const STORE_NAME = 'telemetry_queue';

function indexedDBOpen() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('type', 'type', { unique: false });
      }
    };
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

async function addToQueue(record) {
  try {
    const db = await indexedDBOpen();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    record.timestamp = record.timestamp || Date.now();
    store.add(record);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error('Failed to add to IndexedDB queue:', error);
  }
}

async function getQueue() {
  try {
    const db = await indexedDBOpen();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to read IndexedDB queue:', error);
    return [];
  }
}

async function clearQueue() {
  try {
    const db = await indexedDBOpen();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      store.clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error('Failed to clear IndexedDB queue:', error);
  }
}

async function removeFromQueue(id) {
  try {
    const db = await indexedDBOpen();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error('Failed to remove from IndexedDB queue:', error);
  }
}

function lmsReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'SET_ENGAGEMENT':
      return { ...state, engagement: { ...state.engagement, ...action.payload } };
    case 'SET_VIDEO_POSITION':
      return { ...state, videoPosition: action.payload };
    case 'SET_QUIZ_ANSWERS':
      return { ...state, quizAnswers: { ...state.quizAnswers, ...action.payload } };
    case 'SET_QUEUE_SIZE':
      return { ...state, queuedEvents: action.payload };
    case 'SET_IS_ONLINE':
      return { ...state, isOnline: action.payload };
    case 'SET_SESSION':
      return { ...state, session: action.payload };
    default:
      return state;
  }
}

const initialState = {
  loading: false,
  error: null,
  progress: 0,
  engagement: {
    timeOnTask: 0,
    videoPosition: 0,
    quizAnswers: [],
    lastActiveTimestamp: null,
  },
  videoPosition: 0,
  quizAnswers: {},
  queuedEvents: 0,
  isOnline: navigator.onLine,
  session: null,
};

let refreshQueue = [];
let isRefreshing = false;

async function refreshToken() {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      refreshQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;
  try {
    const refreshToken = localStorage.getItem('refresh_token') || localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${LMS_API_BASE_URL}/v1/auth/refresh`, {
      refreshToken,
    });

    const { token, newRefreshToken } = response.data;
    localStorage.setItem('auth_token', token);
    if (newRefreshToken) {
      localStorage.setItem('refresh_token', newRefreshToken);
    }

    const resolvedPromise = (val) => { refreshQueue.forEach((cb) => cb.resolve(val)); refreshQueue = []; };
    resolvedPromise(token);
    return token;
  } catch (error) {
    const rejectedPromise = (err) => { refreshQueue.forEach((cb) => cb.reject(err)); refreshQueue = []; };
    rejectedPromise(error);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    window.dispatchEvent(new Event('auth-logout'));
    throw error;
  } finally {
    isRefreshing = false;
  }
}

export function useLMSIntegration(courseId, userId) {
  const [state, dispatch] = useReducer(lmsReducer, initialState);
  const socketRef = useRef(null);
  const axiosLmsRef = useRef(null);
  const timerRef = useRef(null);
  const videoPositionRef = useRef(0);
  const engagementStartRef = useRef(null);
  const reconnectAttemptRef = useRef(0);
  const reconnectTimerRef = useRef(null);
  const mountedRef = useRef(true);
  const engagementIntervalRef = useRef(null);

  const createLmsAxios = useCallback(() => {
    const instance = axios.create({
      baseURL: `${LMS_API_BASE_URL}/v1/lms`,
      withCredentials: true,
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' },
    });

    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
      (response) => {
        const data = response.data;
        if (data && data.session) {
          const sessionExpiry = new Date(data.session.expiresAt).getTime();
          const now = Date.now();
          if (sessionExpiry - now < REFRESH_THRESHOLD_MS && !data.session.refreshed) {
            refreshToken().then((newToken) => {
              localStorage.setItem('auth_token', newToken);
              instance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
            }).catch((err) => {
              console.error('Auto session refresh failed:', err);
            });
          }
        }
        return data;
      },
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newToken = await refreshToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return instance(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, []);

  const emitSocketEvent = useCallback((eventName, payload) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit(eventName, { ...payload, courseId, userId });
    } else {
      addToQueue({ type: 'socket_emit', eventName, payload, courseId, userId });
      dispatch({ type: 'SET_QUEUE_SIZE', payload: state.queuedEvents + 1 });
    }
  }, [courseId, userId, state.queuedEvents]);

  const setupSocket = useCallback(() => {
    if (!socketRef.current || socketRef.current.disconnected) {
      const socket = io(LMS_API_BASE_URL.replace('/api', ''), {
        reconnection: true,
        reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
        reconnectionDelay: (index) => RECONNECT_DELAYS[Math.min(index, RECONNECT_DELAYS.length - 1)] || 16000,
        timeout: 10000,
        transports: ['websocket', 'polling'],
        auth: {
          token: localStorage.getItem('auth_token') || localStorage.getItem('token'),
        },
      });

      socket.on('connect', () => {
        if (!mountedRef.current) return;
        reconnectAttemptRef.current = 0;
        dispatch({ type: 'SET_IS_ONLINE', payload: true });
        flushQueue();
        socket.emit('join-course', { courseId, userId });
      });

      socket.on('disconnect', (reason) => {
        if (!mountedRef.current) return;
        dispatch({ type: 'SET_IS_ONLINE', payload: false });
        if (reason === 'io server disconnect') {
          reconnectAttemptRef.current = 0;
        }
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
      });

      socket.on('reconnect', (attempt) => {
        if (!mountedRef.current) return;
        reconnectAttemptRef.current = 0;
        dispatch({ type: 'SET_IS_ONLINE', payload: true });
        flushQueue();
        socket.emit('join-course', { courseId, userId });
      });

      socket.on('reconnect_failed', () => {
        if (!mountedRef.current) return;
        console.error('Socket reconnection failed after max attempts');
      });

      socket.on('session_expired', async (data) => {
        try {
          await refreshToken();
          socket.emit('reauthenticate', { courseId, userId });
        } catch (err) {
          console.error('Session expired and refresh failed:', err);
        }
      });

      socket.on('progress_update', (data) => {
        if (!mountedRef.current) return;
        dispatch({ type: 'SET_PROGRESS', payload: data.progress });
      });

      socket.on('engagement_event', (data) => {
        if (!mountedRef.current) return;
        dispatch({ type: 'SET_ENGAGEMENT', payload: data });
      });

      socketRef.current = socket;
    }
  }, [courseId, userId]);

  const flushQueue = useCallback(async () => {
    try {
      const queuedEvents = await getQueue();
      if (queuedEvents.length === 0) return;

      const sortedEvents = queuedEvents.sort((a, b) => a.timestamp - b.timestamp);
      for (const event of sortedEvents) {
        try {
          if (event.type === 'socket_emit') {
            socketRef.current?.emit(event.eventName, event.payload);
          } else if (event.type === 'api_call') {
            await axiosLmsRef.current?.request(event.config);
          }
          await removeFromQueue(event.id);
        } catch (error) {
          console.error('Failed to flush queue event:', event.id, error);
          if (state.queuedEvents > MAX_QUEUE_SIZE) {
            await removeFromQueue(event.id);
          }
        }
      }
      dispatch({ type: 'SET_QUEUE_SIZE', payload: Math.max(0, state.queuedEvents - sortedEvents.length) });
    } catch (error) {
      console.error('Failed to flush telemetry queue:', error);
    }
  }, [state.queuedEvents]);

  const trackTimeOnTask = useCallback(() => {
    if (!engagementStartRef.current) {
      engagementStartRef.current = Date.now();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!mountedRef.current || !engagementStartRef.current) return;
      const elapsed = Math.floor((Date.now() - engagementStartRef.current) / 1000);
      dispatch({ type: 'SET_ENGAGEMENT', payload: { timeOnTask: elapsed, lastActiveTimestamp: Date.now() } });
      emitSocketEvent('time_on_task', { timeOnTask: elapsed, courseId });
    }, 5000);
  }, [courseId, emitSocketEvent]);

  const trackVideoPosition = useCallback((currentTime, duration) => {
    videoPositionRef.current = currentTime;
    const position = duration > 0 ? Math.round((currentTime / duration) * 100) : 0;
    dispatch({ type: 'SET_VIDEO_POSITION', payload: position });
    emitSocketEvent('video_position', { currentTime, duration, position, courseId });
  }, [courseId, emitSocketEvent]);

  const trackQuizAnswer = useCallback((questionId, answer, isCorrect) => {
    dispatch({ type: 'SET_QUIZ_ANSWERS', payload: { [questionId]: { answer, isCorrect, timestamp: Date.now() } } });
    emitSocketEvent('quiz_answer', { questionId, answer, isCorrect, courseId });
  }, [courseId, emitSocketEvent]);

  const optimisticUpdateProgress = useCallback(async (lessonId, newProgress) => {
    const previousProgress = state.progress;
    dispatch({ type: 'SET_PROGRESS', payload: newProgress });

    try {
      await axiosLmsRef.current.put('/enrollments/progress', {
        progress: newProgress,
        lessonId,
        userId,
      });
    } catch (error) {
      console.error('Optimistic update failed, reverting:', error);
      dispatch({ type: 'SET_PROGRESS', payload: previousProgress });
      addToQueue({
        type: 'api_call',
        config: {
          method: 'put',
          url: '/enrollments/progress',
          data: { progress: newProgress, lessonId, userId },
        },
      });
      dispatch({ type: 'SET_QUEUE_SIZE', payload: state.queuedEvents + 1 });
    }
  }, [state.progress, courseId, userId, state.queuedEvents]);

  const startEngagementTracking = useCallback(() => {
    if (engagementIntervalRef.current) return;
    trackTimeOnTask();
    engagementIntervalRef.current = setInterval(() => {
      if (!mountedRef.current) return;
      const engagement = {
        timeOnTask: state.engagement.timeOnTask,
        videoPosition: state.videoPosition,
        quizAnswers: state.engagement.quizAnswers,
      };
      emitSocketEvent('engagement_metric', engagement);
    }, 15000);
  }, [state.engagement, state.videoPosition, trackTimeOnTask, emitSocketEvent]);

  const stopEngagementTracking = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (engagementIntervalRef.current) {
      clearInterval(engagementIntervalRef.current);
      engagementIntervalRef.current = null;
    }
    if (engagementStartRef.current) {
      const totalTime = Math.floor((Date.now() - engagementStartRef.current) / 1000);
      emitSocketEvent('time_on_task', { timeOnTask: totalTime, courseId });
      engagementStartRef.current = null;
    }
  }, [courseId, emitSocketEvent]);

  const refreshSession = useCallback(async () => {
    try {
      const newToken = await refreshToken();
      dispatch({ type: 'SET_SESSION', payload: { token: newToken, refreshedAt: Date.now() } });
      if (socketRef.current) {
        socketRef.current.auth = { token: newToken };
      }
      return newToken;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Session refresh failed' });
      throw error;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    axiosLmsRef.current = createLmsAxios();

    const handleOnline = () => {
      dispatch({ type: 'SET_IS_ONLINE', payload: true });
      flushQueue();
      setupSocket();
    };
    const handleOffline = () => {
      dispatch({ type: 'SET_IS_ONLINE', payload: false });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setupSocket();

    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
      if (engagementIntervalRef.current) clearInterval(engagementIntervalRef.current);
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      stopEngagementTracking();
      if (socketRef.current) {
        socketRef.current.off('connect');
        socketRef.current.off('disconnect');
        socketRef.current.off('connect_error');
        socketRef.current.off('reconnect');
        socketRef.current.off('reconnect_failed');
        socketRef.current.off('session_expired');
        socketRef.current.off('progress_update');
        socketRef.current.off('engagement_event');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [createLmsAxios, setupSocket, flushQueue, stopEngagementTracking]);

  return {
    state,
    trackTimeOnTask,
    trackVideoPosition,
    trackQuizAnswer,
    optimisticUpdateProgress,
    refreshSession,
    emitSocketEvent,
    isOnline: state.isOnline,
    queuedEvents: state.queuedEvents,
    progress: state.progress,
    engagement: state.engagement,
    videoPosition: state.videoPosition,
    quizAnswers: state.quizAnswers,
    error: state.error,
    socket: socketRef,
    axiosInstance: axiosLmsRef,
  };
}

export default useLMSIntegration;

