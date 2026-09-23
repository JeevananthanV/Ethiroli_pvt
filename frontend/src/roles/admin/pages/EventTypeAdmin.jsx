import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import calendarApi from '../../../services/calendarApi.js';

const ALL_ROLES = [
  'SUPER_ADMIN',
  'ADMIN',
  'HR',
  'TUTOR',
  'STUDENT',
  'EMPLOYEE',
  'INTERN',
  'PROJECT_MANAGER',
  'FINANCE',
  'SALES',
  'RECEPTION',
  'VENDOR',
  'CLIENT'
];

export default function EventTypeAdmin() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    label: '',
    description: '',
    icon: 'bi-calendar-event',
    default_duration_minutes: 30,
    color: '#6366f1',
    allowed_create_roles: [],
    allowed_write_roles: [],
    notification_target_roles: [],
    is_active: true
  });

  const loadEventTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await calendarApi.listEventTypes();
      setTypes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load event types');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventTypes();
  }, []);

  const handleOpenCreate = () => {
    setEditingType(null);
    setFormData({
      id: '',
      label: '',
      description: '',
      icon: 'bi-calendar-event',
      default_duration_minutes: 30,
      color: '#6366f1',
      allowed_create_roles: ['ADMIN', 'SUPER_ADMIN'],
      allowed_write_roles: ['ADMIN', 'SUPER_ADMIN'],
      notification_target_roles: ['ADMIN'],
      is_active: true
    });
    setShowModal(true);
  };

  const handleOpenEdit = (t) => {
    setEditingType(t);
    setFormData({
      id: t.id,
      label: t.label,
      description: t.description || '',
      icon: t.icon || 'bi-calendar-event',
      default_duration_minutes: t.default_duration_minutes || 30,
      color: t.color || '#6366f1',
      allowed_create_roles: t.allowed_create_roles || [],
      allowed_write_roles: t.allowed_write_roles || [],
      notification_target_roles: t.notification_target_roles || [],
      is_active: Boolean(t.is_active)
    });
    setShowModal(true);
  };

  const handleToggleRole = (field, role) => {
    const list = formData[field] || [];
    if (list.includes(role)) {
      setFormData({ ...formData, [field]: list.filter((r) => r !== role) });
    } else {
      setFormData({ ...formData, [field]: [...list, role] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingType) {
        await calendarApi.updateEventType(editingType.id, formData);
      } else {
        await calendarApi.createEventType(formData);
      }
      setShowModal(false);
      loadEventTypes();
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Failed to save event type');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete event type '${id}'?`)) {
      try {
        await calendarApi.deleteEventType(id);
        loadEventTypes();
      } catch (err) {
        alert(err.response?.data?.error || err.message || 'Failed to delete');
      }
    }
  };

  return (
    <AdminPage
      title="Calendar Event Types Configuration"
      subtitle="Manage dynamic event types, RBAC creation permissions, colors, and notification targets"
      loading={loading}
      error={error}
      onRetry={loadEventTypes}
      actions={
        <button
          type="button"
          className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
          onClick={handleOpenCreate}
        >
          <i className="bi bi-plus-circle"></i>
          <span>Add Event Type</span>
        </button>
      }
    >
      <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white mb-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Type / Label</th>
                <th>Icon & Color</th>
                <th>Duration</th>
                <th>Allowed Creators</th>
                <th>Notification Target</th>
                <th>Status</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {types.map((t) => (
                <tr key={t.id}>
                  <td className="ps-4">
                    <div className="fw-bold text-dark">{t.label}</div>
                    <small className="text-muted font-monospace">{t.id}</small>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className="rounded p-2 text-white d-inline-flex align-items-center justify-content-center"
                        style={{ backgroundColor: t.color || '#6366f1', width: '32px', height: '32px' }}
                      >
                        <i className={`bi ${t.icon || 'bi-calendar'}`}></i>
                      </span>
                      <span className="small text-muted font-monospace">{t.color}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border">{t.default_duration_minutes} mins</span>
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-1" style={{ maxWidth: '220px' }}>
                      {(t.allowed_create_roles || []).map((r) => (
                        <span key={r} className="badge bg-primary-subtle text-primary border border-primary-subtle small">
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-1" style={{ maxWidth: '180px' }}>
                      {(t.notification_target_roles || []).map((r) => (
                        <span key={r} className="badge bg-secondary-subtle text-secondary small">
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    {t.is_active ? (
                      <span className="badge bg-success-subtle text-success border border-success-subtle">Active</span>
                    ) : (
                      <span className="badge bg-danger-subtle text-danger border border-danger-subtle">Inactive</span>
                    )}
                  </td>
                  <td className="text-end pe-4">
                    <div className="btn-group btn-group-sm">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        title="Edit Type"
                        onClick={() => handleOpenEdit(t)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        title="Delete Type"
                        onClick={() => handleDelete(t.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create/Edit Event Type */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header bg-light border-0 py-3">
                <h5 className="modal-title fw-bold text-dark">
                  {editingType ? `Edit Event Type: ${editingType.label}` : 'Create New Event Type'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Label / Display Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Workshop, Standup, Review"
                        value={formData.label}
                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Color (Hex Code) *</label>
                      <div className="input-group">
                        <input
                          type="color"
                          className="form-control form-control-color"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        />
                        <input
                          type="text"
                          className="form-control"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Default Duration (Minutes)</label>
                      <input
                        type="number"
                        min="0"
                        max="480"
                        className="form-control"
                        value={formData.default_duration_minutes}
                        onChange={(e) => setFormData({ ...formData, default_duration_minutes: parseInt(e.target.value, 10) || 0 })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Bootstrap Icon Class</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="bi-mortarboard, bi-people, bi-cash-coin"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold">Description</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      ></textarea>
                    </div>

                    {/* RBAC Allowed Creators */}
                    <div className="col-12">
                      <label className="form-label small fw-bold d-block">
                        Allowed Creation Roles (RBAC)
                      </label>
                      <div className="d-flex flex-wrap gap-2 p-2 bg-light rounded border">
                        {ALL_ROLES.map((r) => {
                          const checked = formData.allowed_create_roles?.includes(r);
                          return (
                            <button
                              key={r}
                              type="button"
                              className={`btn btn-sm ${checked ? 'btn-primary' : 'btn-outline-secondary'}`}
                              onClick={() => handleToggleRole('allowed_create_roles', r)}
                            >
                              {checked ? '✓ ' : '+ '}
                              {r}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Notification Target Roles */}
                    <div className="col-12">
                      <label className="form-label small fw-bold d-block">
                        Smart Notification Target Roles
                      </label>
                      <div className="d-flex flex-wrap gap-2 p-2 bg-light rounded border">
                        {ALL_ROLES.map((r) => {
                          const checked = formData.notification_target_roles?.includes(r);
                          return (
                            <button
                              key={r}
                              type="button"
                              className={`btn btn-sm ${checked ? 'btn-success text-white' : 'btn-outline-secondary'}`}
                              onClick={() => handleToggleRole('notification_target_roles', r)}
                            >
                              {checked ? '✓ ' : '+ '}
                              {r}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light border-0 py-3">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4 shadow-sm">
                    {editingType ? 'Save Changes' : 'Create Event Type'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
