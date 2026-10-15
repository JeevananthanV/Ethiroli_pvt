import React, { useCallback } from 'react';
import DynamicCalendarPage from '../../../modules/calendar/pages/DynamicCalendarPage.jsx';
import financePortalApi from '../../../services/api/financePortalApi.js';

export default function FinanceCalendar() {
  // Stable identity so the calendar's attendance effect does not refetch on
  // every render. The endpoint is scoped to the signed‑in finance server‑side.
  const loadAttendance = useCallback(
    (month) => financePortalApi.getMonthlyAttendance(month),
    []
  );

  return <DynamicCalendarPage defaultRole="FINANCE" attendanceLoader={loadAttendance} />;
}
