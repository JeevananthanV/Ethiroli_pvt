import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../services/api/axiosInstance.js';

export default function FeatureFlags() {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [killSwitchTarget, setKillSwitchTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [newFlag, setNewFlag] = useState({
    flag_key: '',
    name: '',
    description: '',
    environment: 'PROD',
    rollout_percentage: 100,
    is_enabled: true
  });

  const fetchFlags = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/v1/feature-flags');
      setFlags(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Failed to load feature flags', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const handleToggle = async (key, currentStatus, currentRollout) => {
    try {
      const nextStatus = !currentStatus;
      await axiosInstance.patch(`/v1/feature-flags/${key}/toggle`, {
        is_enabled: nextStatus,
        rollout_percentage: currentRollout || 100
      });
      setFlags(prev => prev.map(f => f.flag_key === key ? { ...f, is_enabled: nextStatus, status: nextStatus } : f));
      setFeedback({
        type: 'success',
        message: `Feature flag '${key}' toggled to ${nextStatus ? 'ENABLED' : 'DISABLED'}.`
      });
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || err.message || 'Failed to toggle flag.'
      });
    }
  };

  const handleEmergencyKillSwitch = async (key) => {
    setActionLoading(true);
    try {
      await axiosInstance.post(`/v1/feature-flags/${key}/kill-switch`, {
        reason: 'Immediate mitigation triggered from Feature Flags Console'
      });
      setFeedback({
        type: 'warning',
        message: `🚨 Emergency kill-switch engaged for '${key}'. Rollout set to 0% and flag disabled across all workers.`
      });
      setKillSwitchTarget(null);
      fetchFlags();
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || err.message || 'Failed to engage kill switch.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateFlag = async (e) => {
    e.preventDefault();
    if (!newFlag.flag_key || !newFlag.name) return;
    setActionLoading(true);
    try {
      await axiosInstance.post('/v1/feature-flags', newFlag);
      setFeedback({
        type: 'success',
        message: `Feature flag '${newFlag.flag_key}' created successfully.`
      });
      setShowCreateModal(false);
      setNewFlag({
        flag_key: '',
        name: '',
        description: '',
        environment: 'PROD',
        rollout_percentage: 100,
        is_enabled: true
      });
      fetchFlags();
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || err.message || 'Failed to create flag.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-toggles text-primary" aria-hidden="true"></i>
            Global Feature Flags & Canary Releases
          </h2>
          <p className="text-secondary small mb-0">
            Dynamically toggle platform features, tenant rollout percentages, and execute emergency kill-switches with zero code deployments.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-primary btn-sm d-flex align-items-center gap-1 shadow-sm"
            onClick={() => setShowCreateModal(true)}
          >
            <i className="bi bi-plus-lg" aria-hidden="true"></i> Create Feature Flag
          </button>
          <button className="btn btn-outline-secondary btn-sm" onClick={fetchFlags}>
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
        </div>
      </div>

      {feedback && (
        <div className={`alert alert-${feedback.type} alert-dismissible fade show shadow-sm mb-4`} role="alert">
          <div>{feedback.message}</div>
          <button type="button" className="btn-close" onClick={() => setFeedback(null)}></button>
        </div>
      )}

      <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
        <h5 className="fw-bold mb-3 d-flex align-items-center justify-content-between">
          <span>Active Feature Flag Toggles</span>
          <span className="badge bg-secondary">{flags.length} Flags Configured</span>
        </h5>
        {loading ? (
          <div className="text-center py-5 text-muted">
            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
            Loading feature flags...
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Feature Flag Name & Key</th>
                  <th>Description</th>
                  <th>Environment</th>
                  <th>Rollout %</th>
                  <th>Live Status</th>
                  <th className="text-center">Toggle</th>
                  <th className="text-end">Emergency Action</th>
                </tr>
              </thead>
              <tbody>
                {flags.map(f => (
                  <tr key={f.id || f.flag_key}>
                    <td>
                      <div className="fw-bold text-dark">{f.name}</div>
                      <code className="text-muted font-monospace small">{f.flag_key}</code>
                    </td>
                    <td className="small text-secondary">{f.description}</td>
                    <td>
                      <span className={`badge ${f.environment === 'PROD' ? 'bg-primary' : f.environment === 'CANARY' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                        {f.environment}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress flex-grow-1" style={{ height: '6px', width: '60px' }}>
                          <div className="progress-bar bg-success" style={{ width: `${f.rollout_percentage || 100}%` }}></div>
                        </div>
                        <small className="fw-semibold">{f.rollout_percentage || 100}%</small>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${f.is_enabled ? 'bg-success' : 'bg-danger'}`}>
                        {f.is_enabled ? 'ENABLED' : 'DISABLED'}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="form-check form-switch d-inline-block">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          role="switch"
                          checked={Boolean(f.is_enabled)}
                          onChange={() => handleToggle(f.flag_key, f.is_enabled, f.rollout_percentage)}
                        />
                      </div>
                    </td>
                    <td className="text-end">
                      <button 
                        className="btn btn-outline-danger btn-sm py-1 px-2"
                        title="Instantly disable flag and drop rollout to 0%"
                        onClick={() => setKillSwitchTarget(f)}
                      >
                        <i className="bi bi-power me-1"></i> Kill Switch
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Flag Modal */}
      {showCreateModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">Provision New Feature Flag</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <form onSubmit={handleCreateFlag}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Flag Key (Unique ID)</label>
                    <input 
                      type="text" 
                      className="form-control font-monospace" 
                      required 
                      placeholder="e.g. enable_new_quiz_engine"
                      value={newFlag.flag_key}
                      onChange={e => setNewFlag({ ...newFlag, flag_key: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_') })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Display Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      placeholder="e.g. Next-Gen Assessment Engine"
                      value={newFlag.name}
                      onChange={e => setNewFlag({ ...newFlag, name: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Description</label>
                    <textarea 
                      className="form-control" 
                      rows="2"
                      value={newFlag.description}
                      onChange={e => setNewFlag({ ...newFlag, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="row g-2">
                    <div className="col-6 mb-3">
                      <label className="form-label fw-semibold small">Environment</label>
                      <select 
                        className="form-select"
                        value={newFlag.environment}
                        onChange={e => setNewFlag({ ...newFlag, environment: e.target.value })}
                      >
                        <option value="PROD">PROD</option>
                        <option value="CANARY">CANARY</option>
                        <option value="STAGING">STAGING</option>
                      </select>
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label fw-semibold small">Rollout Percentage</label>
                      <input 
                        type="number" 
                        className="form-control"
                        min="0"
                        max="100"
                        value={newFlag.rollout_percentage}
                        onChange={e => setNewFlag({ ...newFlag, rollout_percentage: parseInt(e.target.value, 10) })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowCreateModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={actionLoading}>
                    {actionLoading ? 'Creating...' : 'Create Flag'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Kill Switch Modal */}
      {killSwitchTarget && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <i className="bi bi-radioactive"></i>
                  Confirm Emergency Kill-Switch
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setKillSwitchTarget(null)}></button>
              </div>
              <div className="modal-body p-4">
                <p className="mb-2">Are you sure you want to engage the emergency kill-switch for:</p>
                <div className="p-3 bg-light rounded border mb-3">
                  <strong className="text-danger">{killSwitchTarget.name}</strong>
                  <div className="small font-monospace text-muted">{killSwitchTarget.flag_key}</div>
                </div>
                <div className="alert alert-danger py-2 small mb-0">
                  This will instantly set rollout to 0% and toggle the feature flag to DISABLED across all cluster worker forks, terminating any active workflows utilizing this feature.
                </div>
              </div>
              <div className="modal-footer bg-light">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setKillSwitchTarget(null)}>Cancel</button>
                <button 
                  type="button" 
                  className="btn btn-danger btn-sm" 
                  disabled={actionLoading}
                  onClick={() => handleEmergencyKillSwitch(killSwitchTarget.flag_key)}
                >
                  {actionLoading ? 'Engaging...' : 'Engage Emergency Kill-Switch'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
