import React, { useState, useEffect } from 'react';
import { getCompanySettings, updateCompanySettings, uploadCompanyLogo } from '../../services/api/companySettingApi';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import Input from '../../common/components/Input/Input.jsx';
import Button from '../../common/components/Button/Button.jsx';

const CompanySettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCompanySettings();
      setSettings(data);
      if (data.logoUrl) {
        setLogoPreview(data.logoUrl);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateCompanySettings(settings);
      alert('Company settings updated successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const result = await uploadCompanyLogo(file);
      setSettings({ ...settings, logoUrl: result.logoUrl });
      setLogoPreview(result.logoUrl);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Loading company settings...</div>;
  if (error) return <div className="emptyState"><h3>Error</h3><p>{error}</p><button className="btn primary" onClick={loadSettings}>Retry</button></div>;

  return (
    <AdminPage
      title="Company Settings"
      subtitle="Manage company profile and branding"
      loading={loading}
      error={error}
      onRetry={loadSettings}
    >
      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Company Profile</h3>
        </div>
        <div className="cardBody">
          <form onSubmit={handleSubmit}>
            {error && <div className="emptyState" style={{ padding: '12px', marginBottom: '12px' }}><p className="textDanger">{error}</p></div>}
            <div className="formGroup">
              <label className="label">Company Name</label>
              <input
                type="text"
                className="inputField"
                value={settings?.name || ''}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                required
              />
            </div>
            <div className="formGroup" style={{ marginTop: '12px' }}>
              <label className="label">Email</label>
              <input
                type="email"
                className="inputField"
                value={settings?.email || ''}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                required
              />
            </div>
            <div className="formGroup" style={{ marginTop: '12px' }}>
              <label className="label">Phone</label>
              <input
                type="tel"
                className="inputField"
                value={settings?.phone || ''}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              />
            </div>
            <div className="formGroup" style={{ marginTop: '12px' }}>
              <label className="label">Address</label>
              <textarea
                className="textarea"
                value={settings?.address || ''}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                rows={3}
              />
            </div>
            <div className="formGroup" style={{ marginTop: '12px' }}>
              <label className="label">Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                style={{ marginBottom: '8px' }}
              />
              {logoPreview && (
                <img src={logoPreview} alt="Logo" style={{ maxHeight: '100px', borderRadius: '8px' }} />
              )}
            </div>
            <div className="pageActions" style={{ marginTop: '16px' }}>
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</Button>
            </div>
          </form>
        </div>
      </div>
    </AdminPage>
  );
};

export default CompanySettings;
