import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { useAppSelector, useAppDispatch } from '../../../store/hooks.js';
import {
  fetchFeedStart,
  fetchFeedSuccess,
  fetchFeedFailure,
  markFeedItemRead,
} from '../../../store/slices/feedSlice.js';
import { getFeed, markRead, markAllRead } from '../../../services/api/feedApi.js';
import { formatTime12 } from '../../../common/utils/timeFormat.js';

/** Maps a backend event_type onto the icon, filter category and destination the
 *  intern portal uses. Anything unmapped still renders, under "System". */
const EVENT_MAP = {
  TASK_COMPLETED: { category: 'Tasks', icon: 'bi-check2-square text-warning', url: '/app/intern/tasks' },
  TASK_ASSIGNED: { category: 'Tasks', icon: 'bi-person-badge text-primary', url: '/app/intern/tasks' },
  WORKLOG_REVIEWED: { category: 'Mentor', icon: 'bi-check-circle-fill text-success', url: '/app/intern/work-log' },
  ASSIGNMENT_GRADED: { category: 'Tasks', icon: 'bi-file-earmark-code-fill text-info', url: '/app/intern/assignments' },
  CERTIFICATE_ISSUED: { category: 'System', icon: 'bi-award text-primary', url: '/app/intern/certificate' },
  STIPEND_PROCESSED: { category: 'HR', icon: 'bi-cash-coin text-success', url: '/app/intern/documents' },
  DOUBT_ANSWERED: { category: 'Mentor', icon: 'bi-chat-left-dots text-primary', url: '/app/intern/mentor' },
  ATTENDANCE_MARKED: { category: 'System', icon: 'bi-calendar-check-fill text-success', url: '/app/intern/attendance' },
};

