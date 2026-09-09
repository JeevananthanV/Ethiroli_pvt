import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getTenant, updateTenant } from '../../services/api/tenantApi.js';

export default function WhiteLabelConfig() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(false);

  const [form, setForm] = useState({
    name: '',
    domain: '',
    primary_color: '#3b82f6',
    secondary_color: '#8b5cf6',
    logo_url: '',
    favicon_url: '',
    custom_css: '',
    email_sender_name: '',
    support_email: '',
  });

  const loadTenant = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTenant('current');
      const tenantData = data || {};
      setForm({
        name: tenantData.name || '',
        domain: tenantData.domain || '',
        primary_color: tenantData.primary_color || '#3b82f6',
        secondary_color: tenantData.secondary_color || '#8b5cf6',
        logo_url: tenantData.logo_url || '',
        favicon_url: tenantData.favicon_url || '',
        custom_css: tenantData.custom_css || '',
        email_sender_name: tenantData.email_sender_name || '',
        support_email: tenantData.support_email || '',
      });
    } catch (err) {
      setError(err.message || 'Failed to load tenant configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTenant();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateTenant('current', form);
      alert('White-label configuration saved');
    } catch (err) {
      alert(`Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPage
      title="White-Label Configuration"
      subtitle="Branding, colors, and domain settings"
      loading={loading}
      error={error}
      onRetry={loadTenant}
      actions={
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="btn secondary" onClick={() => setPreview(!preview)}>
            {preview ? 'Hide Preview' : 'Preview'}
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="form">
        <div style={{ display: 'grid', gridTemplateColumns: preview ? '1fr 1fr' : '1fr', gap: 20 }}>
          <div>
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="cardHeader"><h3 className="cardTitle">Branding</h3></div>
              <div className="cardBody">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                  <div className="formGroup">
                    <label className="label required">Brand Name</label>
                    <input className="inputField" required name="name" value={form.name} onChange={handleChange} />
                  </div>
                  <div className="formGroup">
                    <label className="label required">Custom Domain</label>
                    <input className="inputField" required name="domain" value={form.domain} onChange={handleChange} placeholder="app.yourdomain.com" />
                  </div>
                  <div className="formGroup">
                    <label className="label">Logo URL</label>
                    <input className="inputField" name="logo_url" value={form.logo_url} onChange={handleChange} placeholder="https://..." />
                  </div>
                  <div className="formGroup">
                    <label className="label">Favicon URL</label>
                    <input className="inputField" name="favicon_url" value={form.favicon_url} onChange={handleChange} placeholder="https://..." />
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
              <div className="cardHeader"><h3 className="cardTitle">Colors</h3></div>
              <div className="cardBody">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                  <div className="formGroup">
                    <label className="label">Primary Color</label>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input type="color" value={form.primary_color} onChange={(e) => handleChange({ target: { name: 'primary_color', value: e.target.value } })} style={{ width: 50, height: 40, padding: 0, border: 'none', cursor: 'pointer' }} />
                      <input className="inputField" name="primary_color" value={form.primary_color} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="formGroup">
                    <label className="label">Secondary Color</label>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input type="color" value={form.secondary_color} onChange={(e) => handleChange({ target: { name: 'secondary_color', value: e.target.value } })} style={{ width: 50, height: 40, padding: 0, border: 'none', cursor: 'pointer' }} />
                      <input className="inputField" name="secondary_color" value={form.secondary_color} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="cardHeader"><h3 className="cardTitle">Communication</h3></div>
              <div className="cardBody">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                  <div className="formGroup">
                    <label className="label">Email Sender Name</label>
                    <input className="inputField" name="email_sender_name" value={form.email_sender_name} onChange={handleChange} />
                  </div>
                  <div className="formGroup">
                    <label className="label">Support Email</label>
                    <input className="inputField" name="support_email" value={form.support_email} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {preview && (
            <div>
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="cardHeader"><h3 className="cardTitle">Preview</h3></div>
                <div className="cardBody">
                  <div style={{
                    border: '1px solid var(--admin-border)',
                    borderRadius: 8,
                    overflow: 'hidden',
                    background: 'var(--admin-bg-dark)'
                  }}>
                    <div style={{ background: form.primary_color, padding: 16, color: '#fff' }}>
                      <div style={{ fontWeight: 700, fontSize: 18 }}>{form.name || 'Your Brand'}</div>
                    </div>
                    <div style={{ padding: 16 }}>
                      <div style={{ width: '100%', height: 120, background: `${form.secondary_color}30`, borderRadius: 6, marginBottom: 12 }}></div>
                      <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, marginBottom: 8, width: '80%' }}></div>
                      <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, marginBottom: 8, width: '60%' }}></div>
                      <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, width: '40%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="cardHeader"><h3 className="cardTitle">Custom CSS</h3></div>
                <div className="cardBody">
                  <div className="formGroup">
                    <label className="label">Custom CSS</label>
                    <textarea
                      className="textarea"
                      name="custom_css"
                      value={form.custom_css}
                      onChange={handleChange}
                      placeholder=".brand-header { background: var(--primary-color); }"
                      rows={6}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </AdminPage>
  );
}
