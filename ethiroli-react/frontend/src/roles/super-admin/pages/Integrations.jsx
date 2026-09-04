import React, { useEffect, useState } from 'react';
import { listIntegrations } from '../../../services/api/integrationApi.js';
import { getProviders } from '../../../services/api/providerApi.js';
import { getTemplates } from '../../../services/api/templateApi.js';

const TABS = ['integrations', 'providers', 'templates'];

export default function Integrations() {
  const [tab, setTab] = useState('integrations');
  const [integrations, setIntegrations] = useState([]);
  const [providers, setProviders] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [iRes, pRes, tRes] = await Promise.all([listIntegrations(), getProviders(), getTemplates()]);
      setIntegrations(iRes?.data || iRes || []);
      setProviders(pRes?.data || pRes || []);
      setTemplates(tRes?.data || tRes || []);
    } catch (err) {
      console.error('Failed to load integrations data', err);
      setError('Failed to load integrations, providers, and templates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="loading">Loading integrations...</div>;
  if (error) return <div className="emptyState">{error}</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Platform Third-Party Integrations</h1>
          <p className="pageSubtitle">Manage connected services, communication providers, and message templates.</p>
        </div>
        <div className="pageActions">
          <button className="btn btnSecondary" onClick={fetchData}>Refresh</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {TABS.map(t => (
          <button key={t} className={`btn ${tab === t ? 'btnPrimary' : 'btnSecondary'}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'integrations' && (
        <div style={{ display: 'grid', gap: '16px' }}>
          {integrations.length === 0 && <div className="emptyState">No integrations found.</div>}
          {integrations.map(item => (
            <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
              <div>
                <h3 style={{ margin: 0 }}>{item.name || item.title || 'Integration'}</h3>
                <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', margin: '4px 0 0' }}>{item.description || item.webhookUrl || '-'}</p>
              </div>
              <span className={`statusTag ${item.status === 'active' || item.status === 'connected' ? 'active' : 'pending'}`}>
                {item.status ? item.status.toUpperCase() : 'ACTIVE'}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === 'providers' && (
        <div style={{ display: 'grid', gap: '16px' }}>
          {providers.length === 0 && <div className="emptyState">No providers found.</div>}
          {providers.map(item => (
            <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
              <div>
                <h3 style={{ margin: 0 }}>{item.name || item.title || 'Provider'}</h3>
                <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', margin: '4px 0 0' }}>{item.type || item.providerType || '-'}</p>
              </div>
              <span className={`statusTag ${item.status === 'active' || item.status === 'connected' ? 'active' : 'pending'}`}>
                {item.status ? item.status.toUpperCase() : 'ACTIVE'}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === 'templates' && (
        <div style={{ display: 'grid', gap: '16px' }}>
          {templates.length === 0 && <div className="emptyState">No templates found.</div>}
          {templates.map(item => (
            <div key={item.id} className="card" style={{ padding: '16px' }}>
              <h3 style={{ margin: 0 }}>{item.name || item.title || 'Template'}</h3>
              <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', margin: '8px 0 0' }}>{item.subject || item.content || '-'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
