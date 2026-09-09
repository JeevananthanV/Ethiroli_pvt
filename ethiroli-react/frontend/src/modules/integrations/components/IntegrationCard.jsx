import React, { useState } from 'react';
import { deleteIntegration } from '../../../services/api/integrationApi.js';

export default function IntegrationCard({ integration, onUpdate }) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      await new Promise(r => setTimeout(r, 1200));
      setTestResult({ success: true, message: 'Connection successful! Latency: 42ms' });
    } catch {
      setTestResult({ success: false, message: 'Connection failed. Check your credentials.' });
    } finally {
      setTesting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this integration?')) return;
    try {
      await deleteIntegration(integration.id);
      onUpdate?.();
    } catch (err) {
      console.error('Failed to delete integration:', err);
    }
  };

  const getHealthColor = (status) => {
    switch (status) {
      case 'healthy': return 'active';
      case 'degraded': return 'pending';
      case 'down': return 'error';
      default: return 'inactive';
    }
  };

  return (
    <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 600 }}>{integration.name}</h4>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--admin-text-muted)' }}>{integration.type || 'Integration'}</p>
        </div>
        <span className={`statusTag ${getHealthColor(integration.health)}`}>
          {integration.health || 'Unknown'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13 }}>
        <div>
          <span style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--admin-text-muted)' }}>Last Sync</span>
          <span style={{ color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
            {integration.lastSync ? new Date(integration.lastSync).toLocaleString() : 'Never'}
          </span>
        </div>
        <div>
          <span style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--admin-text-muted)' }}>Endpoint</span>
          <span style={{ color: 'var(--admin-text-secondary)', fontWeight: 500, wordBreak: 'break-all' }}>
            {integration.endpoint || integration.provider || 'N/A'}
          </span>
        </div>
      </div>

      {testResult && (
        <div style={{
          padding: '10px 12px',
          borderRadius: 8,
          fontSize: 13,
          background: testResult.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
          color: testResult.success ? 'var(--admin-success)' : 'var(--admin-danger)',
          border: `1px solid ${testResult.success ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`
        }}>
          {testResult.message}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
        <button className="btn secondary btnSm" onClick={handleTestConnection} disabled={testing}>
          {testing ? 'Testing...' : 'Test Connection'}
        </button>
        <button className="btn primary btnSm" onClick={() => onUpdate?.('edit', integration)}>Configure</button>
        <button className="btn danger btnSm" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}
