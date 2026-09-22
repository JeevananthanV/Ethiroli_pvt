import React, { useState } from 'react';

export default function ProviderSettingsForm({ provider, onClose, onSave }) {
  const [config, setConfig] = useState(provider?.config || {});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(config);
    if (onClose) onClose();
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h3>Provider Configuration</h3>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="label">Provider Name</label>
            <input className="input" value={provider?.name || ''} disabled />
          </div>
          <div className="formGroup">
            <label className="label">Configuration (JSON)</label>
            <textarea
              className="textarea"
              value={JSON.stringify(config, null, 2)}
              onChange={(e) => {
                try {
                  setConfig(JSON.parse(e.target.value));
                } catch {
                  console.error('Invalid JSON');
                }
              }}
              rows={6}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn">Cancel</button>
            <button type="submit" className="btn btnPrimary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
