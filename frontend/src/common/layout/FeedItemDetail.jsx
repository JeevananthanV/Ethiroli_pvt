import React, { useEffect } from 'react';

/**
 * FeedItemDetail - the full record behind one entry in the Activity Feed tray.
 *
 * The tray only shows a one-line `payload.message` plus a bare HH:MM, so a feed
 * row could not be inspected any further. This dialog surfaces the whole event:
 * the human-readable message, every field the payload carries, the event and
 * entity type, who triggered it, and the full timestamp.
 *
 * Rendered only when the signed-in role is EMPLOYEE, so no other portal's
 * notification tray changes behaviour.
 *
 * Self-contained overlay rather than a bootstrap modal, because the portal does
 * not load bootstrap.js and therefore cannot rely on `data-bs-toggle`.
 */

const humanise = (value) =>
  String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

/** `payload` may already be parsed or still a JSON string. */
const parsePayload = (raw) => {
  if (!raw) return null;
  if (typeof raw === 'object') return raw;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
};

const formatStamp = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString([], {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export default function FeedItemDetail({ item, onClose, onMarkRead }) {
  const open = Boolean(item);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!item) return null;

  const payload = parsePayload(item.payload);
  const message = payload?.message || item.payload?.message || `Event: ${item.event_type || 'unknown'}`;

  // Everything except `message`, which is already shown as the headline, so the
  // detail list adds information rather than repeating it.
  const extraFields = payload
    ? Object.entries(payload).filter(([key]) => key !== 'message')
    : [];

  return (
    <div
      className="feedDetailBackdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="feedDetailModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedDetailTitle"
        tabIndex={-1}
      >
        <div className="feedDetailHead">
          <div className="feedDetailIcon" aria-hidden="true">
            <i className="bi bi-bell-fill"></i>
          </div>
          <div className="feedDetailHeadText">
            <h3 className="feedDetailTitle" id="feedDetailTitle">
              {humanise(item.event_type) || 'Notification'}
            </h3>
            <span className="feedDetailSub">
              {item.entity_type ? `${humanise(item.entity_type)} · ` : ''}
              {formatStamp(item.created_at)}
            </span>
          </div>
          {!item.is_read && (
            <span className="badge bg-primary rounded-pill">New</span>
          )}
          <button
            type="button"
            className="closeBtn"
            onClick={onClose}
            aria-label="Close notification detail"
          >
            &times;
          </button>
        </div>

        <div className="feedDetailBody">
          <p className="feedDetailMessage">{message}</p>

          <dl className="feedDetailList">
            <div className="feedDetailRow">
              <dt>Event</dt>
              <dd className="font-monospace">{item.event_type || '—'}</dd>
            </div>

            {item.entity_type && (
              <div className="feedDetailRow">
                <dt>Category</dt>
                <dd>{humanise(item.entity_type)}</dd>
              </div>
            )}

            {item.entity_id && (
              <div className="feedDetailRow">
                <dt>Reference</dt>
                <dd className="font-monospace text-break">{item.entity_id}</dd>
              </div>
            )}

            {item.actor_name && (
              <div className="feedDetailRow">
                <dt>Triggered by</dt>
                <dd>{item.actor_name}</dd>
              </div>
            )}

            <div className="feedDetailRow">
              <dt>Received</dt>
              <dd>{formatStamp(item.created_at) || '—'}</dd>
            </div>

            <div className="feedDetailRow">
              <dt>Status</dt>
              <dd>
                <span className={`badge ${item.is_read ? 'bg-secondary' : 'bg-primary'}`}>
                  {item.is_read ? 'Read' : 'Unread'}
                </span>
              </dd>
            </div>

            {extraFields.map(([key, value]) => (
              <div className="feedDetailRow" key={key}>
                <dt>{humanise(key)}</dt>
                <dd className="text-break">
                  {value === null || value === undefined || value === ''
                    ? '—'
                    : typeof value === 'object'
                      ? JSON.stringify(value)
                      : String(value)}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="feedDetailActions">
          <button type="button" className="btn btn-light" onClick={onClose}>
            Close
          </button>
          {!item.is_read && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onMarkRead(item.id);
                onClose();
              }}
            >
              <i className="bi bi-check2 me-1" aria-hidden="true"></i>
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
