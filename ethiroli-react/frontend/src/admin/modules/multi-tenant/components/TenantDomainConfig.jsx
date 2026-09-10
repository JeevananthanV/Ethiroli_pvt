import React, { useState } from 'react';

export default function TenantDomainConfig({ tenant, onClose, onSave }) {
  const [domain, setDomain] = useState(tenant?.domain || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave({ ...tenant, domain });
    if (onClose) onClose();
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h3>Domain Configuration</h3>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="label">Custom Domain</label>
            <input className="input" value={domain} onChange={(e) => setDomain(e.target.value)} required />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn">Cancel</button>
            <button type="submit" className="btn btnPrimary">Save Domain</button>
          </div>
        </form>
      </div>
    </div>
  );
}
