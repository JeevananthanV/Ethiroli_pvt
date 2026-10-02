import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import employeePortalApi from '../../../services/api/employeePortalApi.js';
import { EmptyState } from '../components/StatCard.jsx';

/**
 * Employee notifications.
 *
 * Backed by the shared `activity_feeds` table through the existing
 * `/v1/activity-feed` routes (read + mark-read + mark-all-read), which are
 * already scoped to `req.user.id` server-side. No employee-specific table is
 * required, so this reuses real platform data instead of inventing one.
 *
 * The feed row shape is: { id, event_type, entity_type, payload, is_read,
 * actor_name, created_at }. The helpers below turn that into the title /
 * description / icon the card renders.
 */

const CATEGORY_BY_ENTITY = {
  Leave: { key: 'LEAVE', label: 'Leave', icon: 'bi-calendar-check', color: 'text-primary' },
  Attendance: { key: 'ATTENDANCE', label: 'Attendance', icon: 'bi-clock-history', color: 'text-success' },
  Payroll: { key: 'PAYROLL', label: 'Payroll', icon: 'bi-receipt', color: 'text-warning' },
  Employee: { key: 'EMPLOYEE', label: 'Profile', icon: 'bi-person-badge', color: 'text-info' },
  Task: { key: 'TASK', label: 'Tasks', icon: 'bi-check2-square', color: 'text-secondary' },
  Support: { key: 'SUPPORT', label: 'Support', icon: 'bi-life-preserver', color: 'text-danger' },
};

const humanise = (value) =>
  String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

