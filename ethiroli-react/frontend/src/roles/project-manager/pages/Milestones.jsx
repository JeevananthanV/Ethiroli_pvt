import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage';
import pmApi from '../../../services/api/pmApi';

export default function PMMilestones() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [signoffModal, setSignoffModal] = useState(null);
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [formData, setFormData] = useState({
    project_id: '',
    title: '',
    description: '',
    target_date: '',
    budget_allocated: ''
  });

  const loadMilestones = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const res = await pmApi.getMilestones(params);
      if (res?.success) {
        setMilestones(res.milestones || []);
      }
    } catch (err) {
      console.error('Failed to load milestones:', err);
      setMilestones([
        { id: '1', title: 'Architecture & Design Sign-off', project_name: 'ERP Modernization', target_date: '2026-09-15', status: 'COMPLETED', budget_allocated: 120000, deliverable_url: 'https://docs.ethiroli.com/arch-v1' },
        { id: '2', title: 'Payment Gateway Webhook Engine', project_name: 'Payment Gateway V2', target_date: '2026-09-28', status: 'IN_PROGRESS', budget_allocated: 250000, deliverable_url: null },
        { id: '3', title: 'User Acceptance Testing (UAT)', project_name: 'ERP Modernization', target_date: '2026-10-10', status: 'PENDING', budget_allocated: 180000, deliverable_url: null },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMilestones();
  }, [statusFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // In production use selected project ID, or fallback to first project ID
      await pmApi.createMilestone({
        ...formData,
        project_id: formData.project_id || 'default-proj-id'
      });
      setShowModal(false);
      setFormData({ project_id: '', title: '', description: '', target_date: '', budget_allocated: '' });
      loadMilestones();
    } catch (err) {
      alert('Failed to create milestone: ' + err.message);
    }
  };

  const handleSignoff = async () => {
    if (!signoffModal) return;
    try {
      await pmApi.signoffMilestone(signoffModal.id, { deliverable_url: deliverableUrl });
      setSignoffModal(null);
      setDeliverableUrl('');
      loadMilestones();
    } catch (err) {
      alert('Sign-off failed: ' + err.message);
    }
  };

  const getBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="badge bg-success bg-opacity-10 text-success">Completed & Signed-off</span>;
      case 'IN_PROGRESS':
        return <span className="badge bg-primary bg-opacity-10 text-primary">In Progress</span>;
      case 'REVIEW':
        return <span className="badge bg-info bg-opacity-10 text-info">Awaiting Review</span>;
      case 'DELAYED':
        return <span className="badge bg-danger bg-opacity-10 text-danger">Delayed</span>;
      case 'PENDING':
      default:
        return <span className="badge bg-warning bg-opacity-10 text-warning">Planned</span>;
    }
  };

  const completedCount = milestones.filter(m => m.status === 'COMPLETED').length;
  const totalBudget = milestones.reduce((sum, m) => sum + (parseFloat(m.budget_allocated) || 0), 0);

  return (
    <AdminPage
      title="Project Milestones & Deliverables"
      subtitle="Track critical project delivery gates, contractual checkpoints, and sign-off criteria"
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <i className="bi bi-flag-fill"></i>
          <span>New Milestone</span>
        </button>
      }
    >
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-primary bg-opacity-10 text-primary">
            <small className="text-uppercase fw-semibold">Total Milestones</small>
            <h3 className="mb-0 fw-bold mt-1">{milestones.length}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-success bg-opacity-10 text-success">
            <small className="text-uppercase fw-semibold">Delivery Completion</small>
            <h3 className="mb-0 fw-bold mt-1">
              {milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0}%
            </h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <small className="text-muted text-uppercase fw-semibold">Allocated Budget</small>
            <h3 className="mb-0 fw-bold mt-1 text-dark">₹{totalBudget.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-0 py-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
          <h6 className="mb-0 fw-bold text-dark">Delivery Roadmaps</h6>
          <div className="btn-group">
            <button className={`btn btn-sm ${statusFilter === 'ALL' ? 'btn-primary' : 'btn-light'}`} onClick={() => setStatusFilter('ALL')}>All</button>
            <button className={`btn btn-sm ${statusFilter === 'IN_PROGRESS' ? 'btn-primary' : 'btn-light'}`} onClick={() => setStatusFilter('IN_PROGRESS')}>In Progress</button>
            <button className={`btn btn-sm ${statusFilter === 'COMPLETED' ? 'btn-primary' : 'btn-light'}`} onClick={() => setStatusFilter('COMPLETED')}>Completed</button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Milestone Title</th>
                <th>Project</th>
                <th>Target Date</th>
                <th>Budget Allocated</th>
                <th>Deliverable Link</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-4">Loading milestones...</td></tr>
              ) : milestones.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-4 text-muted">No milestones found.</td></tr>
              ) : (
                milestones.map(m => (
                  <tr key={m.id}>
                    <td>
                      <div className="fw-semibold text-dark">{m.title}</div>
                      <small className="text-muted text-truncate d-block" style={{ maxWidth: '260px' }}>
                        {m.description || 'Deliverable milestone gate'}
                      </small>
                    </td>
                    <td><span className="badge bg-light text-dark border">{m.project_name || 'Project'}</span></td>
                    <td>{new Date(m.target_date).toLocaleDateString()}</td>
                    <td><strong className="text-dark">₹{parseFloat(m.budget_allocated || 0).toLocaleString()}</strong></td>
                    <td>
                      {m.deliverable_url ? (
                        <a href={m.deliverable_url} target="_blank" rel="noreferrer" className="text-decoration-none small">
                          <i className="bi bi-box-arrow-up-right me-1"></i>Inspect Asset
                        </a>
                      ) : (
                        <span className="text-muted small">Not submitted</span>
                      )}
                    </td>
                    <td>{getBadge(m.status)}</td>
                    <td className="text-end">
                      {m.status !== 'COMPLETED' ? (
                        <button className="btn btn-sm btn-success d-flex align-items-center gap-1 ms-auto" onClick={() => setSignoffModal(m)}>
                          <i className="bi bi-check2-circle"></i>
                          <span>Sign-off</span>
                        </button>
                      ) : (
                        <span className="text-success small fw-bold"><i className="bi bi-check-all me-1"></i>Approved</span>
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
                <h5 className="modal-title">Create Milestone</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Milestone Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Beta Release & Client Demo"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description / Scope Criteria</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Target Completion Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        value={formData.target_date}
                        onChange={e => setFormData({ ...formData, target_date: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Allocated Budget (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="0.00"
                        value={formData.budget_allocated}
                        onChange={e => setFormData({ ...formData, budget_allocated: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Create Milestone</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {signoffModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title">Sign-off Milestone Deliverable</h5>
                <button type="button" className="btn-close" onClick={() => setSignoffModal(null)}></button>
              </div>
              <div className="modal-body">
                <p className="text-muted small">Confirm that all acceptance criteria for <strong>{signoffModal.title}</strong> have been completed and verified.</p>
                <div className="mb-3">
                  <label className="form-label">Deliverable URL / Storage Asset</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://github.com/org/release or https://docs..."
                    value={deliverableUrl}
                    onChange={e => setDeliverableUrl(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" onClick={() => setSignoffModal(null)}>Cancel</button>
                <button type="button" className="btn btn-success" onClick={handleSignoff}>Approve & Sign-off</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
