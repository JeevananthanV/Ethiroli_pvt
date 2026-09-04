import React, { useEffect, useState } from 'react';
import { getHealth, updateConfigs } from '../../../services/api/systemApi.js';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [configs, setConfigs] = useState({
    siteName: 'Ethiroli Admin Portal',
    smtpServer: '',
    maintenance: false,
  });

  useEffect(() => {
    const fetchHealth = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getHealth();
        const cfg = data?.data || data || {};
        setConfigs(prev => ({
          ...prev,
          siteName: cfg.siteName || cfg.site_name || prev.siteName,
          smtpServer: cfg.smtpServer || cfg.smtp_server || prev.smtpServer,
          maintenance: !!cfg.maintenance,
        }));
      } catch (err) {
        console.error('Failed to load system health', err);
        setError('Failed to load system configuration.');
      } finally {
        setLoading(false);
      }
    };
    fetchHealth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateConfigs({
        siteName: configs.siteName,
        smtpServer: configs.smtpServer,
        maintenance: configs.maintenance,
      });
      setSuccess('System configurations saved successfully.');
    } catch (err) {
      console.error('Failed to save configs', err);
      setError('Failed to save configurations.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading settings...</div>;

  return (
    <div className="card" style={{ maxWidth: '750px', margin: '0 auto' }}>
      <div className="cardHeader" style={{ borderBottom: '1px solid var(--admin-border-subtle)', paddingBottom: '16px', marginBottom: '24px' }}>
        <h2 className="cardTitle" style={{ fontSize: '20px' }}>System Configurations Settings</h2>
      </div>
      <div className="cardBody">
        {error && <div className="emptyState" style={{ color: 'var(--admin-danger)', marginBottom: '16px' }}>{error}</div>}
        {success && <div className="emptyState" style={{ color: 'var(--admin-success)', marginBottom: '16px' }}>{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="label">Global Application Title</label>
            <input className="input" required value={configs.siteName} onChange={(e) => setConfigs({ ...configs, siteName: e.target.value })} />
          </div>
          <div className="formGroup">
            <label className="label">SMTP Mail Server Host</label>
            <input className="input" value={configs.smtpServer} onChange={(e) => setConfigs({ ...configs, smtpServer: e.target.value })} />
          </div>
          <div className="formGroup" style={{ flexDirection: 'row', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
            <input type="checkbox" id="maint" className="input" checked={configs.maintenance} onChange={(e) => setConfigs({ ...configs, maintenance: e.target.checked })} />
            <label htmlFor="maint" className="label" style={{ cursor: 'pointer' }}>Put application into Scheduled Maintenance Mode</label>
          </div>
          <div style={{ marginTop: '16px' }}>
            <button type="submit" className="btn btnPrimary" disabled={saving}>{saving ? 'Saving...' : 'Save General Configurations'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
