import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function Documents() {
  const [docs, setDocs] = useState([
    { id: '1', name: 'Enterprise LMS Technical Specification 2026.pdf', category: 'PRODUCT_COLLATERAL', size: '4.8 MB', updated_at: '2026-09-05', downloads: 142 },
    { id: '2', name: 'Master Services Agreement (MSA) Template.docx', category: 'LEGAL_CONTRACT', size: '256 KB', updated_at: '2026-08-20', downloads: 89 },
    { id: '3', name: 'Higher Education Campus Upskilling Case Study.pdf', category: 'CASE_STUDY', size: '2.1 MB', updated_at: '2026-09-01', downloads: 95 },
    { id: '4', name: 'Commercial Price List & Volume Discount Matrix.pdf', category: 'PRICING_SHEET', size: '820 KB', updated_at: '2026-09-08', downloads: 210 },
    { id: '5', name: 'Cloud Infrastructure ISO 27001 Security Whitepaper.pdf', category: 'COMPLIANCE', size: '3.4 MB', updated_at: '2026-07-15', downloads: 64 }
  ]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'PRODUCT_COLLATERAL', size: '1.5 MB' });

  const handleUpload = (e) => {
    e.preventDefault();
    const newDoc = {
      id: String(Date.now()),
      name: form.name,
      category: form.category,
      size: form.size,
      updated_at: new Date().toISOString().slice(0, 10),
      downloads: 0
    };
    setDocs([newDoc, ...docs]);
    setShowModal(false);
    setForm({ name: '', category: 'PRODUCT_COLLATERAL', size: '1.5 MB' });
  };

  const filtered = docs.filter(d => !categoryFilter || d.category === categoryFilter);

  return (
    <AdminPage
      title="Sales Collateral & Commercial Documents"
      subtitle="Enterprise pitch decks, technical whitepapers, contract templates, and authorized commercial pricing sheets"
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <i className="bi bi-cloud-arrow-up-fill"></i>
          <span>Upload Collateral</span>
        </button>
      }
    >
      <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-4">
            <select
              className="form-select"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              <option value="">All Collateral Categories</option>
              <option value="PRODUCT_COLLATERAL">Product Collateral</option>
              <option value="LEGAL_CONTRACT">Legal & Contracts</option>
              <option value="CASE_STUDY">Case Studies</option>
              <option value="PRICING_SHEET">Pricing & Rate Cards</option>
              <option value="COMPLIANCE">Security & Compliance</option>
            </select>
          </div>
          <div className="col-md-8 text-md-end">
            <span className="badge bg-light text-secondary border px-3 py-2">
              {filtered.length} Sales Documents Available
            </span>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {filtered.map(doc => (
          <div key={doc.id} className="col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm rounded-3 p-4 bg-white h-100 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="rounded-3 bg-light p-2 text-primary fs-4 d-flex align-items-center justify-content-center" style={{ width: '44px', height: '44px' }}>
                  <i className="bi bi-file-earmark-pdf"></i>
                </div>
                <span className="badge bg-light text-dark border small">{doc.category.replace('_', ' ')}</span>
              </div>
              <h6 className="fw-bold text-dark mb-2 text-truncate" title={doc.name}>{doc.name}</h6>
              <div className="d-flex justify-content-between text-muted small mb-3">
                <span>{doc.size}</span>
                <span>Updated: {doc.updated_at}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                <small className="text-muted"><i className="bi bi-download me-1"></i>{doc.downloads} downloads</small>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => alert(`Downloading: ${doc.name}`)}
                >
                  <i className="bi bi-download me-1"></i>Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Upload Sales Document</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleUpload}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Document Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Enterprise LMS Campus Pitch Deck 2026.pdf"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Category</label>
                    <select
                      className="form-select"
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                    >
                      <option value="PRODUCT_COLLATERAL">Product Collateral</option>
                      <option value="LEGAL_CONTRACT">Legal Contract</option>
                      <option value="CASE_STUDY">Case Study</option>
                      <option value="PRICING_SHEET">Pricing Sheet</option>
                      <option value="COMPLIANCE">Security & Compliance</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Upload Document</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
