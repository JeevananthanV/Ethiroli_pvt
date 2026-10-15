/**
 * Live‑ticking "worked minutes" helper.
 *
 * Usage (inside a component that has `todaySummary` from the API):
 *
 *   const [todaySummary, setTodaySummary] = useState(null);
 *
 *   useEffect(() => {
 *     const interval = setInterval(() => setTodaySummary(prev => ({ ...prev, fetchedAtMs: Date.now() })), 1000);
 *     return () => clearInterval(interval);
 *   }, []);
 *
 *   // rendered somewhere:
 *   <span>{liveWorkedMinutes(todaySummary)}</span>
 *
 * The function adds elapsed seconds since `fetchedAtMs` to the stored
 * `worked_minutes` so the displayed total keeps ticking while the session
 * is open, exactly like the employee/intern portals do.
 */
export function liveWorkedMinutes(summary, fetchedAtMs = null, nowMs = Date.now()) {
  // If we have no summary or no fetchedAt, just return the stored minutes.
  if (!summary) return null;

  const storedMinutes = Number(summary.worked_minutes) || 0;
  const elapsedSecs = ((nowMs - (fetchedAtMs || 0)) / 1000) || 0; // seconds
  const totalSecs = storedMinutes * 60 + elapsedSecs;
  const totalMins = totalSecs / 60;

  const mins = Math.floor(totalMins);
  const secs = Math.round((totalMins - mins) * 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}