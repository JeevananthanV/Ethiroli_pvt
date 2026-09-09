import React, { useState } from 'react';
import Button from '../../../common/components/Button/Button.jsx';
import { updateConfigs } from '../../../services/api/systemApi.js';

export default function ConfigForm() {
  const [origins, setOrigins] = useState('["http://localhost:3000", "http://localhost:5173"]');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const parsed = JSON.parse(origins);
      await updateConfigs({ ALLOWED_ORIGINS: parsed });
      alert('Configurations updated successfully!');
    } catch {
      alert('Invalid JSON array format.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Global System Configurations</h2>
          <p className="pageSubtitle">Manage CORS, integrations, and platform settings</p>
        </div>
      </div>

      <div className="card" style={{maxWidth: 700}}>
        <form onSubmit={handleSubmit} className="form">
          <div className="formGroup">
            <label className="label">CORS Allowed Origins (JSON Array)</label>
            <textarea 
              className="textarea"
              value={origins} 
              onChange={(e) => setOrigins(e.target.value)} 
              rows={5}
              placeholder='["http://localhost:3000", "http://localhost:5173"]'
            />
          </div>
          <div className="flex itemsCenter gap-2">
            <Button type="submit" disabled={saving} variant="primary">
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}