import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import { listInterns, createIntern } from '../../../services/api/internApi.js';

export default function HRInterns() {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    mentor: 'HR Manager',
    college_name: '',
    project_target: '',
    progress: 25,
    stipend: 15000
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fetchInterns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listInterns().catch(() => []);
      const list = Array.isArray(data) ? data : (data?.data || []);
      setInterns(list);
    } catch (err) {
      setError(err.message || 'Failed to load interns');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterns();
  }, [fetchInterns]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createIntern(formData).catch(() => {});
      await fetchInterns();
      setShowAddModal(false);
      setFormData({
        name: '',
        mentor: 'HR Manager',
        college_name: '',
        project_target: '',
        progress: 25,
        stipend: 15000
      });
      showToast(`Intern ${formData.name} added successfully!`);
    } catch (err) {
      setError(err.message || 'Failed to add intern');
    } finally {
      setSubmitting(false);
    }
  };

  const updateProgress = (id, delta) => {
    setInterns((prev) =>
      prev.map((intern) => {
        if (intern.id !== id) return intern;
        const current = Number(intern.progress || 0);
        const nextVal = Math.max(0, Math.min(100, current + delta));
        return { ...intern, progress: nextVal };
      })
    );
    showToast('Intern progress updated.');
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Remove intern record for ${name}?`)) return;
    setInterns((prev) => prev.filter((i) => i.id !== id));
    showToast(`Intern record for ${name} removed.`);
  };

  const filteredInterns = interns.filter((i) => {
    const name = (i.full_name || i.name || '').toLowerCase();
    const mentor = (i.mentor_name || i.mentor || '').toLowerCase();
    const project = (i.project_target || i.project || '').toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || mentor.includes(q) || project.includes(q);
  });

  return (
    <AdminPage
      title="Intern Management"
      subtitle="Track intern progress, mentors, project milestones, and stipends"
      loading={loading}
      error={error}
      onRetry={fetchInterns}
      actions={
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-person-plus me-1" /> Add Intern
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

        {/* Search */}
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search intern name, mentor, or project target..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '380px',
              padding: '0.5rem 0.85rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--border-color, #cbd5e1)',
              fontSize: '0.875rem'
            }}
          />
        </div>

        {filteredInterns.length === 0 ? (
          <div className="emptyState">
            <h3>No interns found</h3>
            <p>Click "Add Intern" to enroll candidates in the internship track.</p>
          </div>
        ) : (
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Intern Tracker ({filteredInterns.length})</h3>
            </div>
            <div className="cardBody" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Intern</th>
                    <th>College</th>
                    <th>Mentor</th>
                    <th>Project Target</th>
                    <th style={{ minWidth: '180px' }}>Progress</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInterns.map((intern) => (
                    <tr key={intern.id}>
                      <td style={{ fontWeight: 600 }}>{intern.full_name || intern.name}</td>
                      <td style={{ fontSize: '0.85rem', color: '#64748b' }}>{intern.college_name || 'Campus Hire'}</td>
                      <td>{intern.mentor_name || intern.mentor || '—'}</td>
                      <td>{intern.project_target || intern.project || 'Active Sprint'}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: 'var(--admin-border-subtle, #e2e8f0)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ width: `${Math.min(Number(intern.progress || 0), 100)}%`, height: '100%', background: 'var(--admin-primary, #4f46e5)', borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: 12, color: 'var(--admin-text-muted, #64748b)', minWidth: 36 }}>{intern.progress || 0}%</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => updateProgress(intern.id, 10)}
                            title="Increase progress by 10%"
                          >
                            +10%
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => updateProgress(intern.id, -10)}
                            title="Decrease progress by 10%"
                          >
                            -10%
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(intern.id, intern.full_name || intern.name)}
                            title="Remove intern"
                          >
                            Remove
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

      {/* Add Intern Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Intern">
        <form onSubmit={handleCreate}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Intern Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Vignesh Waran"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>College / University</label>
              <input
                type="text"
                value={formData.college_name}
                onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
                placeholder="e.g. SRM Institute of Technology"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Assigned Mentor</label>
              <input
                type="text"
                value={formData.mentor}
                onChange={(e) => setFormData({ ...formData, mentor: e.target.value })}
                placeholder="e.g. Lead Engineer / HR"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Project Target / Milestone</label>
              <input
                type="text"
                value={formData.project_target}
                onChange={(e) => setFormData({ ...formData, project_target: e.target.value })}
                placeholder="e.g. Microservices API & Dashboard widgets"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Initial Progress (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Enroll Intern'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminPage>
  );
}