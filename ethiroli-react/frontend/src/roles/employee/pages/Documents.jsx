import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import employeePortalApi from '../../../services/api/employeePortalApi.js';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    document_type: 'ID_PROOF',
    file_url: '',
  });

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await employeePortalApi.getPersonalDocuments();
      const list = res?.data || (Array.isArray(res) ? res : []);
      setDocuments(list);
    } catch (err) {
      setError(err.message || 'Failed to load personal documents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await employeePortalApi.uploadPersonalDocument(formData);
      setShowModal(false);
      setFormData({ title: '', document_type: 'ID_PROOF', file_url: '' });
      await loadDocuments();
    } catch (err) {
      setError(err.message || 'Failed to submit document');
    } finally {
      setSubmitting(false);
    }
  };

  const getDocBadge = (type) => {
    return <span className="badge bg-light text-dark border">{type?.replace('_', ' ')}</span>;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="badge bg-success">Verified</span>;
      case 'REJECTED':
        return <span className="badge bg-danger">Rejected</span>;
      default:
        return <span className="badge bg-warning text-dark">Pending Verification</span>;
    }
  };

  return (
    <AdminPage
      title="My Documents Vault"
      subtitle="Manage your identity credentials, contract agreements, and compliance records"
      loading={loading}
      error={error}
      onRetry={loadDocuments}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="mb-0 fw-bold">Verified Employee Records</h5>
          <small className="text-muted">All uploaded documents are encrypted and reviewed by HR</small>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <i className="bi bi-cloud-arrow-up"></i>
          <span>Upload Document</span>
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-muted small text-uppercase">
              <tr>
                <th>Document Title</th>
                <th>Category</th>
                <th>Upload Date</th>
                <th>Verification</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    <div className="rounded-circle bg-light d-inline-flex p-3 mb-2">
                      <i className="bi bi-folder2-open fs-2"></i>
                    </div>
                    <div>No documents uploaded yet. Upload your ID proofs or certifications.</div>
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-file-earmark-pdf text-danger fs-5"></i>
                        <span className="fw-semibold text-dark">{doc.title}</span>
                      </div>
                    </td>
                    <td>{getDocBadge(doc.document_type)}</td>
                    <td className="text-muted small">
                      {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Recent'}
                    </td>
                    <td>{getStatusBadge(doc.status)}</td>
                    <td className="text-end">
                      {doc.file_url && (
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
                        >
                          <i className="bi bi-download"></i>
                          <span>View</span>
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Upload Personal Document</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Document Title</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Aadhaar Card / Degree Certificate"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Document Category</label>
                    <select
                      className="form-select"
                      value={formData.document_type}
                      onChange={(e) => setFormData({ ...formData, document_type: e.target.value })}
                    >
                      <option value="ID_PROOF">ID Proof / Passport / Aadhaar</option>
                      <option value="DEGREE_CERTIFICATE">Degree / Educational Certificate</option>
                      <option value="RESUME">Resume / CV</option>
                      <option value="OFFER_LETTER">Offer Letter</option>
                      <option value="NDA">Non-Disclosure Agreement (NDA)</option>
                      <option value="EXPERIENCE_LETTER">Experience Letter</option>
                      <option value="OTHER">Other Official Document</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">File / Storage URL</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://storage.cloud.google.com/documents/..."
                      required
                      value={formData.file_url}
                      onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                    />
                    <small className="text-muted">Direct secured cloud link to the file</small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Uploading...' : 'Upload & Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
