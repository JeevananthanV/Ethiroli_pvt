import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { listErrorLogs, resolveError, getErrorDetails, getSeverityFilters } from '../../services/api/monitoringApi';
import Modal from '../../common/components/Modal/Modal.jsx';
import Button from '../../common/components/Button/Button.jsx';

const ErrorLogTable = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [severities, setSeverities] = useState([]);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = severityFilter !== 'all' ? { severity: severityFilter } : {};
      const data = await listErrorLogs(params);
      setItems(data.items || data.errors || data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [severityFilter]);

  const loadSeverities = useCallback(async () => {
    try {
      const data = await getSeverityFilters();
      setSeverities(data.severities || data || []);
    } catch (err) {
      console.error('Failed to load severities:', err);
    }
  }, []);

  useEffect(() => {
    loadSeverities();
  }, [loadSeverities]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleViewDetails = async (item) => {
    setDetailLoading(true);
    setSelectedItem(item);
    try {
      const data = await getErrorDetails(item.id);
      setSelectedItem(data);
    } catch (err) {
      console.error('Failed to load details:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!selectedItem) return;
    setResolving(true);
    try {
      await resolveError(selectedItem.id);
      setItems(items.filter(i => i.id !== selectedItem.id));
      setSelectedItem(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setResolving(false);
    }
  };

  const getStatusClass = (status) => {
    if (!status) return 'pending';
    const lower = status.toLowerCase();
    if (lower === 'resolved' || lower === 'active') return 'active';
    if (lower === 'pending' || lower === 'open') return 'pending';
    if (lower === 'error' || lower === 'critical') return 'error';
    return 'pending';
  };

  return (
    <AdminPage
      title="Error Logs"
      subtitle="Monitor and resolve system errors"
      loading={loading}
      error={error}
      onRetry={loadItems}
      actions={
        <div className="pageActions">
          <select
            className="select"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="all">All Severities</option>
            {severities.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button className="btn primary" onClick={loadItems}>Refresh</button>
        </div>
      }
    >
      <div className="card">
        <div className="cardBody">
          {items.length === 0 ? (
            <div className="emptyState">
              <h3>No error logs found</h3>
              <p>There are no error logs matching your criteria.</p>
            </div>
          ) : (
            <div className="overflowAuto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Error</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Source</th>
                    <th>Timestamp</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="textPrimary">{item.message || item.error || 'Unknown error'}</td>
                      <td>
                        <span className={`statusTag ${item.severity?.toLowerCase() || 'pending'}`}>
                          {item.severity || 'Unknown'}
                        </span>
                      </td>
                      <td>
                        <span className={`statusTag ${getStatusClass(item.status)}`}>
                          {item.status || 'Pending'}
                        </span>
                      </td>
                      <td className="textSecondary">{item.source || item.service || '-'}</td>
                      <td className="textSecondary">{item.timestamp ? new Date(item.timestamp).toLocaleString() : '-'}</td>
                      <td>
                        <button className="btn btnSm secondary" onClick={() => handleViewDetails(item)}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {selectedItem && (
        <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title="Error Details">
          {detailLoading ? (
            <div className="loading">Loading details...</div>
          ) : (
            <div>
              <div className="formGroup">
                <label className="label">Message</label>
                <p className="textSecondary">{selectedItem.message || selectedItem.error || 'No message'}</p>
              </div>
              <div className="formGroup" style={{ marginTop: '12px' }}>
                <label className="label">Severity</label>
                <p className="textSecondary">{selectedItem.severity || 'Unknown'}</p>
              </div>
              <div className="formGroup" style={{ marginTop: '12px' }}>
                <label className="label">Source</label>
                <p className="textSecondary">{selectedItem.source || selectedItem.service || '-'}</p>
              </div>
              <div className="formGroup" style={{ marginTop: '12px' }}>
                <label className="label">Stack Trace</label>
                <pre className="textSecondary" style={{ background: 'var(--admin-bg-input)', padding: '12px', borderRadius: '8px', overflow: 'auto', maxHeight: '200px' }}>
                  {selectedItem.stackTrace || selectedItem.stack || 'No stack trace available'}
                </pre>
              </div>
              <div className="pageActions" style={{ marginTop: '16px' }}>
                <Button variant="secondary" onClick={() => setSelectedItem(null)}>Close</Button>
                {selectedItem.status?.toLowerCase() !== 'resolved' && (
                  <Button onClick={handleResolve} disabled={resolving}>{resolving ? 'Resolving...' : 'Resolve'}</Button>
                )}
              </div>
            </div>
          )}
        </Modal>
      )}
    </AdminPage>
  );
};

export default ErrorLogTable;
