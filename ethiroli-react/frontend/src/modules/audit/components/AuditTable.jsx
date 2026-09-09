import React, { useEffect, useState, useMemo, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getAuditLogs } from '../../services/api/auditApi.js';

export default function AuditTable() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    actor: '',
    action: '',
    entity: '',
    startDate: '',
    endDate: '',
  });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.actor) params.actor = filters.actor;
      if (filters.action) params.action = filters.action;
      if (filters.entity) params.entity_type = filters.entity;
      if (filters.startDate) params.start_date = filters.startDate;
      if (filters.endDate) params.end_date = filters.endDate;
      const data = await getAuditLogs(params);
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    fetchLogs();
  };

  const handleClearFilters = () => {
    setFilters({ actor: '', action: '', entity: '', startDate: '', endDate: '' });
  };

  const handleExport = () => {
    if (!logs.length) return;
    const headers = ['Timestamp', 'Actor', 'Action', 'Entity', 'Entity ID', 'IP Address'];
    const rows = logs.map((log) => [
      log.created_at ? new Date(log.created_at).toISOString() : '',
      log.user_email || 'System',
      log.action,
      log.entity_type,
      log.entity_id || 'N/A',
      log.ip_address || '',
    ]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const uniqueActions = useMemo(() => [...new Set(logs.map((l) => l.action).filter(Boolean))], [logs]);
  const uniqueEntities = useMemo(() => [...new Set(logs.map((l) => l.entity_type).filter(Boolean))], [logs]);

  return (
    <AdminPage
      title="System Audit Trail"
      subtitle="Track all system activities and changes"
      loading={loading}
      error={error}
      onRetry={fetchLogs}
      actions={
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn secondary" onClick={handleExport}>
            Export CSV
          </button>
          <button className="btn primary" onClick={fetchLogs}>
            Refresh
          </button>
        </div>
      }
    >
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="cardHeader">
          <h3 className="cardTitle">Filters</h3>
        </div>
        <div className="cardBody">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <div className="formGroup">
              <label className="label">Actor Email</label>
              <input
                className="inputField"
                type="text"
                value={filters.actor}
                onChange={(e) => handleFilterChange('actor', e.target.value)}
                placeholder="Filter by email..."
              />
            </div>
            <div className="formGroup">
              <label className="label">Action</label>
              <select
                className="select"
                value={filters.action}
                onChange={(e) => handleFilterChange('action', e.target.value)}
              >
                <option value="">All Actions</option>
                {uniqueActions.map((action) => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
            </div>
            <div className="formGroup">
              <label className="label">Entity</label>
              <select
                className="select"
                value={filters.entity}
                onChange={(e) => handleFilterChange('entity', e.target.value)}
              >
                <option value="">All Entities</option>
                {uniqueEntities.map((entity) => (
                  <option key={entity} value={entity}>{entity}</option>
                ))}
              </select>
            </div>
            <div className="formGroup">
              <label className="label">Start Date</label>
              <input
                className="inputField"
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>
            <div className="formGroup">
              <label className="label">End Date</label>
              <input
                className="inputField"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="btn primary" onClick={handleApplyFilters}>Apply Filters</button>
            <button className="btn secondary" onClick={handleClearFilters}>Clear</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Audit Logs ({logs.length})</h3>
        </div>
        <div className="cardBody">
          {logs.length === 0 ? (
            <div className="emptyState">
              <h3>No audit logs found</h3>
              <p>Logs will appear here once system activities are recorded.</p>
            </div>
          ) : (
            <div className="overflowAuto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Actor</th>
                    <th>Action</th>
                    <th>Entity</th>
                    <th>Entity ID</th>
                    <th>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td className="textSecondary">
                        {log.created_at ? new Date(log.created_at).toLocaleString() : '-'}
                      </td>
                      <td className="textPrimary" style={{ fontWeight: 500 }}>
                        {log.user_email || 'System'}
                      </td>
                      <td>
                        <span className="statusTag info">{log.action || 'N/A'}</span>
                      </td>
                      <td className="textSecondary">{log.entity_type || '-'}</td>
                      <td className="textSecondary">{log.entity_id || 'N/A'}</td>
                      <td className="textMuted">{log.ip_address || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
