/**
 * Time formatting for the Intern portal (IMS) and anything it shares.
 *
 * Why this exists: `toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })`
 * has no fixed hour cycle. On an en-US browser it yields "01:57 pm", but on an
 * en-GB one it yields "13:57" - the 24-hour "railway" format. The same page
 * therefore rendered different times for different users.
 *
 * Everything here pins 12-hour AM/PM so the intern portal always shows
 * "1:57 PM" regardless of the machine's locale.
 */

/** 24h -> 12h parts: { hour: 1..12, minute, period: 'AM' | 'PM' } */
export const to12Hour = (value) => {
  const d = value instanceof Date ? value : new Date(value);
  if (!value || Number.isNaN(d.getTime())) return null;

  const hours24 = d.getHours();
  const period = hours24 >= 12 ? 'PM' : 'AM';
  // 0 and 12 both map to 12.
  const hour12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  return {
    hour: hour12,
    minute: d.getMinutes(),
    second: d.getSeconds(),
    period
  };
};

/** "1:57 PM" - the standard display form used across the intern portal. */
export const formatTime12 = (value) => {
  const p = to12Hour(value);
  if (!p) return '—';
  return `${p.hour}:${String(p.minute).padStart(2, '0')} ${p.period}`;
};

/** "1:57:04 PM" - for live counters that show seconds. */
export const formatTime12WithSeconds = (value) => {
  const p = to12Hour(value);
  if (!p) return '—';
  return `${p.hour}:${String(p.minute).padStart(2, '0')}:${String(p.second).padStart(2, '0')} ${p.period}`;
};

/** "01:57 PM" - zero-padded hour, for fixed-width columns such as tables. */
export const formatTime12Padded = (value) => {
  const p = to12Hour(value);
  if (!p) return '—';
  return `${String(p.hour).padStart(2, '0')}:${String(p.minute).padStart(2, '0')} ${p.period}`;
};

/** Just the AM/PM marker, e.g. for axis labels split across two lines. */
export const formatPeriod = (value) => to12Hour(value)?.period ?? '';