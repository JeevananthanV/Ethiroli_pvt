import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listErrorLogs, resolveError } from '../../services/api/monitoringApi.js';

export default function ErrorTracking() {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('');
  const [selectedError, setSelectedError] = useState(null);
  const [resolvingId, setResolvingId] = useState(null);

  const loadErrors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = filterSeverity ? { severity: filterSeverity } : {};
      const data = await listErrorLogs(params);
      setErrors(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load error logs');
    } finally {
      setLoading(false);
    }
  }, [filterSeverity]);

  useEffect(() => {
    loadErrors();
  }, [loadErrors]);

  const handleResolve = async (id) => {
    setResolvingId(id);
    try {
      await resolveError(id);
      setErrors((prev) => prev.map((e) => (e.id === id ? { ...e, status: 'resolved' } : e)));
      setSelectedError((prev) => (prev?.id === id ? { ...prev, status: 'resolved' } : prev));
    } catch (err) {
      alert(`Failed to resolve: ${err.message}`);
    } finally {
      setResolvingId(null);
    }
  };

  const getSeverityClass = (severity) => {
    switch ((severity || '').toLowerCase()) {
      case 'critical':
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'active';
      default:
        return 'pending';
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const severityCounts = errors.reduce((acc, err) => {
    const sev = (err.severity || 'unknown').toLowerCase();
    acc[sev] = (acc[sev] || 0) + 1;
    return acc;
  }, {});

  return (
    <AdminPage
      title="Error Tracking"
      subtitle="Monitor application errors, trends, and alerts"
      loading={loading}
      error={error}
      onRetry={loadErrors}
      actions={
        <select className="select" value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
          <option value="">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {['critical', 'high', 'medium', 'low'].map((sev) => (
          <div key={sev} className="statCard">
            <div className="statLabel" style={{ textTransform: 'capitalize' }}>{sev}</div>
            <div className={`statValue ${getSeverityClass(sev) === 'error' ? 'textDanger' : getSeverityClass(sev) === 'warning' ? 'textWarning' : getSeverityClass(sev) === 'active' ? 'textSuccess' : ''}`}>
              {severityCounts[sev] || 0}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedError ? '1fr 1fr' : '1fr', gap: 20 }}>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Error Logs</h3></div>
          <div className="cardBody" style={{ overflowX: 'auto', maxHeight: 600, overflowY: 'auto' }}>
            {errors.length === 0 ? (
              <div className="emptyState">No error logs found.</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Severity</th>
                    <th>Message</th>
                    <th>Source</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {errors.map((err) => (
                    <tr
                      key={err.id}
                      style={{ cursor: 'pointer', background: selectedError?.id === err.id ? 'rgba(255,255,255,0.03)' : 'transparent' }}
                      onClick={() => setSelectedError(err)}
                    >
                      <td>
                        <span className={`statusTag ${getSeverityClass(err.severity)}`}>
                          {err.severity || 'info'}
                        </span>
                      </td>
                      <td className="textPrimary" style={{ fontWeight: 500, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {err.message || err.error_message}
                      </td>
                      <td className="textSecondary">{err.source || err.service || '-'}</td>
                      <td className="textSecondary">{formatDate(err.created_at || err.timestamp)}</td>
                      <td>
                        <span className={`statusTag ${err.status === 'resolved' ? 'active' : 'error'}`}>
                          {err.status || 'open'}
                        </span>
                      </td>
                      <td>
                        {(err.status === 'open' || err.status === 'new') && (
                          <button
                            className="btn success"
                            style={{ padding: '4px 10px', fontSize: 12 }}
                            onClick={(e) => { e.stopPropagation(); handleResolve(err.id); }}
                            disabled={resolvingId === err.id}
                          >
                            {resolvingId === err.id ? 'Resolving...' : 'Resolve'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {selectedError && (
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Error Details</h3>
              <span className={`statusTag ${getSeverityClass(selectedError.severity)}`}>
                {selectedError.severity || 'info'}
              </span>
            </div>
            <div className="cardBody">
              <div style={{ marginBottom: 16 }}>
                <span className="textMuted">Message:</span>
                <div className="textPrimary" style={{ fontWeight: 500 }}>{selectedError.message || selectedError.error_message}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <span className="textMuted">Source:</span>
                <div className="textSecondary">{selectedError.source || selectedError.service || '-'}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <span className="textMuted">Stack Trace:</span>
                <pre style={{ background: 'var(--admin-bg-dark)', padding: 12, borderRadius: 6, fontSize: 12, maxHeight: 300, overflow: 'auto' }}>
                  {selectedError.stack_trace || selectedError.stack || 'No stack trace available'}
                </pre>
              </div>
              <div style={{ marginBottom: 16 }}>
                <span className="textMuted">Metadata:</span>
                <pre style={{ background: 'var(--admin-bg-dark)', padding: 12, borderRadius: 6, fontSize: 12 }}>
                  {JSON.stringify(selectedError.metadata || selectedError.context || {}, null, 2)}
                </pre>
              </div>
              {(selectedError.status === 'open' || selectedError.status === 'new') && (
                <button
                  className="btn success"
                  onClick={() => handleResolve(selectedError.id)}
                  disabled={resolvingId === selectedError.id}
                >
                  {resolvingId === selectedError.id ? 'Resolving...' : 'Mark Resolved'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminPage>
  );
}