/** Human-friendly relative time, falling back to an absolute 12-hour stamp. */
function relativeTime(iso) {
  if (!iso) return '';
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return '';

  const mins = Math.round((Date.now() - then.getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  if (days <= 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ` • ${formatTime12(then)}`;
}

export default function InternNotifications() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [busy, setBusy] = useState(false);

  const dispatch = useAppDispatch();
  // Read the same slice MainLayout already populates, so the bell badge on the
  // navbar and this page can never disagree.
  const feedItems = useAppSelector((state) => state.feed.items);
  const feedLoading = useAppSelector((state) => state.feed.loading);
  const feedError = useAppSelector((state) => state.feed.error);

  /** Reload the feed. MainLayout also loads it on mount, so this is only used
   *  for the retry button and after a failed mutation. */
  const reloadFeed = async () => {
    dispatch(fetchFeedStart());
    try {
      const data = await getFeed();
      dispatch(fetchFeedSuccess(data));
    } catch (err) {
      dispatch(fetchFeedFailure(err?.message || 'Could not load notifications.'));
    }
  };

  const notifications = (feedItems || []).map((item) => {
    const mapped = EVENT_MAP[item.event_type] || {
      category: 'System',
      icon: 'bi-bell-fill text-secondary',
      url: '/app/intern/dashboard',
    };
    // The API may return payload as an object or as a JSON string.
    let payload = item.payload;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch {
        payload = { message: payload };
      }
    }
    const desc = payload?.message || item.event_type.replace(/_/g, ' ').toLowerCase();
    return {
      id: item.id,
      title: item.event_type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      desc,
      category: mapped.category,
      time: relativeTime(item.created_at),
      unread: !item.is_read,
      icon: mapped.icon,
      actionUrl: mapped.url,
    };
  });

  // Only offer filters that actually have notifications behind them.
  const categories = ['All', ...Array.from(new Set(notifications.map((n) => n.category)))];

  const filtered = notifications.filter(
    (n) => activeFilter === 'All' || n.category === activeFilter
  );

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Per-category unread counts, shown on the filter pills.
  const countFor = (cat) =>
    cat === 'All'
      ? unreadCount
      : notifications.filter((n) => n.category === cat && n.unread).length;

  const markAllAsRead = async () => {
    setBusy(true);
    try {
      await markAllRead();
      // Re-read from the server so the navbar badge updates from the same source.
      await reloadFeed();
    } catch {
      /* leave the list untouched if the call failed */
    } finally {
      setBusy(false);
    }
  };

  const markSingleAsRead = async (id) => {
    // Optimistic: the row clears immediately, then the server confirms.
    dispatch(markFeedItemRead(id));
    try {
      await markRead(id);
    } catch {
      await reloadFeed();
    }
  };

  if (feedError && notifications.length === 0) {
    return (
      <AdminPage title="Notification Center" subtitle="Stay updated with tasks, training announcements, mentor messages, and approvals">
        <div className="card border-0 shadow-sm rounded-3 bg-white">
          <div className="p-5 text-center">
            <i className="bi bi-exclamation-triangle fs-1 text-warning mb-3 d-block" />
            <h5 className="fw-semibold">Could not load your notifications</h5>
            <p className="small text-muted mb-3">{String(feedError)}</p>
            <button className="btn btn-primary btn-sm" onClick={reloadFeed}>
              <i className="bi bi-arrow-clockwise me-1" /> Try again
            </button>
          </div>
        </div>
      </AdminPage>
    );
  }

  return (
    <AdminPage
      title="Notification Center"
      subtitle="Stay updated with tasks, training announcements, mentor messages, and approvals"
      actions={
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={markAllAsRead}
          disabled={unreadCount === 0 || busy}
        >
          <i className="bi bi-check2-all me-1" />
          {unreadCount === 0 ? 'All read' : `Mark all read (${unreadCount})`}
        </button>
      }
    >
      {/* Category Filter Pills */}
      <div className="d-flex gap-2 flex-wrap mb-3">
        {categories.map((cat) => {
          const active = activeFilter === cat;
          const count = countFor(cat);
          return (
            <button
              key={cat}
              type="button"
              className={`btn btn-sm ${active ? 'btn-primary shadow-sm' : 'btn-outline-secondary'}`}
              onClick={() => setActiveFilter(cat)}
              aria-pressed={active}
            >
              {cat}
              {count > 0 && (
                <span className={`badge ms-1 ${active ? 'bg-white text-primary' : 'bg-secondary text-white'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="card border-0 shadow-sm rounded-3 bg-white">
        {feedLoading && notifications.length === 0 ? (
          <div className="p-5 text-center text-muted">
            <div className="spinner-border spinner-border-sm text-primary mb-3" role="status">
              <span className="visually-hidden">Loading notifications</span>
            </div>
            <p className="small mb-0">Loading your notifications…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-5 text-center text-muted">
            <i className="bi bi-bell-slash fs-1 text-muted mb-2 d-block" />
            <h5 className="fw-semibold">
              {activeFilter === 'All'
                ? "You're all caught up"
                : `No ${activeFilter.toLowerCase()} notifications`}
            </h5>
            <p className="small mb-0">
              {activeFilter === 'All'
                ? 'New alerts about tasks, training and approvals will appear here.'
                : 'Try another category, or switch to All.'}
            </p>
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`list-group-item list-group-item-action p-3 d-flex align-items-start gap-3 ${
                  item.unread ? 'bg-primary bg-opacity-10' : ''
                }`}
                role="button"
                tabIndex={0}
                onClick={() => markSingleAsRead(item.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    markSingleAsRead(item.id);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                {item.unread && (
                  <span
                    className="rounded-circle bg-primary flex-shrink-0 mt-2"
                    style={{ width: '8px', height: '8px' }}
                    aria-label="Unread"
                  />
                )}
                <div className={`fs-5 flex-shrink-0 ${item.unread ? '' : 'opacity-50'}`}>
                  <i className={`bi ${item.icon}`} />
                </div>
                <div className="flex-grow-1 min-w-0">
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                    <h6 className={`mb-0 ${item.unread ? 'fw-bold text-dark' : 'fw-semibold text-dark'}`}>
                      {item.title}
                    </h6>
                    <small className="text-muted flex-shrink-0">{item.time}</small>
                  </div>
                  <p className="mb-2 text-muted small">{item.desc}</p>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-secondary bg-opacity-10 text-secondary border">
                      {item.category}
                    </span>
                    {/* Stop the row handler from firing before navigation. */}
                    <Link
                      to={item.actionUrl}
                      className="btn btn-sm btn-link p-0 text-decoration-none small"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View details <i className="bi bi-arrow-right" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminPage>
  );
}
