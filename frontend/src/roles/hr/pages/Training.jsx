import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';

export default function HRTraining() {
  const [modules, setModules] = useState([
    {
      id: 'trn-1',
      title: 'POSH & Workplace Ethics 2026',
      type: 'Compliance',
      mandatory: true,
      enrolled: 48,
      completed: 44,
      dueDate: '2026-09-30',
      status: 'Active'
    },
    {
      id: 'trn-2',
      title: 'Information Security & Data Privacy (GDPR/DPDP)',
      type: 'Compliance',
      mandatory: true,
      enrolled: 48,
      completed: 39,
      dueDate: '2026-10-15',
      status: 'Active'
    },
    {
      id: 'trn-3',
      title: 'Modern Full-Stack Development Bootcamp',
      type: 'Technical (Interns)',
      mandatory: false,
      enrolled: 12,
      completed: 8,
      dueDate: '2026-10-31',
      status: 'In Progress'
    },
    {
      id: 'trn-4',
      title: 'Agile & Scrum Methodologies for Teams',
      type: 'Operational',
      mandatory: false,
      enrolled: 25,
      completed: 25,
      dueDate: '2026-08-30',
      status: 'Completed'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    type: 'Compliance',
    mandatory: true,
    enrolled: 20,
    dueDate: '2026-11-15'
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const newTrn = {
      id: `trn-${Date.now()}`,
      title: formData.title,
      type: formData.type,
      mandatory: Boolean(formData.mandatory),
      enrolled: Number(formData.enrolled) || 10,
      completed: 0,
      dueDate: formData.dueDate,
      status: 'Active'
    };
    setModules((prev) => [newTrn, ...prev]);
    setShowAddModal(false);
    setFormData({
      title: '',
      type: 'Compliance',
      mandatory: true,
      enrolled: 20,
      dueDate: '2026-11-15'
    });
    showToast(`Training program "${formData.title}" published!`);
  };

  const handleEnroll = (id) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enrolled: m.enrolled + 1 } : m))
    );
    showToast('Staff member enrolled in training program.');
  };

  const handleMarkComplete = (id) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const nextComp = Math.min(m.enrolled, m.completed + 1);
        return {
          ...m,
          completed: nextComp,
          status: nextComp === m.enrolled ? 'Completed' : m.status
        };
      })
    );
    showToast('Marked 1 completion for module.');
  };

  const totalEnrolled = modules.reduce((acc, m) => acc + m.enrolled, 0);
  const totalCompleted = modules.reduce((acc, m) => acc + m.completed, 0);
  const avgCompletion = totalEnrolled > 0 ? Math.round((totalCompleted / totalEnrolled) * 100) : 0;

  return (
    <AdminPage
      title="Training & Professional Development"
      subtitle="Manage corporate learning paths, statutory compliance, and intern upskilling"
      actions={
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-journal-plus me-1" /> Add Training Program
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

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="text-muted small text-uppercase">Total Programs</h6>
                <h3 className="fw-bold mb-0">{modules.length}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="text-muted small text-uppercase">Overall Completion</h6>
                <h3 className="fw-bold mb-0 text-success">{avgCompletion}%</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="text-muted small text-uppercase">Total Active Enrollees</h6>
                <h3 className="fw-bold mb-0 text-primary">{totalEnrolled}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-header bg-transparent border-0 pt-3 pb-0">
            <h5 className="mb-0 fw-bold">Training Programs & Tracking</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Course Title</th>
                    <th>Category</th>
                    <th>Mandatory</th>
                    <th>Progress / Completion</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {modules.map((m) => {
                    const pct = m.enrolled > 0 ? Math.round((m.completed / m.enrolled) * 100) : 0;
                    return (
                      <tr key={m.id}>
                        <td>
                          <div className="fw-bold">{m.title}</div>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border">{m.type}</span>
                        </td>
                        <td>
                          {m.mandatory ? (
                            <span className="badge bg-danger-subtle text-danger">Mandatory</span>
                          ) : (
                            <span className="badge bg-secondary-subtle text-secondary">Optional</span>
                          )}
                        </td>
                        <td style={{ minWidth: 160 }}>
                          <div className="d-flex justify-content-between small text-muted mb-1">
                            <span>{m.completed}/{m.enrolled}</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="progress" style={{ height: 6 }}>
                            <div
                              className={`progress-bar ${pct === 100 ? 'bg-success' : 'bg-primary'}`}
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="small text-muted">{m.dueDate}</td>
                        <td>
                          <span className={`badge ${m.status === 'Completed' ? 'bg-success' : 'bg-primary'}`}>
                            {m.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEnroll(m.id)}
                              title="Enroll another staff member"
                            >
                              + Enroll
                            </button>
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() => handleMarkComplete(m.id)}
                              title="Record completion"
                            >
                              ✓ Complete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Training Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Publish New Training Program">
        <form onSubmit={handleCreate}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Course Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. SOC2 & Cloud Security Compliance"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Category</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
              >
                <option value="Compliance">Statutory Compliance</option>
                <option value="Technical (Interns)">Technical (Interns / Upskilling)</option>
                <option value="Operational">Operational / Leadership</option>
                <option value="Soft Skills">Soft Skills & Communication</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Initial Enrollees</label>
                <input
                  type="number"
                  min="1"
                  value={formData.enrolled}
                  onChange={(e) => setFormData({ ...formData, enrolled: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="mandCheck"
                checked={formData.mandatory}
                onChange={(e) => setFormData({ ...formData, mandatory: e.target.checked })}
              />
              <label htmlFor="mandCheck" style={{ fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}>
                Mandatory for all active staff members
              </label>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              Create Program
            </button>
          </div>
        </form>
      </Modal>
    </AdminPage>
  );
}
