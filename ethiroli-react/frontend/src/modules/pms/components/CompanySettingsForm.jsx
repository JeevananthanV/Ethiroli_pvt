import React, { useState } from 'react';

const emptyForm = {
  companyName: '',
  legalName: '',
  gstin: '',
  pan: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  branch: '',
  invoiceLogo: '',
  invoicePrefix: 'INV',
};

export default function CompanySettingsForm({ initialData = {}, onSave, onCancel, saving = false }) {
  const [form, setForm] = useState(() => ({ ...emptyForm, ...initialData }));
  const [formError, setFormError] = useState(null);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setFormError(null);
  };

  const validate = () => {
    if (!form.companyName.trim()) return 'Company name is required.';
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {formError && (
        <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.2)', color: 'var(--admin-danger)', fontSize: 13, marginBottom: 4 }}>
          {formError}
        </div>
      )}

      <h4 style={{ color: 'var(--admin-text-secondary)', fontWeight: 600, marginBottom: 12, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
        Company Profile
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="formGroup">
          <label className="label">Company Name <span className="required">*</span></label>
          <input className="inputField" value={form.companyName} onChange={handleChange('companyName')} placeholder="Acme Corp" required />
        </div>
        <div className="formGroup">
          <label className="label">Legal Name</label>
          <input className="inputField" value={form.legalName} onChange={handleChange('legalName')} placeholder="Acme Corporation Pvt Ltd" />
        </div>
        <div className="formGroup">
          <label className="label">GSTIN</label>
          <input className="inputField" value={form.gstin} onChange={handleChange('gstin')} placeholder="22AAAAA0000A1Z5" />
        </div>
        <div className="formGroup">
          <label className="label">PAN</label>
          <input className="inputField" value={form.pan} onChange={handleChange('pan')} placeholder="AAAAA0000A" />
        </div>
        <div className="formGroup">
          <label className="label">Email</label>
          <input className="inputField" type="email" value={form.email} onChange={handleChange('email')} placeholder="billing@acme.com" />
        </div>
        <div className="formGroup">
          <label className="label">Phone</label>
          <input className="inputField" value={form.phone} onChange={handleChange('phone')} placeholder="+91 98765 43210" />
        </div>
        <div className="formGroup" style={{ gridColumn: '1 / -1' }}>
          <label className="label">Address</label>
          <input className="inputField" value={form.address} onChange={handleChange('address')} placeholder="Street address" />
        </div>
        <div className="formGroup">
          <label className="label">City</label>
          <input className="inputField" value={form.city} onChange={handleChange('city')} />
        </div>
        <div className="formGroup">
          <label className="label">State</label>
          <input className="inputField" value={form.state} onChange={handleChange('state')} />
        </div>
        <div className="formGroup">
          <label className="label">Pincode</label>
          <input className="inputField" value={form.pincode} onChange={handleChange('pincode')} />
        </div>
      </div>

      <h4 style={{ color: 'var(--admin-text-secondary)', fontWeight: 600, margin: '24px 0 12px', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
        Bank Details
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="formGroup">
          <label className="label">Bank Name</label>
          <input className="inputField" value={form.bankName} onChange={handleChange('bankName')} placeholder="HDFC Bank" />
        </div>
        <div className="formGroup">
          <label className="label">Account Number</label>
          <input className="inputField" value={form.accountNumber} onChange={handleChange('accountNumber')} placeholder="50100012345678" />
        </div>
        <div className="formGroup">
          <label className="label">IFSC Code</label>
          <input className="inputField" value={form.ifscCode} onChange={handleChange('ifscCode')} placeholder="HDFC0001234" />
        </div>
        <div className="formGroup">
          <label className="label">Branch</label>
          <input className="inputField" value={form.branch} onChange={handleChange('branch')} placeholder="Chennai Main" />
        </div>
      </div>

      <h4 style={{ color: 'var(--admin-text-secondary)', fontWeight: 600, margin: '24px 0 12px', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
        Invoice Branding
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="formGroup">
          <label className="label">Invoice Prefix</label>
          <input className="inputField" value={form.invoicePrefix} onChange={handleChange('invoicePrefix')} placeholder="INV" />
        </div>
        <div className="formGroup">
          <label className="label">Invoice Logo URL</label>
          <input className="inputField" value={form.invoiceLogo} onChange={handleChange('invoiceLogo')} placeholder="https://..." />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button type="submit" className="btn primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        {onCancel && (
          <button type="button" className="btn secondary" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}
