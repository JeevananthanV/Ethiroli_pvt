import React, { useEffect, useState, useCallback } from 'react';
import { getCompanySettings, saveCompanySettings } from '../../../services/api/companySettingApi.js';
import CompanySettingsForm from './CompanySettingsForm.jsx';

export default function CompanySettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCompanySettings();
      setSettings(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load company settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      const saved = await saveCompanySettings(formData);
      setSettings(saved || formData);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const formatField = (label, value) => (
    <div style={{ marginBottom: 14 }}>
      <p style={{ fontSize: 12, color: 'var(--admin-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 14, color: 'var(--admin-text-primary)' }}>{value || '—'}</p>
    </div>
  );

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Company Settings</h1>
          <p className="pageSubtitle">Configure company profile, bank details, GST registry, and invoice branding</p>
        </div>
        <div className="pageActions">
          {!editing && (
            <button className="btn primary" onClick={() => setEditing(true)}>Edit Settings</button>
          )}
        </div>
      </div>

      {error && (
        <div className="card" style={{ marginBottom: 20, borderColor: 'rgba(244, 63, 94, 0.3)', background: 'rgba(244, 63, 94, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--admin-danger)', fontSize: 13 }}>{error}</span>
            <button className="btn secondary btnSm" onClick={fetchSettings}>Retry</button>
          </div>
        </div>
      )}

      <div className="card">
        {loading ? (
          <div className="loading">
            <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }}></div>
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ width: '60%', height: 16, marginBottom: 8 }}></div>
              <div className="skeleton" style={{ width: '40%', height: 12 }}></div>
            </div>
          </div>
        ) : editing ? (
          <CompanySettingsForm
            initialData={settings || {}}
            onSave={handleSave}
            onCancel={() => setEditing(false)}
            saving={saving}
          />
        ) : settings ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
              {formatField('Company Name', settings.companyName)}
              {formatField('Legal Name', settings.legalName)}
              {formatField('GSTIN', settings.gstin)}
              {formatField('PAN', settings.pan)}
              {formatField('Email', settings.email)}
              {formatField('Phone', settings.phone)}
              {formatField('Address', settings.address)}
              {formatField('City / State', [settings.city, settings.state].filter(Boolean).join(', '))}
              {formatField('Pincode', settings.pincode)}
              {formatField('Bank Name', settings.bankName)}
              {formatField('Account Number', settings.accountNumber)}
              {formatField('IFSC Code', settings.ifscCode)}
              {formatField('Branch', settings.branch)}
              {formatField('Invoice Prefix', settings.invoicePrefix)}
            </div>
            {settings.invoiceLogo && (
              <div style={{ marginTop: 20 }}>
                <p style={{ fontSize: 12, color: 'var(--admin-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 8 }}>Invoice Logo</p>
                <img src={settings.invoiceLogo} alt="Invoice Logo" style={{ maxHeight: 80, borderRadius: 8, border: '1px solid var(--admin-border-subtle)' }} />
              </div>
            )}
          </div>
        ) : (
          <div className="emptyState">
            <h3>No Settings Found</h3>
            <p>Click "Edit Settings" to configure your company profile.</p>
          </div>
        )}
      </div>
    </div>
  );
}
