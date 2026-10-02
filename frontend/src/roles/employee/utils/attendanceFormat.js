/**
 * Attendance display helpers shared by the Employee Dashboard and the
 * Attendance page so both render punch state and working hours identically.
 *
 * All date math uses the timestamps returned by the API. The server decides
 * which business date ("today") a punch belongs to, so the frontend never
 * recomputes it from `toISOString()` — that UTC shortcut previously made the
 * Attendance page miss the current day's record in IST.
 */

/** `09:00 AM` style clock time. */
export function formatClock(ts) {
  if (!ts) return '--:--';
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return '--:--';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/** `09:00 AM – 01:00 PM` for a session, with "Running" for an open one. */
export function formatSessionRange(session) {
  if (!session) return '--';
  const end = session.is_active ? 'Running' : formatClock(session.check_out_time);
  return `${formatClock(session.check_in_time)} – ${end}`;
}

/** `4h 00m` from a minute count. */
export function formatDuration(minutes) {
  const total = Math.max(0, Math.floor(Number(minutes) || 0));
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h}h ${String(m).padStart(2, '0')}m`;
}

/** `4h 00m 12s` live ticking clock for the open session. */
export function formatLiveDuration(minutes, seconds = 0) {
  const safeMinutes = Math.max(0, Math.floor(Number(minutes) || 0));
  const h = Math.floor(safeMinutes / 60);
  const m = safeMinutes % 60;
  const s = String(seconds).padStart(2, '0');
  return `${h}h ${String(m).padStart(2, '0')}m ${s}s`;
}

/** Human date label, e.g. `Mon, Oct 1, 2026`. */
export function formatDateLabel(dateStr) {
  if (!dateStr) return '--';
  // Parse as a plain calendar date to avoid UTC shifting the day.
  const [y, m, d] = String(dateStr).split('-').map(Number);
  if (!y || !m || !d) return String(dateStr);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  });
}

/**
 * Worked minutes for the day, ticking live while a session is open.
 *
 * The server already folds the open session's elapsed time into
 * `worked_minutes`, but it does so at the moment the response was produced.
 * To keep the headline total moving without re-polling, add the minutes that
 * have passed since the response was received.
 *
 * `fetchedAtMs` must be the client clock reading taken immediately after the
 * request resolved; without it there is no reference point for the delta and
 * the total would simply repeat the (possibly stale) server value.
 *
 * Previously this function computed `elapsed` and then discarded it - both
 * branches returned `base` - so the total never advanced.
 */
export function liveWorkedMinutes(summary, fetchedAtMs = null, nowMs = Date.now()) {
  if (!summary) return 0;
  const base = Number(summary.worked_minutes) || 0;
  const open = summary?.current_session;
  if (!open || !open.is_active || !open.check_in_time) return base;
  if (!fetchedAtMs) return base;
  // Guard against a clock jump or a stale tab producing a negative or absurd
  // delta; the server value is always the floor.
  const delta = Math.floor((nowMs - fetchedAtMs) / 60000);
  if (!Number.isFinite(delta) || delta <= 0) return base;
  return base + Math.min(delta, 24 * 60);
}

/** Seconds elapsed in the open session, for a live ticking counter. */
export function openSessionElapsedSeconds(summary, nowMs = Date.now()) {
  const open = summary?.current_session;
  if (!open || !open.is_active || !open.check_in_time) return 0;
  return Math.max(0, Math.floor((nowMs - new Date(open.check_in_time).getTime()) / 1000));
}

/** PUNCHED IN / PUNCHED OUT / NOT PUNCHED label. */
export function punchStatusLabel(summary) {
  if (!summary || summary.session_count === 0) return 'NOT PUNCHED';
  return summary.is_punched_in ? 'PUNCHED IN' : 'PUNCHED OUT';
}

/** Bootstrap badge class for the punch status. */
export function punchStatusClass(summary) {
  if (!summary || summary.session_count === 0) return 'bg-secondary';
  return summary.is_punched_in ? 'bg-success' : 'bg-primary';
}
