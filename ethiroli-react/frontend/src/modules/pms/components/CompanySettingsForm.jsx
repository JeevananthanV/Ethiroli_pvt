import React, { useState, useEffect } from 'react';
import { getCompanySettings, updateCompanySettings } from '../../services/api/companySettingApi';
import Input from '../../common/components/Input/Input.jsx';
import Button from '../../common/components/Button/Button.jsx';

const CompanySettingsForm = ({ onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    taxId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCompanySettings();
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        website: data.website || '',
        taxId: data.taxId || '',
      });
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
      const result = await updateCompanySettings(formData);
      if (onSave) onSave(result);
      alert('Settings saved successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading settings...</div>;

  return (
    <form onSubmit={handleSubmit} className="form">
      {error && <div className="emptyState" style={{ padding: '12px' }}><p className="textDanger">{error}</p></div>}
      <Input
        label="Company Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <Input
        label="Phone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
      <div className="formGroup">
        <label className="label">Address</label>
        <textarea
          className="textarea"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          rows={3}
        />
      </div>
      <Input
        label="Website"
        value={formData.website}
        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
      />
      <Input
        label="Tax ID"
        value={formData.taxId}
        onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
      />
      <div className="pageActions" style={{ marginTop: '16px' }}>
        <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</Button>
      </div>
    </form>
  );
};

export default CompanySettingsForm;
