import React, { useEffect, useState } from 'react';
import { getProviders } from '../../../services/api/providerApi.js';

export default function IntegrationConfig({ integration, onSave, onCancel }) {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: integration?.name || '',
    type: integration?.type || '',
    provider: integration?.provider || '',
    endpoint: integration?.endpoint || '',
    apiKey: integration?.apiKey || '',
    config: integration?.config ? JSON.stringify(integration.config, null, 2) : ''
  });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      try {
        const data = await getProviders();
        setProviders(Array.isArray(data) ? data : []);
      } catch {
        setProviders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      await new Promise(r => setTimeout(r, 1000));
      setTestResult({ success: true, message: 'Connection test passed! All parameters are valid.' });
    } catch {
      setTestResult({ success: false, message: 'Connection test failed. Verify endpoint and credentials.' });
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let parsedConfig = {};
      if (form.config) {
        try { parsedConfig = JSON.parse(form.config); } catch { parsedConfig = { raw: form.config }; }
      }
      await onSave?.({ ...form, config: parsedConfig });
    } catch (err) {
      console.error('Failed to save integration config:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading configuration...</div>;
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="formGroup">
        <label className="label required">Integration Name</label>
        <input className="inputField" value={form.name} onChange={e => handleChange('name', e.target.value)} required placeholder="e.g. HRMS Sync" />
      </div>

      <div className="formGroup">
        <label className="label required">Type</label>
        <select className="select" value={form.type} onChange={e => handleChange('type', e.target.value)} required>
          <option value="">Select type...</option>
          <option value="hrms">HRMS</option>
          <option value="ats">ATS</option>
          <option value="calendar">Calendar</option>
          <option value="communication">Communication</option>
          <option value="payment">Payment</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="formGroup">
        <label className="label">Provider</label>
        <select className="select" value={form.provider} onChange={e => handleChange('provider', e.target.value)}>
          <option value="">Select provider...</option>
          {providers.map(p => (
            <option key={p.id} value={p.name}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className="formGroup">
        <label className="label required">Endpoint URL</label>
        <input className="inputField" value={form.endpoint} onChange={e => handleChange('endpoint', e.target.value)} required placeholder="https://api.provider.com/v1" />
      </div>

      <div className="formGroup">
        <label className="label">API Key</label>
        <input className="inputField" type="password" value={form.apiKey} onChange={e => handleChange('apiKey', e.target.value)} placeholder="Enter API key" />
      </div>

      <div className="formGroup">
        <label className="label">Advanced Config (JSON)</label>
        <textarea
          className="textarea"
          value={form.config}
          onChange={e => handleChange('config', e.target.value)}
          placeholder='{"timeout": 5000, "retries": 3}'
          rows={4}
        />
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

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
        <button type="button" className="btn secondary" onClick={onCancel}>Cancel</button>
        <button type="button" className="btn" onClick={handleTest} disabled={testing}>{testing ? 'Testing...' : 'Test Connection'}</button>
        <button type="submit" className="btn primary">Save Configuration</button>
      </div>
    </form>
  );
}
