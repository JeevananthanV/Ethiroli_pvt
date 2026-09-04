import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { connectSocket, disconnectSocket } from '../../socket.js';
import { useAppDispatch } from '../../store/hooks.js';
import { addLead, updateLeadItem } from '../../store/slices/leadsSlice.js';
import { addFeedItem } from '../../store/slices/feedSlice.js';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { isAuthenticated, socketToken } = useAuth();
  const dispatch = useAppDispatch();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (isAuthenticated && socketToken) {
      const s = connectSocket(socketToken);
      setSocket(s);

      s.on('lead_created', (lead) => {
        dispatch(addLead(lead));
      });

      s.on('lead_status_changed', (payload) => {
        dispatch(updateLeadItem({ id: payload.id, status: payload.status }));
      });

      s.on('new_activity', (activity) => {
        dispatch(addFeedItem(activity));
        // Trigger a simple native browser notification if allowed
        if (Notification.permission === 'granted') {
          new Notification('Ethiroli Alert', { body: activity.message });
        }
      });

      return () => {
        s.off('lead_created');
        s.off('lead_status_changed');
        s.off('new_activity');
        disconnectSocket();
        setSocket(null);
      };
    } else {
      disconnectSocket();
      setSocket(null);
    }
  }, [isAuthenticated, socketToken]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
