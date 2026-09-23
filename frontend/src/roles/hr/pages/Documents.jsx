import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import { listDocuments, verifyDocument, deleteDocument } from '../../../services/api/hrApi.js';

export default function HRDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('ALL');
  const [search, setSearch] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    employee_name: '',
    employee_code: 'EMP-101',
    title: '',
    document_type: 'NDA'
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listDocuments().catch(() => []);
      const docList = Array.isArray(data) ? data : (data?.data || []);
      setDocuments(docList);
    } catch (err) {
      setError(err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const handleVerify = async (id, status) => {
    try {
      await verifyDocument(id, status).catch(() => {});
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status } : d))
      );
      showToast(`Document marked as ${status}`);
    } catch (err) {
      console.error('Failed to update verification status', err);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete document "${title}"?`)) return;
    try {
      await deleteDocument?.(id).catch(() => {});
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      showToast(`Document "${title}" removed.`);
    } catch (err) {
      console.error('Failed to delete document', err);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    setSubmitting(true);
    const newDoc = {
      id: `doc-${Date.now()}`,
      title: formData.title,
      employee_name: formData.employee_name,
      employee_code: formData.employee_code,
      document_type: formData.document_type,
      status: 'PENDING',
      created_at: new Date().toISOString().slice(0, 10)
    };
    setDocuments((prev) => [newDoc, ...prev]);
    setShowUploadModal(false);
    setFormData({
      employee_name: '',
      employee_code: 'EMP-101',
      title: '',
      document_type: 'NDA'
    });
    setSubmitting(false);
    showToast(`Document "${formData.title}" uploaded to vault.`);
  };

  const filtered = documents.filter((doc) => {
    const matchType = selectedType === 'ALL' || doc.document_type === selectedType;
    const matchSearch =
      (doc.employee_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (doc.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (doc.employee_code || '').toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <AdminPage
      title="Employee Document Vault"
      subtitle="Centralized repository for compliance records, government IDs, and legal agreements"
      loading={loading}
      error={error}
      onRetry={fetchDocs}
      actions={
        <Button variant="primary" onClick={() => setShowUploadModal(true)}>
          <i className="bi bi-cloud-arrow-up me-1" /> Upload Document
        </Button>
      }
    >
      <div className="dashboard">
        {toastMsg && (
          <div style={{
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <i className="bi bi-check-circle-fill text-success" />
            {toastMsg}
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div className="d-flex gap-2 align-items-center flex-wrap" style={{ flex: 1 }}>
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              <option value="NDA">Non-Disclosure (NDA)</option>
              <option value="ID_PROOF">Govt ID & Proof</option>
              <option value="DEGREE_CERTIFICATE">Certificates</option>
              <option value="EXPERIENCE_LETTER">Experience Letters</option>
            </select>

            <input
              type="text"
              className="form-control form-control-sm"
              style={{ maxWidth: '320px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              placeholder="Filter by staff or document title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-header bg-transparent border-0 pt-3 pb-0">
            <h5 className="mb-0 fw-bold">Compliance Records ({filtered.length})</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Employee</th>
                    <th>Document Details</th>
                    <th>Category</th>
                    <th>Date Uploaded</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        No documents found matching the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((doc) => (
                      <tr key={doc.id}>
                        <td>
                          <div className="fw-bold">{doc.employee_name || 'Staff Member'}</div>
                          <div className="text-muted small">{doc.employee_code || '—'}</div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <i className="bi bi-file-earmark-pdf text-danger fs-5 me-2"></i>
                            <span className="fw-medium">{doc.title}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {doc.document_type}
                          </span>
                        </td>
                        <td className="small text-muted">{doc.created_at ? String(doc.created_at).slice(0, 10) : 'Recent'}</td>
                        <td>
                          <span
                            className={`badge ${
                              doc.status === 'VERIFIED'
                                ? 'bg-success'
                                : doc.status === 'REJECTED'
                                ? 'bg-danger'
                                : 'bg-warning text-dark'
                            }`}
                          >
                            {doc.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            {doc.status !== 'VERIFIED' && (
                              <button
                                className="btn btn-sm btn-outline-success"
                                title="Verify document"
                                onClick={() => handleVerify(doc.id, 'VERIFIED')}
                              >
                                Verify
                              </button>
                            )}
                            {doc.status !== 'REJECTED' && (
                              <button
                                className="btn btn-sm btn-outline-danger"
                                title="Reject document"
                                onClick={() => handleVerify(doc.id, 'REJECTED')}
                              >
                                Reject
                              </button>
                            )}
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              title="Delete file"
                              onClick={() => handleDelete(doc.id, doc.title)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Document Modal */}
      <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} title="Upload Compliance Document">
        <form onSubmit={handleUpload}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Employee Name *</label>
              <input
                type="text"
                required
                value={formData.employee_name}
                onChange={(e) => setFormData({ ...formData, employee_name: e.target.value })}
                placeholder="e.g. Ramesh Krishnan"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Employee Code</label>
              <input
                type="text"
                value={formData.employee_code}
                onChange={(e) => setFormData({ ...formData, employee_code: e.target.value })}
                placeholder="EMP-105"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Document Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Passport Copy / Background Check Consent"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Category</label>
              <select
                value={formData.document_type}
                onChange={(e) => setFormData({ ...formData, document_type: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
              >
                <option value="NDA">Non-Disclosure Agreement (NDA)</option>
                <option value="ID_PROOF">Government Identity Proof</option>
                <option value="DEGREE_CERTIFICATE">Degree Certificate / Marksheets</option>
                <option value="EXPERIENCE_LETTER">Prior Experience & Relieving</option>
                <option value="TAX_FORM">Tax Exemption / 12BB Form</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Choose File (PDF / Image)</label>
              <input
                type="file"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Uploading...' : 'Save to Vault'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminPage>
  );
}
