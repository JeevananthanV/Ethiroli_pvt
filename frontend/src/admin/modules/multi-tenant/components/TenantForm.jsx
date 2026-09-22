import React, { useState } from 'react';
import { createTenant } from '../../../../services/api/tenantApi.js';

export default function TenantForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', domain: '', is_active: true });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createTenant(form);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error('Failed to create tenant:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h3>Create Tenant</h3>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="label">Tenant Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="formGroup">
            <label className="label">Domain</label>
            <input className="input" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} required />
          </div>
          <div className="formGroup" style={{ flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
            <input type="checkbox" id="active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            <label htmlFor="active" className="label">Active</label>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn">Cancel</button>
            <button type="submit" className="btn btnPrimary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
