/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { connectSocket, disconnectSocket } from '../../socket.js';
import { useAppDispatch } from '../../store/hooks.js';
import { addLead, updateLeadItem } from '../../store/slices/leadsSlice.js';
import { addFeedItem } from '../../store/slices/feedSlice.js';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { isAuthenticated, socketToken, user } = useAuth();
  const dispatch = useAppDispatch();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (isAuthenticated && socketToken) {
      const s = connectSocket(socketToken);
      setSocket(s);

      // Generic events
      s.on('lead_created', (lead) => {
        dispatch(addLead(lead));
      });

      s.on('lead_status_changed', (payload) => {
        dispatch(updateLeadItem({ id: payload.id, status: payload.status }));
      });

      s.on('new_activity', (activity) => {
        dispatch(addFeedItem(activity));
        if (Notification.permission === 'granted') {
          new Notification('Ethiroli Alert', { body: activity.message });
        }
      });

      // HR-specific live data events
      if (user?.role === 'HR' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
        s.on('hr_attendance_update', (data) => {
          console.log('[LIVE] Attendance updated:', data);
          dispatch(addFeedItem({
            event_type: 'ATTENDANCE_UPDATE',
            entity_type: 'Attendance',
            message: `Attendance recorded: ${data.employee?.full_name || 'Unknown'} - ${data.status}`,
            entity_id: data.id,
            created_at: data.timestamp
          }));
        });

        s.on('hr_leave_request', (data) => {
          console.log('[LIVE] Leave request updated:', data);
          dispatch(addFeedItem({
            event_type: 'LEAVE_REQUEST',
            entity_type: 'Leave',
            message: `Leave ${data.action}: ${data.employee?.full_name || 'Unknown'} (${data.leaveType})`,
            entity_id: data.id,
            created_at: data.timestamp
          }));
        });

        s.on('hr_employee_update', (data) => {
          console.log('[LIVE] Employee updated:', data);
          dispatch(addFeedItem({
            event_type: 'EMPLOYEE_UPDATE',
            entity_type: 'Employee',
            message: `Employee record updated`,
            entity_id: data.id,
            created_at: data.timestamp
          }));
        });
      }

      return () => {
        s.off('lead_created');
        s.off('lead_status_changed');
        s.off('new_activity');
        s.off('hr_attendance_update');
        s.off('hr_leave_request');
        s.off('hr_employee_update');
        disconnectSocket();
        setSocket(null);
      };
    } else {
      disconnectSocket();
      setSocket(null);
    }
  }, [isAuthenticated, socketToken, user?.role, dispatch]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
