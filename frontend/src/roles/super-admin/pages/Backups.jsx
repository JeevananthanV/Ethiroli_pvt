import React, { useState } from 'react';

export default function Backups() {
  const [backups, setBackups] = useState([
    { id: 'SNP-20260910-DAILY', type: 'FULL_AUTOMATED', size: '14.2 GB', region: 'ap-south-1 -> ap-southeast-1', completedAt: '2026-09-10 02:00 UTC', status: 'VERIFIED' },
    { id: 'SNP-20260909-DAILY', type: 'FULL_AUTOMATED', size: '14.1 GB', region: 'ap-south-1 -> ap-southeast-1', completedAt: '2026-09-09 02:00 UTC', status: 'VERIFIED' },
    { id: 'SNP-20260908-DAILY', type: 'FULL_AUTOMATED', size: '13.9 GB', region: 'ap-south-1 -> ap-southeast-1', completedAt: '2026-09-08 02:00 UTC', status: 'VERIFIED' },
    { id: 'SNP-20260907-MANUAL', type: 'MANUAL_PRE_DEPLOY', size: '13.8 GB', region: 'ap-south-1', completedAt: '2026-09-07 16:30 UTC', status: 'VERIFIED' },
  ]);

  const [triggering, setTriggering] = useState(false);

  const handleManualBackup = () => {
    setTriggering(true);
    setTimeout(() => {
      setBackups(prev => [
        {
          id: `SNP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-MANUAL`,
          type: 'MANUAL_ON_DEMAND',
          size: '14.3 GB',
          region: 'ap-south-1',
          completedAt: 'Just now',
          status: 'VERIFIED',
        },
        ...prev
      ]);
      setTriggering(false);
    }, 1500);
  };

  return (
    <div className="container-fluid p-3 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-cloud-arrow-up text-primary" aria-hidden="true"></i>
            Disaster Recovery & Automated Backups
          </h2>
          <p className="text-secondary small mb-0">
            Cross-region automated database snapshots, point-in-time recovery (PITR), and restore drill simulations.
          </p>
        </div>
        <button 
          onClick={handleManualBackup}
          disabled={triggering}
          className="btn btn-primary btn-sm d-flex align-items-center gap-1"
        >
          <i className={`bi ${triggering ? 'bi-arrow-repeat spin' : 'bi-camera'}`} aria-hidden="true"></i>
          {triggering ? 'Capturing Snapshot...' : 'Trigger Manual Snapshot'}
        </button>
      </div>

      <div className="row g-3 mb-2">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-semibold text-uppercase">Recovery Point Objective (RPO)</span>
            <h3 className="fw-bold text-success my-1">&lt; 5 Minutes</h3>
            <small className="text-muted">Continuous binary logging</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-semibold text-uppercase">Recovery Time Objective (RTO)</span>
            <h3 className="fw-bold text-primary my-1">&lt; 15 Minutes</h3>
            <small className="text-muted">Automated replica promotion</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-semibold text-uppercase">Cross-Region Replication</span>
            <h3 className="fw-bold text-info my-1">Singapore</h3>
            <small className="text-success"><i className="bi bi-check-circle-fill me-1"></i>Active sync</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-semibold text-uppercase">Retention Policy</span>
            <h3 className="fw-bold text-dark my-1">30 Days</h3>
            <small className="text-muted">With 7-year cold archival</small>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 bg-white p-3">
        <h5 className="fw-bold mb-3">Available Snapshots & Verification Drills</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Snapshot Identifier</th>
                <th>Snapshot Type</th>
                <th>Archive Size</th>
                <th>Storage Region</th>
                <th>Timestamp</th>
                <th>Integrity Check</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {backups.map(b => (
                <tr key={b.id}>
                  <td className="fw-bold font-monospace">{b.id}</td>
                  <td>
                    <span className="badge bg-light text-secondary border font-monospace">{b.type}</span>
                  </td>
                  <td className="fw-semibold">{b.size}</td>
                  <td className="small text-muted">{b.region}</td>
                  <td className="small text-muted">{b.completedAt}</td>
                  <td>
                    <span className="badge bg-success"><i className="bi bi-shield-check me-1"></i>{b.status}</span>
                  </td>
                  <td className="text-end">
                    <button className="btn btn-outline-warning btn-sm me-2">Test Restore</button>
                    <button className="btn btn-outline-secondary btn-sm"><i className="bi bi-download"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
