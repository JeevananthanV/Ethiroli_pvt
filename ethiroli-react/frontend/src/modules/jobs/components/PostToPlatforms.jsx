import React, { useState } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';

export default function PostToPlatforms() {
  const [jobId, setJobId] = useState('');
  const [platforms, setPlatforms] = useState({ linkedin: false, indeed: false, naukri: false });
  const [status, setStatus] = useState('');

  const submit = (e) => {
    e.preventDefault();
    setStatus('Publishing to: ' + Object.entries(platforms).filter(([, v]) => v).map(([k]) => k).join(', ') || 'none');
  };

  return (
    <AdminPage title="Post to Platforms" subtitle="Distribute job postings">
      <div className="card" style={{ maxWidth: 600 }}>
        <div className="cardHeader"><h3 className="cardTitle">Select Platforms</h3></div>
        <form onSubmit={submit} className="form">
          <div className="formGroup">
            <label className="label">Job ID</label>
            <input className="inputField" value={jobId} onChange={(e) => setJobId(e.target.value)} required />
          </div>
          <div className="formGroup">
            <label className="label">Platforms</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.keys(platforms).map((key) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, textTransform: 'capitalize' }}>
                  <input type="checkbox" checked={platforms[key]} onChange={(e) => setPlatforms({ ...platforms, [key]: e.target.checked })} />
                  {key}
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="btn primary">Publish</button>
          {status && <p className="textSecondary">{status}</p>}
        </form>
      </div>
    </AdminPage>
  );
}
