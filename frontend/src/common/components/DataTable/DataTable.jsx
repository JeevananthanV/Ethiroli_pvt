import React from 'react';

export default function DataTable({ columns, data, loading, error, onRetry, rowKey = 'id' }) {
  if (loading) {
    return (
      <div className="loading">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ marginBottom: 20, borderColor: 'rgba(244, 63, 94, 0.3)', background: 'rgba(244, 63, 94, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ color: 'var(--admin-danger)', fontSize: 20 }}>⚠️</div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, color: 'var(--admin-text-primary)', fontWeight: 500 }}>Failed to load data</p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--admin-text-muted)' }}>{error}</p>
          </div>
          {onRetry && (
            <button onClick={onRetry} className="btn secondary" style={{ padding: '6px 14px', fontSize: 12 }}>
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="emptyState">
        <h3>No records found</h3>
        <p>No data available to display.</p>
      </div>
    );
  }

  return (
    <div className="overflowAuto">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key || col.accessor} style={col.style}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row[rowKey] || row.id}>
              {columns.map((col) => (
                <td key={col.key || col.accessor} className={col.cellClassName || ''} style={col.cellStyle}>
                  {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
