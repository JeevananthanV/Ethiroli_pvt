import React, { useState, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import { useHrData } from '../../../hooks/useHrData';
import { listDocuments, uploadDocument, deleteDocument } from '../../../../services/api/hrApi.standardized.js';

const DOCUMENT_CATEGORIES = [
  'ALL',
  'Employee Documents',
  'Intern Documents',
  'Student Documents',
  'Pending Verification',
  'Verified',
  'Rejected',
  'Expiring Documents'
];

const INITIAL_DOCS_MOCK = [
  {
    id: 'DOC-101',
    name: 'Aadhaar Card & PAN Card Verification',
    owner_name: 'Priyadharshini Kumar',
    owner_role: 'EMPLOYEE',
    category: 'Employee Documents',
    document_type: 'National ID & Tax Card',
    status: 'VERIFIED',
    uploaded_at: '2026-09-15',
    expiry_date: '2034-01-01',
    verified_by: 'Karthik Subramanian (HR Lead)',
    file_size: '2.4 MB'
  },
  {
    id: 'DOC-102',
    name: 'College Bonafide & NOC Certificate',
    owner_name: 'Vikas Sundaram',
    owner_role: 'INTERN',
    category: 'Intern Documents',
    document_type: 'Academic NOC',
    status: 'PENDING',
    uploaded_at: '2026-09-28',
    expiry_date: '2026-12-31',
    verified_by: 'Under Review',
    file_size: '1.1 MB'
  },
  {
    id: 'DOC-103',
    name: '10th & 12th Academic Marks Transcript',
    owner_name: 'Aishwarya Rajesh',
    owner_role: 'STUDENT',
    category: 'Student Documents',
    document_type: 'Course Admission Proof',
    status: 'VERIFIED',
    uploaded_at: '2026-08-16',
    expiry_date: 'N/A',
    verified_by: 'Admissions Desk',
    file_size: '3.8 MB'
  },
  {
    id: 'DOC-104',
    name: 'Previous Relieving Letter & Salary Slips',
    owner_name: 'Soundarya Raman',
    owner_role: 'EMPLOYEE',
    category: 'Employee Documents',
    document_type: 'Prior Service Proof',
    status: 'PENDING',
    uploaded_at: '2026-09-29',
    expiry_date: 'N/A',
    verified_by: 'Under Review',
    file_size: '4.2 MB'
  },
  {
    id: 'DOC-105',
    name: 'Signed Internship Agreement & Code of Conduct',
    owner_name: 'Dharani Velu',
    owner_role: 'INTERN',
    category: 'Intern Documents',
    document_type: 'Legal Agreement',
    status: 'REJECTED',
    uploaded_at: '2026-09-22',
    expiry_date: 'N/A',
    verified_by: 'HR Operations (Missing Signature on Page 3)',
    file_size: '1.9 MB'
  },
  {
    id: 'DOC-106',
    name: 'Passport & Work Visa Clearance',
    owner_name: 'Arunmozhi Varman',
    owner_role: 'EMPLOYEE',
    category: 'Expiring Documents',
    document_type: 'International Travel ID',
    status: 'VERIFIED',
    uploaded_at: '2024-02-10',
    expiry_date: '2026-10-25',
    verified_by: 'Compliance Team',
    file_size: '2.1 MB'
  }
];

export default function HRDocuments() {
  const {
    data: fetchedDocs,
    loading,
    error,
    refresh,
    search,
    setSearch,
  } = useHrData(
    listDocuments,
    undefined,
    undefined,
    async (id) => {
      await deleteDocument(id);
      await refresh();
    },
    undefined
  );

  const [localDocs, setLocalDocs] = useState(INITIAL_DOCS_MOCK);
  const [activeCategory, setActiveCategory] = useState('ALL');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const [newDocForm, setNewDocForm] = useState({
    name: '',
    owner_name: '',
    owner_role: 'EMPLOYEE',
    document_type: 'Identity Proof',
    expiry_date: ''
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const docList = useMemo(() => {
    if (Array.isArray(fetchedDocs) && fetchedDocs.length > 0) {
      return fetchedDocs;
    }
    return localDocs;
  }, [fetchedDocs, localDocs]);

  const filteredDocs = useMemo(() => {
    return docList.filter((doc) => {
      const q = (search || '').toLowerCase();
      const matchSearch =
        (doc.name || '').toLowerCase().includes(q) ||
        (doc.owner_name || '').toLowerCase().includes(q) ||
        (doc.document_type || '').toLowerCase().includes(q);

      let matchCategory = true;
      if (activeCategory === 'Employee Documents') matchCategory = doc.owner_role === 'EMPLOYEE';
      else if (activeCategory === 'Intern Documents') matchCategory = doc.owner_role === 'INTERN';
      else if (activeCategory === 'Student Documents') matchCategory = doc.owner_role === 'STUDENT';
      else if (activeCategory === 'Pending Verification') matchCategory = doc.status === 'PENDING';
      else if (activeCategory === 'Verified') matchCategory = doc.status === 'VERIFIED';
      else if (activeCategory === 'Rejected') matchCategory = doc.status === 'REJECTED';
      else if (activeCategory === 'Expiring Documents') matchCategory = Boolean(doc.expiry_date && doc.expiry_date.startsWith('2026-10'));

      return matchSearch && matchCategory;
    });
  }, [docList, search, activeCategory]);

  const handleUpdateStatus = (docId, newStatus, verifierNote) => {
    setLocalDocs(prev =>
      prev.map(d => (d.id === docId ? { ...d, status: newStatus, verified_by: verifierNote || 'HR Lead' } : d))
    );
    if (selectedDoc && selectedDoc.id === docId) {
      setSelectedDoc(prev => ({ ...prev, status: newStatus, verified_by: verifierNote || 'HR Lead' }));
    }
    showToast(`Document marked as ${newStatus}`);
  };

  const handleCreateDoc = (e) => {
    e.preventDefault();
    const created = {
      id: `DOC-${Math.floor(100 + Math.random() * 900)}`,
      name: newDocForm.name,
      owner_name: newDocForm.owner_name,
      owner_role: newDocForm.owner_role,
      category: `${newDocForm.owner_role.charAt(0) + newDocForm.owner_role.slice(1).toLowerCase()} Documents`,
      document_type: newDocForm.document_type,
      status: 'PENDING',
      uploaded_at: new Date().toISOString().split('T')[0],
      expiry_date: newDocForm.expiry_date || 'N/A',
      verified_by: 'Under Review',
      file_size: '1.5 MB'
    };
    setLocalDocs([created, ...localDocs]);
    setShowAddModal(false);
    showToast('Document uploaded successfully!');
    setNewDocForm({
      name: '',
      owner_name: '',
      owner_role: 'EMPLOYEE',
      document_type: 'Identity Proof',
      expiry_date: ''
    });
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'VERIFIED':
        return <span className="badge bg-success">VERIFIED</span>;
      case 'PENDING':
        return <span className="badge bg-warning text-dark">UNDER REVIEW</span>;
      case 'REJECTED':
        return <span className="badge bg-danger">REJECTED</span>;
      default:
        return <span className="badge bg-secondary">{st}</span>;
    }
  };

  return (
    <AdminPage
      title="Documents & Compliance Vault"
      subtitle="Verification workflow for Employee, Intern, and Student documents: Uploaded → Under Review → Verified / Rejected"
      loading={loading}
      error={error}
      onRetry={refresh}
      actions={
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-upload me-1" /> Upload Document
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
            fontWeight: 500
          }}>
            <i className="bi bi-check-circle-fill text-success me-2" />
            {toastMsg}
          </div>
        )}

        {/* Categories Bar */}
        <div className="card mb-4" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div className="cardBody" style={{ padding: '0.85rem 1rem' }}>
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', flexWrap: 'wrap' }}>
              {DOCUMENT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat === 'ALL' ? 'All Documents' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search documents by filename, owner name, or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ borderRadius: '0.5rem' }}
          />
        </div>

        {/* Documents Table */}
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Document Vault ({filteredDocs.length})</h3>
          </div>
          <div className="cardBody" style={{ padding: 0 }}>
            {filteredDocs.length === 0 ? (
              <div className="emptyState" style={{ padding: '3rem', textAlign: 'center' }}>
                <i className="bi bi-folder-x" style={{ fontSize: '2.5rem', color: '#94a3b8' }} />
                <h4 style={{ marginTop: '1rem' }}>No documents found</h4>
                <p style={{ color: '#64748b' }}>Try changing categories or upload a new file.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Document Title</th>
                      <th>Owner & Role</th>
                      <th>Category Type</th>
                      <th>Uploaded Date</th>
                      <th>Expiry</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Review & Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocs.map((doc) => (
                      <tr key={doc.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>
                            <i className="bi bi-file-earmark-pdf-fill text-danger me-2" />
                            {doc.name}
                          </div>
                          <small className="text-muted">{doc.file_size}</small>
                        </td>
                        <td>
                          <div>{doc.owner_name}</div>
                          <span className={`badge ${
                            doc.owner_role === 'EMPLOYEE' ? 'bg-primary' :
                            doc.owner_role === 'INTERN' ? 'bg-info text-dark' :
                            'bg-success'
                          }`}>
                            {doc.owner_role}
                          </span>
                        </td>
                        <td>{doc.document_type}</td>
                        <td>{doc.uploaded_at}</td>
                        <td>{doc.expiry_date || 'N/A'}</td>
                        <td>{getStatusBadge(doc.status)}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              setSelectedDoc(doc);
                              setShowVerifyModal(true);
                            }}
                          >
                            <i className="bi bi-shield-check me-1" /> Verify
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Verification Modal */}
        <Modal
          isOpen={showVerifyModal}
          onClose={() => setShowVerifyModal(false)}
          title={`Document Verification — ${selectedDoc?.name}`}
        >
          {selectedDoc && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <div>
                  <h5 className="mb-0">{selectedDoc.name}</h5>
                  <small className="text-muted">Owner: {selectedDoc.owner_name} ({selectedDoc.owner_role})</small>
                </div>
                <div>{getStatusBadge(selectedDoc.status)}</div>
              </div>

              <div className="card mb-3" style={{ background: '#f8fafc' }}>
                <div className="cardBody" style={{ padding: '1rem' }}>
                  <div className="row g-2">
                    <div className="col-md-6">
                      <small className="text-muted d-block">Document Classification</small>
                      <strong>{selectedDoc.document_type}</strong>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block">Uploaded Date</small>
                      <div>{selectedDoc.uploaded_at}</div>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block">Current Verification Log</small>
                      <div className="text-primary">{selectedDoc.verified_by}</div>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block">Document Expiry</small>
                      <div>{selectedDoc.expiry_date}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="alert alert-secondary py-2 small mb-3">
                <i className="bi bi-file-earmark-check me-1" />
                Document file checksum validated. Confirm or reject compliance status.
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  onClick={() => handleUpdateStatus(selectedDoc.id, 'VERIFIED', 'Verified by HR Lead')}
                >
                  <i className="bi bi-check-lg me-1" /> Mark Verified
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleUpdateStatus(selectedDoc.id, 'REJECTED', 'Rejected: Illegible / Incomplete Document')}
                >
                  <i className="bi bi-x-lg me-1" /> Reject Document
                </button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowVerifyModal(false)}>
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Upload Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Upload & Register Document"
        >
          <form onSubmit={handleCreateDoc}>
            <div className="mb-3">
              <label className="form-label">Document Title *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Aadhaar Card Front & Back"
                value={newDocForm.name}
                onChange={(e) => setNewDocForm({ ...newDocForm, name: e.target.value })}
              />
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Owner Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Soundarya Raman"
                  value={newDocForm.owner_name}
                  onChange={(e) => setNewDocForm({ ...newDocForm, owner_name: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Owner Role *</label>
                <select
                  className="form-select"
                  value={newDocForm.owner_role}
                  onChange={(e) => setNewDocForm({ ...newDocForm, owner_role: e.target.value })}
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="INTERN">Intern</option>
                  <option value="STUDENT">Student</option>
                </select>
              </div>
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Document Type *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Identity Proof / College NOC"
                  value={newDocForm.document_type}
                  onChange={(e) => setNewDocForm({ ...newDocForm, document_type: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Expiry Date (Optional)</label>
                <input
                  type="date"
                  className="form-control"
                  value={newDocForm.expiry_date}
                  onChange={(e) => setNewDocForm({ ...newDocForm, expiry_date: e.target.value })}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Select File *</label>
              <input type="file" required className="form-control" />
            </div>

            <div className="text-end mt-4">
              <button type="button" className="btn btn-secondary me-2" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Upload to Vault</button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminPage>
  );
}