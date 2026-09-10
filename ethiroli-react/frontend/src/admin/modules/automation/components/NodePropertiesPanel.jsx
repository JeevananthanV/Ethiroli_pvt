import React, { useState } from 'react';

export default function NodePropertiesPanel({ node, onClose }) {
  const [properties, setProperties] = useState(node?.properties || {});

  const handleChange = (key, value) => {
    setProperties((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="card" style={{ minWidth: '300px' }}>
      <div className="cardHeader">
        <h3 className="cardTitle">Node Properties</h3>
        {onClose && <button onClick={onClose} className="btn" style={{ padding: '4px 8px' }}>Close</button>}
      </div>
      <div className="cardBody">
        {!node ? (
          <p style={{ color: 'var(--admin-text-secondary)' }}>Select a node to view properties.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="formGroup">
              <label className="label">Node ID</label>
              <input className="input" value={node.id || ''} disabled />
            </div>
            <div className="formGroup">
              <label className="label">Label</label>
              <input className="input" value={properties.label || ''} onChange={(e) => handleChange('label', e.target.value)} />
            </div>
            <div className="formGroup">
              <label className="label">Type</label>
              <input className="input" value={node.type || ''} disabled />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
