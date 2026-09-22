import React, { useState } from 'react';

export default function Storage() {
  const [datastores, setDatastores] = useState([
    { name: 'Primary MySQL Relational Cluster', type: 'MYSQL_CLUSTER', region: 'ap-south-1 (Mumbai)', capacity: '100 GB', used: '32.4 GB', percentage: 32, status: 'HEALTHY' },
    { name: 'Multi-Tenant Document Store (S3)', type: 'OBJECT_STORAGE', region: 'ap-south-1 (Mumbai)', capacity: '500 GB', used: '184.2 GB', percentage: 37, status: 'HEALTHY' },
    { name: 'Redis Cache & Session Tier', type: 'IN_MEMORY_KV', region: 'ap-south-1 (Mumbai)', capacity: '16 GB', used: '4.8 GB', percentage: 30, status: 'HEALTHY' },
    { name: 'Archival & Cold Storage Glacier', type: 'COLD_STORAGE', region: 'ap-southeast-1 (Singapore)', capacity: '2 TB', used: '640 GB', percentage: 31, status: 'HEALTHY' },
  ]);

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-database text-primary" aria-hidden="true"></i>
            Database & Object Storage Telemetry
          </h2>
          <p className="text-secondary small mb-0">
            Multi-tenant datastore namespaces, cluster replication status, table fragmentation, and bucket quotas.
          </p>
        </div>
        <button className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1">
          <i className="bi bi-arrow-repeat" aria-hidden="true"></i> Run Storage Optimization
        </button>
      </div>

      <div className="row g-4">
        {datastores.map((ds, idx) => (
          <div key={idx} className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-3 p-4 bg-white h-100">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="badge bg-light text-secondary border font-monospace" style={{ fontSize: '0.7rem' }}>
                  {ds.type}
                </span>
                <span className="badge bg-success">{ds.status}</span>
              </div>
              <h6 className="fw-bold text-dark my-2">{ds.name}</h6>
              <small className="text-muted d-block mb-3"><i className="bi bi-geo-alt me-1"></i>{ds.region}</small>

              <div className="mt-auto pt-2">
                <div className="d-flex justify-content-between small mb-1">
                  <span className="text-secondary">Utilization:</span>
                  <span className="fw-bold text-dark">{ds.used} / {ds.capacity}</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div 
                    className={`progress-bar ${ds.percentage > 80 ? 'bg-danger' : ds.percentage > 60 ? 'bg-warning' : 'bg-primary'}`} 
                    style={{ width: `${ds.percentage}%` }}
                  ></div>
                </div>
                <small className="text-muted mt-1 d-block text-end">{ds.percentage}% allocated</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm rounded-3 bg-white p-4 mt-4">
        <h5 className="fw-bold mb-3">Multi-Tenant Namespace Allocation</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Tenant Organization</th>
                <th>Datastore Namespace</th>
                <th>Database Tables</th>
                <th>Document Attachments</th>
                <th>Storage Size</th>
                <th>Health</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-semibold">Apex EduTech Pvt Ltd</td>
                <td><code>tenant_apex_prod</code></td>
                <td>104 tables</td>
                <td>1,420 files</td>
                <td>4.2 GB</td>
                <td><span className="badge bg-success">Optimal</span></td>
              </tr>
              <tr>
                <td className="fw-semibold">Vanguard Global Institute</td>
                <td><code>tenant_vanguard_prod</code></td>
                <td>104 tables</td>
                <td>3,890 files</td>
                <td>12.8 GB</td>
                <td><span className="badge bg-success">Optimal</span></td>
              </tr>
              <tr>
                <td className="fw-semibold">Horizon Creative Labs</td>
                <td><code>tenant_horizon_prod</code></td>
                <td>104 tables</td>
                <td>420 files</td>
                <td>1.1 GB</td>
                <td><span className="badge bg-success">Optimal</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
