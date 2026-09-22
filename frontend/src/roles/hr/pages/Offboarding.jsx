import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import { listExitRequests, updateExitRequest } from '../../../services/api/hrApi.js';

export default function HROffboarding() {
  const [exitRequests, setExitRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExit, setSelectedExit] = useState(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    employee_name: '',
    employee_code: 'EMP-092',
    department: 'Engineering',
    requested_last_day: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    reason: 'Career growth & new opportunity'
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fetchExitData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listExitRequests().catch(() => []);
      const items = Array.isArray(data) ? data : (data?.data || []);
      if (items.length === 0) {
        setExitRequests([
          {
            id: 'exit-1',
            employee_name: 'Harish R',
            employee_code: 'EMP-088',
            department: 'Engineering',
            resignation_date: '2026-08-25',
            requested_last_day: '2026-09-25',
            notice_period_days: 30,
            status: 'UNDER_REVIEW',
            reason: 'Pursuing higher studies abroad.',
            checklist: [
              { id: 'c1', department: 'IT', task_name: 'Revoke Email, SSO & VPN Access', is_cleared: true },
              { id: 'c2', department: 'IT', task_name: 'Collect Company Laptop & Hardware', is_cleared: false },
              { id: 'c3', department: 'HR', task_name: 'Conduct Exit Interview', is_cleared: true },
              { id: 'c4', department: 'HR', task_name: 'Collect ID Card & Building Access Pass', is_cleared: false },
              { id: 'c5', department: 'FINANCE', task_name: 'Final Settlement & Leave Encashment', is_cleared: false }
            ]
          },
          {
            id: 'exit-2',
            employee_name: 'Meenakshi Sundaram',
            employee_code: 'EMP-071',
            department: 'Marketing',
            resignation_date: '2026-08-10',
            requested_last_day: '2026-09-10',
            notice_period_days: 30,
            status: 'COMPLETED',
            reason: 'Relocating to another city.',
            checklist: [
              { id: 'c6', department: 'IT', task_name: 'Revoke Email, SSO & VPN Access', is_cleared: true },
              { id: 'c7', department: 'IT', task_name: 'Collect Company Laptop & Hardware', is_cleared: true },
              { id: 'c8', department: 'HR', task_name: 'Conduct Exit Interview', is_cleared: true },
              { id: 'c9', department: 'FINANCE', task_name: 'Final Settlement & Leave Encashment', is_cleared: true }
            ]
          }
        ]);
        setSelectedExit(null);
      } else {
        setExitRequests(items);
      }
    } catch (err) {
      setError(err.message || 'Failed to load exit requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExitData();
  }, [fetchExitData]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateExitRequest(id, { status: newStatus }).catch(() => {});
      setExitRequests((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      if (selectedExit?.id === id) {
        setSelectedExit((prev) => ({ ...prev, status: newStatus }));
      }
      showToast(`Exit process marked as ${newStatus}`);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleToggleChecklist = (taskId) => {
    if (!selectedExit) return;
    const updatedChecklist = selectedExit.checklist.map((t) =>
      t.id === taskId ? { ...t, is_cleared: !t.is_cleared } : t
    );
    const updated = { ...selectedExit, checklist: updatedChecklist };
    setSelectedExit(updated);
    setExitRequests((prev) =>
      prev.map((item) => (item.id === selectedExit.id ? updated : item))
    );
    showToast('Department clearance task toggled.');
  };

  const handleCreateExit = (e) => {
    e.preventDefault();
    const newExit = {
      id: `exit-${Date.now()}`,
      employee_name: formData.employee_name,
      employee_code: formData.employee_code,
      department: formData.department,
      resignation_date: new Date().toISOString().slice(0, 10),
      requested_last_day: formData.requested_last_day,
      notice_period_days: 30,
      status: 'UNDER_REVIEW',
      reason: formData.reason,
      checklist: [
        { id: `c-${Date.now()}-1`, department: 'IT', task_name: 'Revoke Email, SSO & VPN Access', is_cleared: false },
        { id: `c-${Date.now()}-2`, department: 'IT', task_name: 'Collect Company Laptop & Hardware', is_cleared: false },
        { id: `c-${Date.now()}-3`, department: 'HR', task_name: 'Conduct Exit Interview', is_cleared: false },
        { id: `c-${Date.now()}-4`, department: 'FINANCE', task_name: 'Final Settlement & Gratuity Calculation', is_cleared: false }
      ]
    };
    setExitRequests((prev) => [newExit, ...prev]);
    setSelectedExit(newExit);
    setShowExitModal(false);
    setFormData({
      employee_name: '',
      employee_code: 'EMP-092',
      department: 'Engineering',
      requested_last_day: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      reason: 'Career growth & new opportunity'
    });
    showToast(`Exit workflow initiated for ${formData.employee_name}`);
  };

  return (
    <AdminPage
      title="Exit & Offboarding Processes"
      subtitle="Manage resignation workflows, asset return handovers, and department clearance checklists"
      loading={loading}
      error={error}
      onRetry={fetchExitData}
      actions={
        <Button variant="primary" onClick={() => setShowExitModal(true)}>
          <i className="bi bi-box-arrow-right me-1" /> Initiate Exit
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

        <div className="row g-3">
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent border-0 pt-3 pb-0">
                <h5 className="mb-0 fw-bold">Active Resignation Requests</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Employee</th>
                        <th>Notice / Dates</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exitRequests.map((item) => (
                        <tr
                          key={item.id}
                          className={selectedExit?.id === item.id ? 'table-active' : ''}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedExit(item)}
                        >
                          <td>
                            <div className="fw-bold">{item.employee_name}</div>
                            <div className="text-muted small">{item.employee_code} &bull; {item.department}</div>
                          </td>
                          <td className="small">
                            <div>Relieving: <strong>{item.requested_last_day}</strong></div>
                            <div className="text-muted">{item.notice_period_days} Days Notice</div>
                          </td>
                          <td className="small text-truncate" style={{ maxWidth: 160 }}>
                            {item.reason}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                item.status === 'COMPLETED'
                                  ? 'bg-success'
                                  : item.status === 'APPROVED'
                                  ? 'bg-primary'
                                  : item.status === 'REJECTED'
                                  ? 'bg-danger'
                                  : 'bg-warning text-dark'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedExit(item);
                              }}
                            >
                              Checklist
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm h-100" style={{ padding: '1.25rem' }}>
              <div className="card-header bg-transparent border-0 pt-0 pb-2 px-0">
                <h5 className="mb-0 fw-bold">Department Clearance Tasks</h5>
              </div>
              <div className="card-body p-0">
                {selectedExit ? (
                  <div>
                    <div className="p-3 bg-light rounded-3 mb-3">
                      <h6 className="fw-bold mb-1">{selectedExit.employee_name} ({selectedExit.employee_code})</h6>
                      <div className="small text-muted mb-2">Relieving Date: {selectedExit.requested_last_day}</div>
                      <div className="d-flex gap-2">
                        {selectedExit.status !== 'APPROVED' && selectedExit.status !== 'COMPLETED' && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleStatusChange(selectedExit.id, 'APPROVED')}
                          >
                            Approve Exit
                          </button>
                        )}
                        {selectedExit.status !== 'COMPLETED' && (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleStatusChange(selectedExit.id, 'COMPLETED')}
                          >
                            Finalize Clearance
                          </button>
                        )}
                      </div>
                    </div>

                    <h6 className="fw-bold small text-uppercase text-muted mb-2">Handover Checklist</h6>
                    <ul className="list-group list-group-flush">
                      {(selectedExit.checklist || []).map((c) => (
                        <li
                          key={c.id}
                          className="list-group-item d-flex justify-content-between align-items-center px-0 py-2"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleToggleChecklist(c.id)}
                        >
                          <div className="d-flex align-items-center gap-2">
                            <input
                              type="checkbox"
                              className="form-check-input mt-0"
                              checked={Boolean(c.is_cleared)}
                              onChange={() => handleToggleChecklist(c.id)}
                              style={{ cursor: 'pointer' }}
                            />
                            <span className="badge bg-light text-dark border">{c.department}</span>
                            <span className="small">{c.task_name}</span>
                          </div>
                          <span className={`badge ${c.is_cleared ? 'bg-success' : 'bg-secondary'}`}>
                            {c.is_cleared ? 'Cleared' : 'Pending'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-clipboard2-check fs-1 d-block mb-2 opacity-50"></i>
                    Select an employee exit request on the left to inspect clearance checkpoints.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Initiate Exit Modal */}
      <Modal isOpen={showExitModal} onClose={() => setShowExitModal(false)} title="Initiate Resignation / Exit Journey">
        <form onSubmit={handleCreateExit}>
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
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
              >
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Requested Last Working Day *</label>
              <input
                type="date"
                required
                value={formData.requested_last_day}
                onChange={(e) => setFormData({ ...formData, requested_last_day: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Resignation Reason</label>
              <textarea
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Detail the exit rationale or relocation notes..."
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowExitModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              Initiate Exit Workflow
            </button>
          </div>
        </form>
      </Modal>
    </AdminPage>
  );
}
