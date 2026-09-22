import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage';
import pmApi from '../../../services/api/pmApi';

export default function PMSprints() {
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [completeModal, setCompleteModal] = useState(null);
  const [actualVelocity, setActualVelocity] = useState('');
  const [formData, setFormData] = useState({
    project_id: '',
    sprint_number: '',
    sprint_name: '',
    goal: '',
    start_date: '',
    end_date: '',
    target_velocity: ''
  });

  const loadSprints = async () => {
    setLoading(true);
    try {
      const res = await pmApi.getSprints();
      if (res?.success) {
        setSprints(res.sprints || []);
      }
    } catch (err) {
      console.error('Failed to load sprints:', err);
      setSprints([
        { id: '1', sprint_number: 14, sprint_name: 'Sprint 14: Core Auth & RBAC', goal: 'Deliver robust role routing and JWT middleware', start_date: '2026-09-01', end_date: '2026-09-14', status: 'ACTIVE', target_velocity: 45, actual_velocity: 32, project_name: 'ERP Modernization' },
        { id: '2', sprint_number: 13, sprint_name: 'Sprint 13: Database Normalization', goal: 'Audit MySQL tables and create unified seed scripts', start_date: '2026-08-15', end_date: '2026-08-31', status: 'COMPLETED', target_velocity: 40, actual_velocity: 42, project_name: 'ERP Modernization' },
        { id: '3', sprint_number: 15, sprint_name: 'Sprint 15: Payment Webhook Engine', goal: 'Integrate Razorpay and Stripe listener workers', start_date: '2026-09-15', end_date: '2026-09-29', status: 'PLANNING', target_velocity: 50, actual_velocity: 0, project_name: 'ERP Modernization' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSprints();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await pmApi.createSprint({
        ...formData,
        project_id: formData.project_id || 'default-proj-id'
      });
      setShowModal(false);
      setFormData({ project_id: '', sprint_number: '', sprint_name: '', goal: '', start_date: '', end_date: '', target_velocity: '' });
      loadSprints();
    } catch (err) {
      alert('Failed to create sprint: ' + err.message);
    }
  };

  const handleStart = async (id) => {
    try {
      await pmApi.startSprint(id);
      loadSprints();
    } catch (err) {
      alert('Failed to start sprint: ' + err.message);
    }
  };

  const handleComplete = async () => {
    if (!completeModal) return;
    try {
      await pmApi.completeSprint(completeModal.id, { actual_velocity: actualVelocity });
      setCompleteModal(null);
      setActualVelocity('');
      loadSprints();
    } catch (err) {
      alert('Failed to complete sprint: ' + err.message);
    }
  };

  const activeSprint = sprints.find(s => s.status === 'ACTIVE');

  return (
    <AdminPage
      title="Agile Sprints & Burndown"
      subtitle="Sprint cadences, velocity planning, story point burnup, and scrum ceremonies"
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-lg"></i>
          <span>Plan New Sprint</span>
        </button>
      }
    >
      {activeSprint && (
        <div className="card border-0 shadow-sm rounded-3 p-4 bg-primary text-white mb-4">
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
            <div>
              <span className="badge bg-white text-primary fw-bold mb-2">ACTIVE SPRINT</span>
              <h3 className="fw-bold mb-1">{activeSprint.sprint_name}</h3>
              <p className="mb-0 text-white-50">{activeSprint.goal}</p>
            </div>
            <div className="text-end">
              <div className="fs-5 fw-bold">{activeSprint.actual_velocity} / {activeSprint.target_velocity} Points</div>
              <small className="text-white-50">Story Points Delivered</small>
              <div className="mt-2">
                <button className="btn btn-sm btn-light text-primary fw-bold" onClick={() => setCompleteModal(activeSprint)}>
                  Complete Sprint
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-0 py-3">
          <h6 className="mb-0 fw-bold">Sprint History & Cadence</h6>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Sprint</th>
                <th>Project</th>
                <th>Goal / Focus</th>
                <th>Duration</th>
                <th>Story Points (Act/Tgt)</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-4">Loading sprints...</td></tr>
              ) : sprints.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-4 text-muted">No sprints planned yet.</td></tr>
              ) : (
                sprints.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div className="fw-bold text-dark font-monospace">Sprint {s.sprint_number}</div>
                      <small className="text-muted">{s.sprint_name}</small>
                    </td>
                    <td><span className="badge bg-light text-dark border">{s.project_name || 'Project'}</span></td>
                    <td><div className="text-truncate" style={{ maxWidth: '250px' }}>{s.goal || 'General Sprint'}</div></td>
                    <td><small>{new Date(s.start_date).toLocaleDateString()} - {new Date(s.end_date).toLocaleDateString()}</small></td>
                    <td>
                      <strong className="text-primary">{s.actual_velocity || 0}</strong>
                      <span className="text-muted"> / {s.target_velocity} pts</span>
                    </td>
                    <td>
                      <span className={`badge ${s.status === 'ACTIVE' ? 'bg-success bg-opacity-10 text-success' : s.status === 'COMPLETED' ? 'bg-secondary bg-opacity-10 text-secondary' : 'bg-primary bg-opacity-10 text-primary'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="text-end">
                      {s.status === 'PLANNING' && (
                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleStart(s.id)}>
                          Start Sprint
                        </button>
                      )}
                      {s.status === 'ACTIVE' && (
                        <button className="btn btn-sm btn-outline-success" onClick={() => setCompleteModal(s)}>
                          Close
                        </button>
                      )}
                      {s.status === 'COMPLETED' && (
                        <span className="text-muted small">Archived</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title">Plan Sprint</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body">
                  <div className="row g-2 mb-3">
                    <div className="col-md-4">
                      <label className="form-label">Sprint # *</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        value={formData.sprint_number}
                        onChange={e => setFormData({ ...formData, sprint_number: e.target.value })}
                      />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label">Sprint Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        placeholder="e.g. Sprint 16: UI Redesign"
                        value={formData.sprint_name}
                        onChange={e => setFormData({ ...formData, sprint_name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Sprint Goal</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="What is the primary deliverable of this iteration?"
                      value={formData.goal}
                      onChange={e => setFormData({ ...formData, goal: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Start Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        value={formData.start_date}
                        onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">End Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        value={formData.end_date}
                        onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Target Velocity (Story Points)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="e.g. 40"
                      value={formData.target_velocity}
                      onChange={e => setFormData({ ...formData, target_velocity: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Create Sprint</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {completeModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title">Close Sprint {completeModal.sprint_number}</h5>
                <button type="button" className="btn-close" onClick={() => setCompleteModal(null)}></button>
              </div>
              <div className="modal-body">
                <p className="text-muted small">Record final velocity points completed during this sprint cycle.</p>
                <div className="mb-3">
                  <label className="form-label">Actual Velocity Points Completed *</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    placeholder="e.g. 42"
                    value={actualVelocity}
                    onChange={e => setActualVelocity(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" onClick={() => setCompleteModal(null)}>Cancel</button>
                <button type="button" className="btn btn-success" onClick={handleComplete}>Complete & Archive</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
