import React, { useEffect, useState } from 'react';
import { getIntegrations } from '../../../services/api/integrationApi.js';
import { getProviders, saveProvider } from '../../../services/api/providerApi.js';
import { getTemplates, createTemplate } from '../../../services/api/templateApi.js';

export default function IntegrationList() {
  const [integrations, setIntegrations] = useState([]);
  const [providers, setProviders] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProviderForm, setShowProviderForm] = useState(false);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [newProvider, setNewProvider] = useState({ name: '', type: '', config: '' });
  const [newTemplate, setNewTemplate] = useState({ name: '', subject: '', body: '' });

  const loadData = async () => {
    setLoading(true);
    try {
      const [intRes, provRes, tempRes] = await Promise.all([
        getIntegrations().catch(() => []),
        getProviders().catch(() => []),
        getTemplates().catch(() => []),
      ]);
      setIntegrations(Array.isArray(intRes) ? intRes : []);
      setProviders(Array.isArray(provRes) ? provRes : []);
      setTemplates(Array.isArray(tempRes) ? tempRes : []);
    } catch (err) {
      console.error('Failed to load integrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveProvider = async (e) => {
    e.preventDefault();
    try {
      await saveProvider({ name: newProvider.name, type: newProvider.type, config: newProvider.config });
      setShowProviderForm(false);
      setNewProvider({ name: '', type: '', config: '' });
      loadData();
    } catch (err) {
      console.error('Failed to save provider:', err);
    }
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    try {
      await createTemplate({ name: newTemplate.name, subject: newTemplate.subject, body: newTemplate.body });
      setShowTemplateForm(false);
      setNewTemplate({ name: '', subject: '', body: '' });
      loadData();
    } catch (err) {
      console.error('Failed to create template:', err);
    }
  };

  if (loading) return <div className="loading">Loading integrations...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Integrations & Communication</h2>
          <p className="pageSubtitle">Configure providers, templates, and integrations</p>
        </div>
        <div className="pageActions" style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowProviderForm(true)} className="btn btnPrimary">+ Add Provider</button>
          <button onClick={() => setShowTemplateForm(true)} className="btn">+ New Template</button>
        </div>
      </div>
      <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Integrations ({integrations.length})</h3></div>
          <div className="cardBody">
            {integrations.length === 0 ? (
              <p style={{ color: 'var(--admin-text-secondary)' }}>No integrations configured.</p>
            ) : (
              <table className="table">
                <thead><tr><th>Name</th><th>Type</th><th>Status</th></tr></thead>
                <tbody>
                  {integrations.map((int) => (
                    <tr key={int.id}>
                      <td>{int.name}</td>
                      <td>{int.type}</td>
                      <td><span className="statusTag active">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Communication Providers ({providers.length})</h3></div>
          <div className="cardBody">
            {providers.length === 0 ? (
              <p style={{ color: 'var(--admin-text-secondary)' }}>No providers configured.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                {providers.map((prov) => (
                  <div key={prov.id} className="statCard">
                    <h4>{prov.name}</h4>
                    <p style={{ color: 'var(--admin-text-secondary)', fontSize: '13px' }}>{prov.type}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Message Templates ({templates.length})</h3></div>
          <div className="cardBody">
            {templates.length === 0 ? (
              <p style={{ color: 'var(--admin-text-secondary)' }}>No templates found.</p>
            ) : (
              <table className="table">
                <thead><tr><th>Name</th><th>Subject</th></tr></thead>
                <tbody>
                  {templates.map((t) => (
                    <tr key={t.id}>
                      <td>{t.name}</td>
                      <td>{t.subject}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {showProviderForm && (
        <div className="modalOverlay" onClick={() => setShowProviderForm(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3>Add Provider</h3>
            <form onSubmit={handleSaveProvider}>
              <div className="formGroup">
                <label className="label">Provider Name</label>
                <input className="input" value={newProvider.name} onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })} required />
              </div>
              <div className="formGroup">
                <label className="label">Type</label>
                <input className="input" value={newProvider.type} onChange={(e) => setNewProvider({ ...newProvider, type: e.target.value })} required />
              </div>
              <div className="formGroup">
                <label className="label">Config (JSON)</label>
                <textarea className="textarea" value={newProvider.config} onChange={(e) => setNewProvider({ ...newProvider, config: e.target.value })} required />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowProviderForm(false)} className="btn">Cancel</button>
                <button type="submit" className="btn btnPrimary">Save Provider</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showTemplateForm && (
        <div className="modalOverlay" onClick={() => setShowTemplateForm(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3>New Template</h3>
            <form onSubmit={handleCreateTemplate}>
              <div className="formGroup">
                <label className="label">Template Name</label>
                <input className="input" value={newTemplate.name} onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })} required />
              </div>
              <div className="formGroup">
                <label className="label">Subject</label>
                <input className="input" value={newTemplate.subject} onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })} required />
              </div>
              <div className="formGroup">
                <label className="label">Body</label>
                <textarea className="textarea" value={newTemplate.body} onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })} required />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowTemplateForm(false)} className="btn">Cancel</button>
                <button type="submit" className="btn btnPrimary">Create Template</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
