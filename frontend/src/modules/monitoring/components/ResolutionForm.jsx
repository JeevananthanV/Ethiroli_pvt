import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { getResolutionHistory, submitResolution, getErrorDetails } from '../../services/api/monitoringApi';
import Input from '../../common/components/Input/Input.jsx';
import Button from '../../common/components/Button/Button.jsx';

const ResolutionForm = ({ errorId, onResolved }) => {
  const [resolution, setResolution] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    notes: '',
    assignedTo: '',
    status: 'resolved',
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [resolutionData, historyData] = await Promise.all([
        getErrorDetails(errorId),
        getResolutionHistory(errorId)
      ]);
      setResolution(resolutionData);
      setHistory(historyData.resolutions || historyData || []);
      if (resolutionData.status) {
        setFormData(prev => ({ ...prev, status: resolutionData.status }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [errorId]);

  useEffect(() => {
    if (errorId) {
      loadData();
    }
  }, [errorId, loadData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const result = await submitResolution(errorId, formData);
      if (onResolved) onResolved(result);
      alert('Resolution submitted successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!errorId) {
    return (
      <AdminPage title="Resolution Form" subtitle="Select an error to resolve">
        <div className="emptyState">
          <h3>No Error Selected</h3>
          <p>Please select an error from the error log to resolve it.</p>
        </div>
      </AdminPage>
    );
  }

  if (loading) return <div className="loading">Loading error details...</div>;
  if (error) return <div className="emptyState"><h3>Error</h3><p>{error}</p><button className="btn primary" onClick={loadData}>Retry</button></div>;

  return (
    <AdminPage
      title="Resolution Form"
      subtitle="Resolve and update error status"
      loading={loading}
      error={error}
      onRetry={loadData}
    >
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="cardHeader">
          <h3 className="cardTitle">Error Details</h3>
        </div>
        <div className="cardBody">
          <div className="formGroup">
            <label className="label">Error Message</label>
            <p className="textSecondary">{resolution?.message || resolution?.error || 'No message'}</p>
          </div>
          <div className="formGroup" style={{ marginTop: '12px' }}>
            <label className="label">Severity</label>
            <span className={`statusTag ${resolution?.severity?.toLowerCase() || 'pending'}`}>
              {resolution?.severity || 'Unknown'}
            </span>
          </div>
          <div className="formGroup" style={{ marginTop: '12px' }}>
            <label className="label">Source</label>
            <p className="textSecondary">{resolution?.source || resolution?.service || '-'}</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="cardHeader">
          <h3 className="cardTitle">Submit Resolution</h3>
        </div>
        <div className="cardBody">
          <form onSubmit={handleSubmit}>
            {error && <div className="emptyState" style={{ padding: '12px', marginBottom: '12px' }}><p className="textDanger">{error}</p></div>}
            <div className="formGroup">
              <label className="label">Resolution Notes</label>
              <textarea
                className="textarea"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                placeholder="Describe the resolution steps..."
                required
              />
            </div>
            <div className="formGroup" style={{ marginTop: '12px' }}>
              <label className="label">Assigned To</label>
              <input
                type="text"
                className="inputField"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                placeholder="Enter assignee name"
              />
            </div>
            <div className="formGroup" style={{ marginTop: '12px' }}>
              <label className="label">Status</label>
              <select
                className="select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="resolved">Resolved</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
              </select>
            </div>
            <div className="pageActions" style={{ marginTop: '16px' }}>
              <Button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Resolution'}</Button>
            </div>
          </form>
        </div>
      </div>

      {history.length > 0 && (
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Resolution History</h3>
          </div>
          <div className="cardBody">
            <div className="overflowAuto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Notes</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.id}>
                      <td className="textSecondary">{h.createdAt ? new Date(h.createdAt).toLocaleString() : '-'}</td>
                      <td className="textSecondary">{h.notes || '-'}</td>
                      <td className="textSecondary">{h.assignedTo || '-'}</td>
                      <td>
                        <span className={`statusTag ${h.status?.toLowerCase() || 'pending'}`}>
                          {h.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
};

export default ResolutionForm;