/** Build a readable title/description from a real feed row. */
function describe(item) {
  const entity = CATEGORY_BY_ENTITY[item.entity_type] || {
    key: 'GENERAL',
    label: humanise(item.entity_type) || 'Update',
    icon: 'bi-bell',
    color: 'text-secondary',
  };

  const payload = (() => {
    const raw = item.payload;
    if (!raw) return {};
    if (typeof raw === 'object') return raw;
    try { return JSON.parse(raw); } catch { return {}; }
  })();

  const action = humanise(payload.action || item.event_type || '');
  const subject = payload.title || payload.subject || payload.description || payload.reason || '';

  // Fall back to the fields the real employee-portal producers write, so a
  // punch, a leave application, a task change and a support ticket each render
  // a meaningful line rather than "No further details."
  const derived = (() => {
    switch (item.event_type) {
      case 'LEAVE_SUBMITTED':
        return `${payload.leave_type || 'Leave'} requested for ${payload.start_date || '?'} to ${payload.end_date || '?'}`;
      case 'ATTENDANCE_PUNCH_IN':
        return `Punched in on ${payload.work_date || 'today'}`;
      case 'ATTENDANCE_PUNCH_OUT':
        return payload.worked_hours != null
          ? `Punched out on ${payload.work_date || 'today'} · ${payload.worked_hours}h worked`
          : `Punched out on ${payload.work_date || 'today'}`;
      case 'TASK_STATUS_CHANGED':
        return payload.from && payload.to
          ? `Task moved from ${humanise(payload.from)} to ${humanise(payload.to)}`
          : 'Task status updated';
      case 'SUPPORT_TICKET_CREATED':
        return payload.ticket_number
          ? `Ticket ${payload.ticket_number} · ${humanise(payload.category || '')}`
          : 'Support ticket raised';
      default:
        return null;
    }
  })();

  const title = [action, entity.label].filter(Boolean).join(' · ') || `${entity.label} update`;
  const description = subject
    || derived
    || (item.actor_name ? `${item.actor_name} triggered this update.` : 'No further details.');

  return { ...entity, title, description };
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [busy, setBusy] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await employeePortalApi.getNotifications({ limit: 100 });
      const list = res?.data || (Array.isArray(res) ? res : []);
      setNotifications(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAllRead = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await employeePortalApi.markAllNotificationsRead();
      await loadNotifications();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to mark notifications as read');
    } finally {
      setBusy(false);
    }
  };

  // Open the detail modal, and mark the item read in the background.
  const openDetail = async (item) => {
    setSelectedNotification(item);
    await markOneRead(item);
  };

  const markOneRead = async (item) => {
    if (item.is_read) return;
    try {
      await employeePortalApi.markNotificationRead(item.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, is_read: 1 } : n))
      );
    } catch {
      // Leave the row unread so the user can retry; the list stays accurate.
      loadNotifications();
    }
  };

  const decorated = useMemo(
    () => notifications.map((n) => ({ ...n, ...describe(n) })),
    [notifications]
  );

  const unreadCount = decorated.filter((n) => !n.is_read).length;

  const filtered = useMemo(() => {
    if (filter === 'ALL') return decorated;
    if (filter === 'UNREAD') return decorated.filter((n) => !n.is_read);
    return decorated.filter((n) => n.key === filter);
  }, [decorated, filter]);

  // Only offer category chips that actually have items.
  const categories = useMemo(() => {
    const seen = new Map();
    decorated.forEach((n) => {
      if (!seen.has(n.key)) seen.set(n.key, { key: n.key, label: n.label, icon: n.icon, count: 0 });
      seen.get(n.key).count += 1;
    });
    return [...seen.values()];
  }, [decorated]);

  return (
    <AdminPage
      title="Notifications & Alerts"
      subtitle="Live feed of policy alerts, leave updates, task deadlines, and payroll logs"
      loading={loading}
      error={error}
      onRetry={loadNotifications}
    >
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <div className="btn-group flex-wrap" role="group">
          <button
            type="button"
            className={`btn btn-sm ${filter === 'ALL' ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setFilter('ALL')}
          >
            All Alerts ({decorated.length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filter === 'UNREAD' ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setFilter('UNREAD')}
          >
            Unread ({unreadCount})
          </button>
          {categories
            .filter((c) => c.key !== 'GENERAL')
            .map((c) => (
              <button
                key={c.key}
                type="button"
                className={`btn btn-sm ${filter === c.key ? 'btn-dark' : 'btn-outline-secondary'}`}
                onClick={() => setFilter(c.key)}
              >
                <i className={`bi ${c.icon} me-1`} aria-hidden="true"></i>
                {c.label} ({c.count})
              </button>
            ))}
        </div>

        <button
          className="btn btn-sm btn-outline-primary"
          onClick={markAllRead}
          disabled={busy || unreadCount === 0}
        >
          {busy ? (
            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
          ) : (
            <i className="bi bi-check2-all me-1"></i>
          )}
          Mark All as Read
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="list-group list-group-flush">
          {filtered.length === 0 ? (
            <EmptyState
              icon="bi-bell-slash"
              title="Nothing here yet"
              text={
                filter === 'ALL'
                  ? 'Nothing yet. Applying for leave, punching in or out, changing a task status and raising a support ticket all post a notification here.'
                  : 'No notifications match this filter.'
              }
            />
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`list-group-item p-3 d-flex align-items-start gap-3 border-bottom ${
                  !item.is_read ? 'bg-light' : ''
                }`}
                role="button"
                tabIndex={0}
                onClick={() => openDetail(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openDetail(item);
                  }
                }}
                style={{ cursor: item.is_read ? 'default' : 'pointer' }}
              >
                <div
                  className={`rounded-circle p-2 d-flex align-items-center justify-content-center bg-opacity-10 ${item.color}`}
                  style={{ width: '42px', height: '42px' }}
                  aria-hidden="true"
                >
                  <i className={`bi ${item.icon} fs-5`}></i>
                </div>

                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center mb-1 gap-2">
                    <h6 className="mb-0 fw-semibold text-dark">{item.title}</h6>
                    <small className="text-muted text-nowrap">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString(undefined, {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                          })
                        : ''}
                    </small>
                  </div>
                  <p className="mb-0 text-secondary small">{item.description}</p>
                </div>

                {!item.is_read && (
                  <span className="badge bg-primary rounded-pill p-1">
                    <span className="visually-hidden">unread</span>
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Notification detail */}
      {selectedNotification && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          aria-labelledby="notificationDetailTitle"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow">
              <div className="modal-header d-flex align-items-start gap-3">
                <div
                  className={`rounded-circle p-2 d-flex align-items-center justify-content-center bg-opacity-10 ${selectedNotification.color}`}
                  style={{ width: '42px', height: '42px', flexShrink: 0 }}
                  aria-hidden="true"
                >
                  <i className={`bi ${selectedNotification.icon} fs-5`}></i>
                </div>
                <div className="flex-grow-1">
                  <h5 id="notificationDetailTitle" className="modal-title mb-1">
                    {selectedNotification.title}
                  </h5>
                  <small className="text-muted">
                    {selectedNotification.label}
                    {selectedNotification.created_at && (
                      <> &middot; {new Date(selectedNotification.created_at).toLocaleString(undefined, {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}</>
                    )}
                  </small>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setSelectedNotification(null)}
                ></button>
              </div>

              <div className="modal-body">
                <p className="mb-3">{selectedNotification.description}</p>

                <dl className="row mb-0 small">
                  <dt className="col-sm-4 text-muted fw-semibold">Category</dt>
                  <dd className="col-sm-8">{selectedNotification.label}</dd>

                  <dt className="col-sm-4 text-muted fw-semibold">Event</dt>
                  <dd className="col-sm-8 font-monospace">{selectedNotification.event_type || '—'}</dd>

                  <dt className="col-sm-4 text-muted fw-semibold">Entity</dt>
                  <dd className="col-sm-8 font-monospace">{selectedNotification.entity_type || '—'}</dd>

                  {selectedNotification.entity_id && (
                    <>
                      <dt className="col-sm-4 text-muted fw-semibold">Reference</dt>
                      <dd className="col-sm-8 font-monospace text-break">{selectedNotification.entity_id}</dd>
                    </>
                  )}

                  <dt className="col-sm-4 text-muted fw-semibold">Status</dt>
                  <dd className="col-sm-8">
                    <span className={`badge ${selectedNotification.is_read ? 'bg-secondary' : 'bg-primary'}`}>
                      {selectedNotification.is_read ? 'Read' : 'Unread'}
                    </span>
                  </dd>
                </dl>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setSelectedNotification(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}