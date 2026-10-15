import React from 'react';
import { useCallback } from 'react';
import DynamicCalendarPage from '../../../modules/calendar/pages/DynamicCalendarPage.jsx';
import employeePortalApi from '../../../services/api/employeePortalApi.js';

export default function InternCalendar() {
  // Stable identity so the calendar's attendance effect does not refetch on
  // every render. The endpoint is scoped to the signed-in intern server-side.
  const loadAttendance = useCallback(
    (month) => employeePortalApi.getMonthlyAttendance(month),
    []
  );

  return <DynamicCalendarPage defaultRole="INTERN" attendanceLoader={loadAttendance} />;
}
