import React, { useState } from 'react';
import { resolveError } from '../../../../services/api/monitoringApi.js';

export default function ResolutionForm({ error, onClose, onSuccess }) {
  const [resolution, setResolution] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await resolveError(error.id, { resolution });
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error('Failed to resolve error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h3>Resolve Error</h3>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="label">Error ID</label>
            <input className="input" value={error?.id || ''} disabled />
          </div>
          <div className="formGroup">
            <label className="label">Resolution Notes</label>
            <textarea className="textarea" value={resolution} onChange={(e) => setResolution(e.target.value)} required rows={4} />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn">Cancel</button>
            <button type="submit" className="btn btnPrimary" disabled={submitting}>
              {submitting ? 'Resolving...' : 'Mark Resolved'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
