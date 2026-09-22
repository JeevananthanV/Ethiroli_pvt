import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function Documents() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [alert, setAlert] = useState({ type: '', text: '' });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadDocType, setUploadDocType] = useState('COLLEGE_NOC');

  const documents = [
    // Internship Documents
    {
      id: 'doc-1',
      title: 'Official Internship Offer Letter & Appointment',
      category: 'INTERNSHIP',
      categoryLabel: 'Internship',
      format: 'PDF',
      size: '1.4 MB',
      updatedAt: 'May 10, 2026',
      status: 'VERIFIED',
      description: 'Official offer letter detailing stipend, terms, duration, and mentor allocation.'
    },
    {
      id: 'doc-2',
      title: 'Signed Non-Disclosure Agreement (NDA) & IP Policy',
      category: 'INTERNSHIP',
      categoryLabel: 'Internship',
      format: 'PDF',
      size: '2.1 MB',
      updatedAt: 'May 12, 2026',
      status: 'VERIFIED',
      description: 'Signed agreement regarding intellectual property, confidentiality, and data safety.'
    },
    {
      id: 'doc-3',
      title: 'Digital Intern ID Badge & Access Pass',
      category: 'INTERNSHIP',
      categoryLabel: 'Internship',
      format: 'PNG',
      size: '640 KB',
      updatedAt: 'May 15, 2026',
      status: 'VERIFIED',
      description: 'Accredited digital badge with QR code for building access and event check-in.'
    },

    // Company Documents
    {
      id: 'doc-4',
      title: 'Ethiroli Engineering Onboarding Handbook',
      category: 'COMPANY',
      categoryLabel: 'Company Policy',
      format: 'PDF',
      size: '3.8 MB',
      updatedAt: 'May 15, 2026',
      status: 'OFFICIAL',
      description: 'Guidelines on Git workflows, monorepo architecture, coding standards, and PR reviews.'
    },
    {
      id: 'doc-5',
      title: 'Employee Code of Conduct & Remote Work Policy',
      category: 'COMPANY',
      categoryLabel: 'Company Policy',
      format: 'PDF',
      size: '1.1 MB',
      updatedAt: 'May 15, 2026',
      status: 'OFFICIAL',
      description: 'Work hour guidelines, communication etiquette, and professional conduct expectations.'
    },
    {
      id: 'doc-6',
      title: 'Information Security & Data Protection Guidelines',
      category: 'COMPANY',
      categoryLabel: 'Company Policy',
      format: 'PDF',
      size: '890 KB',
      updatedAt: 'May 15, 2026',
      status: 'OFFICIAL',
      description: 'Security policies on secrets management, API key rotation, and client confidentiality.'
    },

    // Training Documents
    {
      id: 'doc-7',
      title: '45-Day Full-Stack Web Curriculum Syllabus',
      category: 'TRAINING',
      categoryLabel: 'Training Material',
      format: 'PDF',
      size: '2.5 MB',
      updatedAt: 'May 16, 2026',
      status: 'OFFICIAL',
      description: 'Complete day-by-day learning roadmap, competencies checklist, and grading rubric.'
    },
    {
      id: 'doc-8',
      title: 'Git & Linux Terminal Cheat Sheet',
      category: 'TRAINING',
      categoryLabel: 'Training Material',
      format: 'PDF',
      size: '450 KB',
      updatedAt: 'May 18, 2026',
      status: 'OFFICIAL',
      description: 'Essential commands for interactive rebase, cherry-pick, conflict resolution, and SSH.'
    },
    {
      id: 'doc-9',
      title: 'React 19 & Redux Toolkit Architecture Cheat Sheet',
      category: 'TRAINING',
      categoryLabel: 'Training Material',
      format: 'PDF',
      size: '620 KB',
      updatedAt: 'May 20, 2026',
      status: 'OFFICIAL',
      description: 'Best practices for custom hooks, slice design, async thunks, and performance tuning.'
    },

    // Personal Documents
    {
      id: 'doc-10',
      title: 'College NOC & Internship Permission Letter',
      category: 'PERSONAL',
      categoryLabel: 'Personal Vault',
      format: 'PDF',
      size: '1.2 MB',
      updatedAt: 'May 14, 2026',
      status: 'VERIFIED',
      description: 'Authorized permission from college department head allowing full-time internship.'
    },
    {
      id: 'doc-11',
      title: 'Candidate Resume & Curriculum Vitae',
      category: 'PERSONAL',
      categoryLabel: 'Personal Vault',
      format: 'PDF',
      size: '520 KB',
      updatedAt: 'May 08, 2026',
      status: 'VERIFIED',
      description: 'Latest profile resume submitted during application.'
    },
    {
      id: 'doc-12',
      title: 'Bank Account & Stipend Remittance Details',
      category: 'PERSONAL',
      categoryLabel: 'Personal Vault',
      format: 'PDF',
      size: '340 KB',
      updatedAt: 'May 18, 2026',
      status: 'PENDING_VERIFICATION',
      description: 'Cancelled cheque and IFSC details for monthly stipend transfer.'
    },

    // Performance Documents
    {
      id: 'doc-13',
      title: 'Mid-Term 360° Performance Evaluation Report',
      category: 'PERFORMANCE',
      categoryLabel: 'Performance',
      format: 'PDF',
      size: '780 KB',
      updatedAt: 'Sep 15, 2026',
      status: 'OFFICIAL',
      description: 'Formal scorecards, mentor remarks, and distinction milestone audit.'
    },
    {
      id: 'doc-14',
      title: 'Letter of Recommendation (LOR)',
      category: 'PERFORMANCE',
      categoryLabel: 'Performance',
      format: 'PDF',
      size: '—',
      updatedAt: 'Scheduled June 30, 2026',
      status: 'ELIGIBLE_ON_COMPLETION',
      description: 'Official recommendation letter from Founder & Engineering Director upon graduation.'
    }
  ];

  const filteredDocs = activeCategory === 'ALL'
    ? documents
    : documents.filter((d) => d.category === activeCategory);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="badge bg-success-subtle text-success border border-success-subtle small"><i className="bi bi-patch-check-fill me-1"></i>Verified ✓</span>;
      case 'OFFICIAL':
        return <span className="badge bg-primary-subtle text-primary border border-primary-subtle small"><i className="bi bi-shield-fill-check me-1"></i>Official</span>;
      case 'PENDING_VERIFICATION':
        return <span className="badge bg-warning-subtle text-warning border border-warning-subtle small"><i className="bi bi-hourglass-split me-1"></i>Pending Verification</span>;
      default:
        return <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle small"><i className="bi bi-lock-fill me-1"></i>Eligible upon completion</span>;
    }
  };

  const handleDownload = (doc) => {
    if (doc.status === 'ELIGIBLE_ON_COMPLETION') {
      setAlert({ type: 'info', text: 'This document will become available for download upon successful internship completion.' });
      return;
    }
    setAlert({ type: 'success', text: `Downloading "${doc.title}" (${doc.size})...` });
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    setShowUploadModal(false);
    setAlert({ type: 'success', text: 'Personal document uploaded successfully! Verification takes 24-48 hours.' });
  };

  return (
    <AdminPage
      title="Personal Vault & Document Management"
      subtitle="Access official internship contracts, handbooks, personal records, and performance letters"
    >
      <div className="container-fluid px-0">
        {alert.text && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show mb-4`} role="alert">
            <i className="bi bi-check-circle me-2"></i>{alert.text}
            <button type="button" className="btn-close" onClick={() => setAlert({ type: '', text: '' })}></button>
          </div>
        )}

        {/* Vault Categories & Upload Action */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div className="d-flex gap-2 flex-wrap">
            <button
              type="button"
              className={`btn btn-sm ${activeCategory === 'ALL' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveCategory('ALL')}
            >
              All Documents ({documents.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeCategory === 'INTERNSHIP' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveCategory('INTERNSHIP')}
            >
              📁 Internship Docs
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeCategory === 'COMPANY' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveCategory('COMPANY')}
            >
              📁 Company Policies
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeCategory === 'TRAINING' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveCategory('TRAINING')}
            >
              📁 Training Guides
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeCategory === 'PERSONAL' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveCategory('PERSONAL')}
            >
              📁 Personal Vault
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeCategory === 'PERFORMANCE' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveCategory('PERFORMANCE')}
            >
              📁 Performance
            </button>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1 shadow-sm"
            onClick={() => setShowUploadModal(true)}
          >
            <i className="bi bi-cloud-arrow-up-fill"></i> Upload Personal Document
          </button>
        </div>

        {/* Documents Grid */}
        <div className="row g-4">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="col-md-6 col-lg-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-light text-secondary border small">{doc.categoryLabel}</span>
                    {getStatusBadge(doc.status)}
                  </div>

                  <h6 className="fw-bold mb-2 text-dark">{doc.title}</h6>
                  <p className="text-muted small mb-3 flex-grow-1">{doc.description}</p>

                  <div className="d-flex justify-content-between align-items-center text-muted small border-top pt-2 mb-3">
                    <span><i className="bi bi-file-earmark-pdf me-1"></i>{doc.format} • {doc.size}</span>
                    <span>Updated: {doc.updatedAt}</span>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm flex-grow-1"
                      onClick={() => handleDownload(doc)}
                      disabled={doc.status === 'ELIGIBLE_ON_COMPLETION'}
                    >
                      <i className="bi bi-eye me-1"></i> View
                    </button>
                    <button
                      className="btn btn-primary btn-sm flex-grow-1"
                      onClick={() => handleDownload(doc)}
                      disabled={doc.status === 'ELIGIBLE_ON_COMPLETION'}
                    >
                      <i className="bi bi-download me-1"></i> Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Personal Document Modal */}
        {showUploadModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Upload to Personal Vault</h5>
                  <button type="button" className="btn-close" onClick={() => setShowUploadModal(false)}></button>
                </div>
                <form onSubmit={handleUploadSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Document Type</label>
                      <select
                        className="form-select"
                        value={uploadDocType}
                        onChange={(e) => setUploadDocType(e.target.value)}
                      >
                        <option value="COLLEGE_NOC">College NOC / Permission Letter</option>
                        <option value="RESUME">Updated Resume / CV</option>
                        <option value="GOVT_ID">Government ID (Aadhaar / Passport)</option>
                        <option value="BANK_DETAILS">Bank Details / Cancelled Cheque</option>
                        <option value="DEGREE_PROVISIONAL">Academic Marksheet / Degree</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Select File (PDF, PNG, JPG - Max 5MB)</label>
                      <input type="file" className="form-control" accept=".pdf,.png,.jpg,.jpeg" required />
                    </div>

                    <div className="p-3 bg-light rounded-3 border small text-muted">
                      <i className="bi bi-shield-lock-fill text-primary me-1"></i>
                      All documents are encrypted with AES-256 and accessible only by authorized HR & Mentorship coordinators.
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-light btn-sm" onClick={() => setShowUploadModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Upload & Submit for Verification
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPage>
  );
}
