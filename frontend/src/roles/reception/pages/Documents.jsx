import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function ReceptionDocuments() {
  const [documents, setDocuments] = useState([
    { id: '1', title: 'Student Admission & Enrollment Form (Printable)', category: 'ADMISSIONS', format: 'PDF', size: '2.4 MB', updated_at: '2026-08-15', downloads: 142 },
    { id: '2', title: 'Standard Campus Visitor Pass Slip Template', category: 'SECURITY', format: 'PDF', size: '420 KB', updated_at: '2026-09-01', downloads: 890 },
    { id: '3', title: 'College Intern Non-Disclosure & IP Agreement (NDA)', category: 'LEGAL', format: 'DOCX', size: '1.1 MB', updated_at: '2026-07-20', downloads: 65 },
    { id: '4', title: '2026 Comprehensive Course Catalog & Fee Schedule', category: 'MARKETING', format: 'PDF', size: '8.5 MB', updated_at: '2026-09-05', downloads: 320 },
    { id: '5', title: 'Front Desk Incident & Lost-and-Found Register Form', category: 'OPERATIONS', format: 'PDF', size: '650 KB', updated_at: '2026-06-10', downloads: 38 },
    { id: '6', title: 'Parent Guardian Consent & Bus Transport Form', category: 'ADMISSIONS', format: 'PDF', size: '920 KB', updated_at: '2026-08-28', downloads: 95 }
  ]);

  const [categoryFilter, setCategoryFilter] = useState('');
  const [search, setSearch] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [newDoc, setNewDoc] = useState({
    title: '',
    category: 'ADMISSIONS',
    format: 'PDF',
    size: '1.5 MB'
  });

  const handleUpload = (e) => {
    e.preventDefault();
    setDocuments([
      { id: String(Date.now()), ...newDoc, updated_at: 'Today', downloads: 0 },
      ...documents
    ]);
    setShowUploadModal(false);
    setNewDoc({ title: '', category: 'ADMISSIONS', format: 'PDF', size: '1.5 MB' });
  };

  const filtered = documents.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = d.title.toLowerCase().includes(q);
    const matchCat = categoryFilter ? d.category === categoryFilter : true;
    return matchSearch && matchCat;
  });

  return (
    <AdminPage
      title="Front Desk Document Vault & Forms"
      subtitle="Standard printable admission forms, campus NDA slips, syllabus brochures, and security pass templates"
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2 shadow-sm" onClick={() => setShowUploadModal(true)}>
          <i className="bi bi-cloud-arrow-up-fill"></i>
          <span>Upload Form / Document</span>
        </button>
      }
    >
      {/* Category Pills & Search */}
      <div className="card border-0 shadow-sm rounded-3 p-3 mb-2 bg-white">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-7">
            <div className="input-group">
              <span className="input-group-text bg-light border-0"><i className="bi bi-search text-muted"></i></span>
              <input
                type="text"
                className="form-control bg-light border-0"
                placeholder="Search forms, guidelines, syllabus brochures..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12 col-md-5">
            <select
              className="form-select bg-light border-0"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="ADMISSIONS">Admissions & Enrollment</option>
              <option value="SECURITY">Campus Security & Passes</option>
              <option value="LEGAL">Legal & Intern Agreements</option>
              <option value="MARKETING">Brochures & Syllabus</option>
              <option value="OPERATIONS">Operations & Front Desk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="row g-3">
        {filtered.map(doc => (
          <div className="col-12 col-md-6 col-lg-4" key={doc.id}>
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 d-flex flex-column justify-content-between hover-shadow transition">
              <div>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1">
                    {doc.category}
                  </span>
                  <span className="badge bg-light text-dark border font-monospace">{doc.format}</span>
                </div>
                <div className="d-flex align-items-start gap-2 mb-2">
                  <i className="bi bi-file-earmark-pdf-fill text-danger fs-3"></i>
                  <div>
                    <h6 className="fw-bold text-dark mb-1">{doc.title}</h6>
                    <small className="text-muted">Updated: {doc.updated_at} &bull; {doc.size}</small>
                  </div>
                </div>
              </div>
              <div className="border-top pt-2 mt-3 d-flex align-items-center justify-content-between">
                <small className="text-muted"><i className="bi bi-download me-1"></i>{doc.downloads} downloads</small>
                <div className="d-flex gap-1">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => alert(`Printing document: ${doc.title}`)}
                    title="Quick Print"
                  >
                    <i className="bi bi-printer"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => alert(`Downloading: ${doc.title}`)}
                    title="Download File"
                  >
                    <i className="bi bi-download me-1"></i>Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Upload New Document / Form</h5>
                <button type="button" className="btn-close" onClick={() => setShowUploadModal(false)}></button>
              </div>
              <form onSubmit={handleUpload}>
                <div className="modal-body p-3">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Document Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={newDoc.title}
                        onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                        placeholder="e.g. 2026 Scholarship Application Form"
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Category</label>
                      <select
                        className="form-select"
                        value={newDoc.category}
                        onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                      >
                        <option value="ADMISSIONS">Admissions</option>
                        <option value="SECURITY">Campus Security</option>
                        <option value="LEGAL">Legal / NDA</option>
                        <option value="MARKETING">Brochure</option>
                        <option value="OPERATIONS">Operations</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">File Format</label>
                      <select
                        className="form-select"
                        value={newDoc.format}
                        onChange={(e) => setNewDoc({ ...newDoc, format: e.target.value })}
                      >
                        <option value="PDF">PDF</option>
                        <option value="DOCX">DOCX</option>
                        <option value="XLSX">XLSX</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Select File</label>
                      <input type="file" className="form-control" />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top bg-light">
                  <button type="button" className="btn btn-light" onClick={() => setShowUploadModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">Upload File</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
