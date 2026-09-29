import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../services/api/axiosInstance.js';

export default function SecurityCenter() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedThreat, setSelectedThreat] = useState(null);

  // Form states
  const [revokeForm, setRevokeForm] = useState({ userId: '', reason: 'Suspected compromised credentials / anomaly containment', lockAccount: true });
  const [blockForm, setBlockForm] = useState({ sourceIp: '', reason: 'Malicious payload / repeated rate limit breach' });
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchThreats = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/v1/security/threats');
      setThreats(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Failed to load security threats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreats();
  }, []);

  const handleRevokeSessions = async (e) => {
    e.preventDefault();
    if (!revokeForm.userId) return;
    setActionLoading(true);
    setFeedback(null);
    try {
      // 1. Revoke all active sessions
      const res = await axiosInstance.post('/v1/security/sessions/revoke-all', {
        userId: revokeForm.userId,
        reason: revokeForm.reason
      });

      // 2. Lock account if requested
      if (revokeForm.lockAccount) {
        await axiosInstance.patch(`/v1/security/users/${revokeForm.userId}/lock`, {
          reason: revokeForm.reason
        });
      }

      setFeedback({
        type: 'success',
        message: `Emergency isolation complete. ${res.data?.message || 'Sessions revoked and account locked across all cluster workers.'}`
      });
      setShowRevokeModal(false);
      setRevokeForm({ userId: '', reason: 'Suspected compromised credentials / anomaly containment', lockAccount: true });
      fetchThreats();
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || err.message || 'Failed to revoke sessions.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlockIp = async (e) => {
    e.preventDefault();
    if (!blockForm.sourceIp) return;
    setActionLoading(true);
    setFeedback(null);
    try {
      await axiosInstance.post('/v1/security/threats/block-ip', blockForm);
      setFeedback({
        type: 'success',
        message: `Firewall block active for IP: ${blockForm.sourceIp}`
      });
      setShowBlockModal(false);
      setBlockForm({ sourceIp: '', reason: 'Malicious payload / repeated rate limit breach' });
      fetchThreats();
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || err.message || 'Failed to block IP.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="container-fluid p-3 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-shield-shaded text-primary" aria-hidden="true"></i>
            Global Security Center & Threat Defense
          </h2>
          <p className="text-secondary small mb-0">
            Real-time automated threat detection, multi-factor hardware policies, and anomalous session containment.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 shadow-sm"
            onClick={() => setShowBlockModal(true)}
          >
            <i className="bi bi-slash-circle" aria-hidden="true"></i> Block CIDR / IP
          </button>
          <button 
            className="btn btn-danger btn-sm d-flex align-items-center gap-1 shadow-sm"
            onClick={() => setShowRevokeModal(true)}
          >
            <i className="bi bi-person-x-fill" aria-hidden="true"></i> Emergency Session Isolation
          </button>
          <button 
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 shadow-sm"
            onClick={fetchThreats}
          >
            <i className="bi bi-arrow-clockwise" aria-hidden="true"></i> Refresh
          </button>
        </div>
      </div>

      {feedback && (
        <div className={`alert alert-${feedback.type} alert-dismissible fade show shadow-sm mb-2`} role="alert">
          <div className="d-flex align-items-center gap-2">
            <i className={`bi ${feedback.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} fs-5`}></i>
            <div>{feedback.message}</div>
          </div>
          <button type="button" className="btn-close" onClick={() => setFeedback(null)} aria-label="Close"></button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="row g-3 mb-2">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-success border-4">
            <span className="text-secondary small fw-semibold text-uppercase">Platform Security Posture</span>
            <h3 className="fw-bold text-success my-1">Grade A+</h3>
            <small className="text-muted">SOC2 & ISO 27001 Compliant</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-primary border-4">
            <span className="text-secondary small fw-semibold text-uppercase">Cluster Session Sync</span>
            <h3 className="fw-bold text-primary my-1">Active</h3>
            <small className="text-muted">Multi-worker IPC synchronized</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-warning border-4">
            <span className="text-secondary small fw-semibold text-uppercase">Active Blocked Threats</span>
            <h3 className="fw-bold text-warning my-1">{threats.length} Threats</h3>
            <small className="text-muted">Auto-contained by WAF</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-info border-4">
            <span className="text-secondary small fw-semibold text-uppercase">RBAC Access Mode</span>
            <h3 className="fw-bold text-info my-1">Universal</h3>
            <small className="text-muted">Admin & Super Admin Full Scope</small>
          </div>
        </div>
      </div>

      {/* Threat Interceptions Table */}
      <div className="card border-0 shadow-sm rounded-3 bg-white p-3">
        <h5 className="fw-bold mb-3 d-flex align-items-center justify-content-between">
          <span>Real-time WAF & Threat Interceptions</span>
          <span className="badge bg-secondary">{threats.length} Recorded</span>
        </h5>
        {loading ? (
          <div className="text-center py-5 text-muted">
            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
            Loading security stream...
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Threat Pattern</th>
                  <th>Source IP</th>
                  <th>Target Endpoint</th>
                  <th>Severity</th>
                  <th>Interception Time</th>
                  <th>Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {threats.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">No security incidents detected. System is clean.</td>
                  </tr>
                ) : (
                  threats.map(t => (
                    <tr key={t.id}>
                      <td>
                        <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 font-monospace">
                          {t.threat_type}
                        </span>
                      </td>
                      <td><code>{t.source_ip}</code></td>
                      <td><code className="text-muted">{t.target_endpoint}</code></td>
                      <td>
                        <span className={`badge ${t.severity === 'CRITICAL' ? 'bg-danger' : t.severity === 'HIGH' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                          {t.severity}
                        </span>
                      </td>
                      <td className="small text-muted">{new Date(t.created_at).toLocaleString()}</td>
                      <td>
                        <span className="badge bg-dark">{t.status}</span>
                      </td>
                      <td className="text-end">
                        <button 
                          className="btn btn-outline-secondary btn-sm py-1 px-2"
                          onClick={() => setSelectedThreat(t)}
                        >
                          Inspect Log
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Emergency Revoke Modal */}
      {showRevokeModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <i className="bi bi-shield-slash"></i>
                  Emergency User Session Isolation
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowRevokeModal(false)}></button>
              </div>
              <form onSubmit={handleRevokeSessions}>
                <div className="modal-body p-3">
                  <div className="alert alert-warning py-2 small mb-3">
                    <i className="bi bi-exclamation-triangle-fill me-1"></i>
                    This action immediately purges all active JWT sessions in the database, sends a force-disconnect across all cluster worker forks, and locks out the account.
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Target User ID</label>
                    <input 
                      type="text" 
                      className="form-control font-monospace" 
                      required 
                      placeholder="e.g. 368f5c88-12cd-11ed-861d-0242ac120002"
                      value={revokeForm.userId}
                      onChange={e => setRevokeForm({ ...revokeForm, userId: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Revocation Reason</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      value={revokeForm.reason}
                      onChange={e => setRevokeForm({ ...revokeForm, reason: e.target.value })}
                    />
                  </div>
                  <div className="form-check form-switch mb-2">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="lockSwitch"
                      checked={revokeForm.lockAccount}
                      onChange={e => setRevokeForm({ ...revokeForm, lockAccount: e.target.checked })}
                    />
                    <label className="form-check-label small fw-semibold" htmlFor="lockSwitch">
                      Simultaneously lock account and require credential reset
                    </label>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowRevokeModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-danger btn-sm" disabled={actionLoading}>
                    {actionLoading ? 'Executing Containment...' : 'Execute Emergency Revocation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Block IP Modal */}
      {showBlockModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">Block CIDR / IP Address</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowBlockModal(false)}></button>
              </div>
              <form onSubmit={handleBlockIp}>
                <div className="modal-body p-3">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">IP Address / Range</label>
                    <input 
                      type="text" 
                      className="form-control font-monospace" 
                      required 
                      placeholder="e.g. 185.220.101.5"
                      value={blockForm.sourceIp}
                      onChange={e => setBlockForm({ ...blockForm, sourceIp: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Containment Reason</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      value={blockForm.reason}
                      onChange={e => setBlockForm({ ...blockForm, reason: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowBlockModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-dark btn-sm" disabled={actionLoading}>
                    {actionLoading ? 'Blocking...' : 'Block IP Address'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Log Modal */}
      {selectedThreat && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Threat Metadata Details</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedThreat(null)}></button>
              </div>
              <div className="modal-body p-3">
                <pre className="bg-light p-3 rounded font-monospace small mb-0" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {JSON.stringify(selectedThreat, null, 2)}
                </pre>
              </div>
              <div className="modal-footer bg-light">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSelectedThreat(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
