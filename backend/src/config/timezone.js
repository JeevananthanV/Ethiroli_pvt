/**
 * Business-timezone helpers.
 *
 * Attendance, payroll and leave all key off a *business* day ("today" for the
 * employee), not UTC. Previously the employee frontend computed "today" with
 * `new Date().toISOString().slice(0, 10)`, which is the UTC date. In IST (UTC+5:30)
 * that returns the *previous* day between 00:00 and 05:30 local time, so the
 * Attendance page failed to find the current day's record and the Punch Out
 * button stayed disabled.
 *
 * This module is the single source of truth for the business timezone so the
 * API returns the same `work_date` the server actually stored, and the frontend
 * simply renders the date it is given instead of recomputing it.
 */
import 'dotenv/config';

/** IANA timezone used for attendance day boundaries. Defaults to IST. */
export const BUSINESS_TIMEZONE = process.env.APP_TIMEZONE || process.env.TZ || 'Asia/Kolkata';

/**
 * Format a Date as a `YYYY-MM-DD` string in the business timezone.
 * @param {Date|number|string} [input] defaults to now
 * @returns {string} e.g. '2026-10-01'
 */
export function businessDate(input = new Date()) {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return null;
  // en-CA renders ISO-style YYYY-MM-DD, which is stable across ICU versions.
  return date.toLocaleDateString('en-CA', { timeZone: BUSINESS_TIMEZONE });
}

/**
 * The `YYYY-MM-DD` business date plus the offset to add to a UTC timestamp to
 * get the local wall-clock components. Used when reading DATE/DATETIME columns
 * that the driver returns as UTC instants.
 */
export function timezoneOffsetMinutes(timezone = BUSINESS_TIMEZONE) {
  try {
    const now = new Date();
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour12: false,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    const parts = Object.fromEntries(dtf.formatToParts(now).map((p) => [p.type, p.value]));
    const asUtc = Date.UTC(
      Number(parts.year), Number(parts.month) - 1, Number(parts.day),
      Number(parts.hour) % 24, Number(parts.minute), Number(parts.second),
    );
    return Math.round((asUtc - now.getTime()) / 60000);
  } catch {
    return 0;
  }
}

/**
 * Convert a `YYYY-MM-DD` business date + minutes-since-midnight into a
 * wall-clock datetime string MySQL accepts.
 */
export function wallClock(dateStr, minutesFromMidnight) {
  const base = new Date(`${dateStr}T00:00:00Z`);
  base.setUTCMinutes(base.getUTCMinutes() + minutesFromMidnight);
  return base.toISOString().slice(0, 19).replace('T', ' ');
}
