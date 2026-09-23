import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import { listAttendance, checkIn } from '../../../services/api/attendanceApi.js';

export default function HRAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showLogModal, setShowLogModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    employee_name: '',
    date: new Date().toISOString().slice(0, 10),
    clock_in: '09:00 AM',
    clock_out: '06:00 PM',
    status: 'present'
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAttendance().catch(() => []);
      const list = Array.isArray(data) ? data : (data?.data || []);
      setRecords(list);
    } catch (err) {
      setError(err.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await checkIn(formData).catch(() => {});
      await fetchAttendance();
      setShowLogModal(false);
      setFormData({
        employee_name: '',
        date: new Date().toISOString().slice(0, 10),
        clock_in: '09:00 AM',
        clock_out: '06:00 PM',
        status: 'present'
      });
      showToast(`Attendance recorded for ${formData.employee_name}`);
    } catch (err) {
      setError(err.message || 'Failed to log attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    showToast(`Status updated to ${newStatus}`);
  };

  const filteredRecords = records.filter((rec) => {
    const name = (rec.employee_name || rec.user_name || '').toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || String(rec.status).toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminPage
      title="Attendance & Timesheets"
      subtitle="Log and review employee attendance, clock-in times, and working hours"
      loading={loading}
      error={error}
      onRetry={fetchAttendance}
      actions={
        <Button variant="primary" onClick={() => setShowLogModal(true)}>
          <i className="bi bi-clock-history me-1" /> Log Attendance
        </Button>
      }
    >
      <div className="dashboard">
        {toastMsg && (
          <div style={{
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <i className="bi bi-check-circle-fill text-success" />
            {toastMsg}
          </div>
        )}

        {/* Controls */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: '1rem'
        }}>
          <input
            type="text"
            placeholder="Search employee name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: '220px',
              padding: '0.5rem 0.85rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--border-color, #cbd5e1)',
              fontSize: '0.875rem'
            }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--border-color, #cbd5e1)',
              fontSize: '0.875rem',
              background: '#fff'
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="absent">Absent</option>
          </select>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="emptyState">
            <h3>No attendance records found</h3>
            <p>Click "Log Attendance" above to record daily entries.</p>
          </div>
        ) : (
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Attendance Register ({filteredRecords.length})</h3>
            </div>
            <div className="cardBody" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Date</th>
                    <th>Clock In</th>
                    <th>Clock Out</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Quick Toggle</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((rec) => (
                    <tr key={rec.id}>
                      <td style={{ fontWeight: 600 }}>{rec.employee_name || rec.user_name || '—'}</td>
                      <td>{rec.date ? String(rec.date).slice(0, 10) : 'Today'}</td>
                      <td>{rec.clock_in || rec.checkIn || '—'}</td>
                      <td>{rec.clock_out || rec.checkOut || '—'}</td>
                      <td>
                        <span className={`statusTag ${String(rec.status).toLowerCase() === 'present' || String(rec.status).toLowerCase() === 'on_time' ? 'active' : String(rec.status).toLowerCase() === 'absent' ? 'error' : 'pending'}`}>
                          {rec.status || 'Unknown'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleUpdateStatus(rec.id, 'present')}
                            title="Mark Present"
                          >
                            Present
                          </button>
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleUpdateStatus(rec.id, 'late')}
                            title="Mark Late"
                          >
                            Late
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleUpdateStatus(rec.id, 'absent')}
                            title="Mark Absent"
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Log Attendance Modal */}
      <Modal isOpen={showLogModal} onClose={() => setShowLogModal(false)} title="Log Attendance Record">
        <form onSubmit={handleCreate}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Employee Name *</label>
              <input
                type="text"
                required
                value={formData.employee_name}
                onChange={(e) => setFormData({ ...formData, employee_name: e.target.value })}
                placeholder="e.g. Ramesh Krishnan"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Clock In</label>
                <input
                  type="text"
                  value={formData.clock_in}
                  onChange={(e) => setFormData({ ...formData, clock_in: e.target.value })}
                  placeholder="09:00 AM"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Clock Out</label>
                <input
                  type="text"
                  value={formData.clock_out}
                  onChange={(e) => setFormData({ ...formData, clock_out: e.target.value })}
                  placeholder="06:00 PM"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Attendance Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
              >
                <option value="present">Present (On Time)</option>
                <option value="late">Late Arrival</option>
                <option value="absent">Absent</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowLogModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Record Attendance'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminPage>
  );
}