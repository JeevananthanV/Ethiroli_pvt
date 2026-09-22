import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function FinanceDocuments() {
  const [documents] = useState([
    { id: '1', title: 'GST Registration Certificate (REG-06)', category: 'Tax & Statutory', date: '2026-04-01', size: '1.2 MB', file_type: 'PDF', verified: true },
    { id: '2', title: 'Corporate PAN & TAN Allotment Letter', category: 'Tax & Statutory', date: '2026-04-01', size: '850 KB', file_type: 'PDF', verified: true },
    { id: '3', title: 'Audited Financial Statements FY 2025-26', category: 'Audit & Compliance', date: '2026-06-30', size: '4.8 MB', file_type: 'PDF', verified: true },
    { id: '4', title: 'HDFC Corporate Current Account Statement (August)', category: 'Banking', date: '2026-09-01', size: '2.1 MB', file_type: 'PDF', verified: true },
    { id: '5', title: 'GSTR-3B Filing Acknowledgement (August 2026)', category: 'Tax & Statutory', date: '2026-09-05', size: '450 KB', file_type: 'PDF', verified: true },
    { id: '6', title: 'TDS Challan 281 Payment Receipts (Q1)', category: 'Tax & Statutory', date: '2026-07-07', size: '620 KB', file_type: 'PDF', verified: true }
  ]);

  return (
    <AdminPage
      title="Financial Document Vault"
      subtitle="Encrypted repository for corporate tax certificates, audited financial statements, banking records, and challans"
    >
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h6 className="mb-0 fw-bold">Compliance & Banking Document Registry</h6>
          <button className="btn btn-sm btn-primary" onClick={() => alert('Secure file upload dialog opened.')}>
            <i className="bi bi-cloud-upload me-1"></i>Upload Document
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Document Title</th>
                <th>Category</th>
                <th>Upload / Verification Date</th>
                <th>File Size</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-file-earmark-pdf text-danger fs-5"></i>
                      <span className="fw-semibold text-dark">{doc.title}</span>
                    </div>
                  </td>
                  <td><span className="badge bg-light text-dark border">{doc.category}</span></td>
                  <td>{doc.date}</td>
                  <td><small className="text-muted">{doc.size}</small></td>
                  <td>
                    <span className="badge bg-success bg-opacity-10 text-success">
                      <i className="bi bi-shield-check me-1"></i>Verified
                    </span>
                  </td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => alert(`Viewing ${doc.title}...`)}>
                      View
                    </button>
                    <button className="btn btn-sm btn-light" onClick={() => alert(`Downloading ${doc.title}...`)}>
                      <i className="bi bi-download"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  );
}
