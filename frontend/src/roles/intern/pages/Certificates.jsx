import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { useAuth } from '../../../common/hooks/useAuth.js';

export default function Certificates() {
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [viewState, setViewState] = useState('requirements'); // 'requirements' | 'preview'
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [alert, setAlert] = useState({ type: '', text: '' });

  const certData = {
    certificateNumber: 'ETH-INT-2026-00125',
    title: 'Certificate of Internship Completion & Engineering Distinction',
    track: 'Full Stack Web Development (MERN Stack)',
    issuedTo: user?.name || 'Jeevananthan V',
    issueDate: 'June 30, 2026',
    grade: 'A+ (Distinction • 94.2%)',
    hash: 'e9b84a6c891e3f890b21a8cd34ef19a8bc43d7890123456789abcdef01234567',
    signatory: 'Founder & Engineering Director, Ethiroli Pvt Ltd'
  };

  const checklist = [
    { title: 'Minimum 85% Overall Attendance', value: '94% Present', eligible: true },
    { title: 'Complete 100% Training Modules', value: '68% Completed', eligible: false },
    { title: 'Submit All Daily Work Logs (Min 40 days)', value: '38/42 Submitted', eligible: false },
    { title: 'Deliver Assigned Capstone Deliverables', value: 'In Progress (80%)', eligible: false },
    { title: 'Pass Final 360° Mentor & Directorate Evaluation', value: 'Scheduled Week 6', eligible: false },
    { title: 'Clear All Company Repository Dues & Assets', value: 'Pending Final Week', eligible: false }
  ];

  const eligibleCount = checklist.filter((c) => c.eligible).length;
  const eligibilityPercent = 82; // E.g., overall weighted completion

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setAlert({ type: 'success', text: `Official Certificate PDF (${certData.certificateNumber}.pdf) downloaded successfully!` });
    }, 800);
  };

  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(certData.title)}&organizationName=Ethiroli&issueYear=2026&issueMonth=6&certUrl=${encodeURIComponent('https://ethiroli.net/verify/' + certData.certificateNumber)}`;
    window.open(url, '_blank');
  };

  const handleShareWhatsApp = () => {
    const text = `I just earned my Internship Certificate in ${certData.track} from Ethiroli with Grade ${certData.grade}! Credential ID: ${certData.certificateNumber}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <AdminPage
      title="Accredited Internship Certificates"
      subtitle="Track your graduation eligibility requirements, view cryptographic verification records, and download official credentials"
    >
      <div className="container-fluid px-0">
        {alert.text && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show mb-2`} role="alert">
            <i className="bi bi-check-circle me-2"></i>{alert.text}
            <button type="button" className="btn-close" onClick={() => setAlert({ type: '', text: '' })}></button>
          </div>
        )}

        {/* View State Switch */}
        <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn btn-sm ${viewState === 'requirements' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setViewState('requirements')}
            >
              <i className="bi bi-list-check me-1"></i> Pre-Completion Eligibility ({eligibilityPercent}%)
            </button>
            <button
              type="button"
              className={`btn btn-sm ${viewState === 'preview' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setViewState('preview')}
            >
              <i className="bi bi-award me-1"></i> Credential Display & Certificate Preview
            </button>
          </div>

          <span className="badge bg-light text-primary border small">
            Estimated Graduation: June 30, 2026
          </span>
        </div>

        {/* State 1: Requirements Checklist */}
        {viewState === 'requirements' && (
          <div className="row g-4">
            <div className="col-lg-7">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white py-3 border-0">
                  <h5 className="fw-bold mb-1 text-dark">Certificate Eligibility Requirements</h5>
                  <p className="text-muted small mb-0">
                    All conditions below must be verified by your mentor and the Directorate before certificate issuance.
                  </p>
                </div>
                <div className="card-body p-3 pt-0">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-semibold small text-dark">Overall Progress Toward Certificate</span>
                    <strong className="text-primary">{eligibilityPercent}% Complete</strong>
                  </div>
                  <div className="progress mb-2" style={{ height: '8px' }}>
                    <div
                      className="progress-bar bg-primary"
                      style={{ width: `${eligibilityPercent}%` }}
                    ></div>
                  </div>

                  <div className="list-group list-group-flush border rounded-3 p-2 bg-light">
                    {checklist.map((item, idx) => (
                      <div
                        key={idx}
                        className="list-group-item bg-transparent border-0 px-2 py-3 d-flex align-items-center justify-content-between"
                      >
                        <div className="d-flex align-items-center gap-3">
                          <i
                            className={`bi ${
                              item.eligible ? 'bi-check-circle-fill text-success fs-5' : 'bi-circle text-muted fs-5'
                            }`}
                          ></i>
                          <div>
                            <span className={`fw-medium small d-block ${item.eligible ? 'text-dark' : 'text-muted'}`}>
                              {item.title}
                            </span>
                            <small className="text-muted">{item.value}</small>
                          </div>
                        </div>
                        <span className={`badge small ${item.eligible ? 'bg-success' : 'bg-secondary'}`}>
                          {item.eligible ? 'Satisfied' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white py-3 border-0">
                  <h5 className="fw-bold mb-0 text-dark">Certification Guidelines</h5>
                </div>
                <div className="card-body p-3 pt-0">
                  <div className="p-3 bg-primary-subtle border border-primary-subtle rounded-3 mb-3 small">
                    <strong className="text-primary d-block mb-1">
                      <i className="bi bi-award-fill me-1"></i>Distinction Criteria
                    </strong>
                    Interns who maintain &gt;90% attendance, average &gt;8.5 in weekly mentor evaluations, and deploy an approved Capstone project receive the official <strong>Distinction Honors</strong> annotation on their verifiable credential.
                  </div>

                  <div className="p-3 bg-light rounded-3 border mb-3 small text-muted">
                    <strong className="text-dark d-block mb-1">Cryptographic Ledger Verification:</strong>
                    Every certificate is stamped with a unique SHA-256 hash and verifiable publicly on the Ethiroli verification ledger by future employers.
                  </div>

                  <button
                    className="btn btn-outline-primary w-100 py-2 btn-sm"
                    onClick={() => setViewState('preview')}
                  >
                    <i className="bi bi-eye me-1"></i> Preview Your Graduation Certificate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* State 2: Certificate Display & Preview */}
        {viewState === 'preview' && (
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card shadow-lg border-0 rounded-4 overflow-hidden mb-2">
                {/* Gold Header Stripe */}
                <div className="bg-dark p-3 text-white text-center border-bottom border-warning border-3 d-flex justify-content-between align-items-center px-4">
                  <span className="badge bg-warning text-dark fw-bold">OFFICIAL CREDENTIAL</span>
                  <span className="small text-white-50">ID: {certData.certificateNumber}</span>
                </div>

                <div className="card-body p-3 p-md-5 text-center bg-white">
                  <div className="mb-2">
                    <span className="text-warning display-5">★ ★ ★ ★ ★</span>
                  </div>

                  <p className="text-uppercase tracking-wide text-secondary fw-semibold mb-1 small">
                    Ethiroli Creative & Engineering Academy
                  </p>
                  <h2 className="fw-bold mb-3 text-dark">
                    {certData.title}
                  </h2>

                  <p className="text-muted mb-1 fs-6">This credential is proudly awarded to</p>
                  <h3 className="text-primary fw-bold mb-3 border-bottom d-inline-block pb-2 px-4">
                    {certData.issuedTo}
                  </h3>

                  <p className="text-muted w-75 mx-auto mb-2 small" style={{ lineHeight: 1.8 }}>
                    For successful completion of the intensive 45-day professional engineering internship in{' '}
                    <strong className="text-dark">{certData.track}</strong>. Having demonstrated mastery
                    in modern web engineering, component architectures, relational data systems, and production deliverables with Grade <strong className="text-success">{certData.grade}</strong>.
                  </p>

                  <div className="row g-3 pt-3 border-top w-75 mx-auto justify-content-between text-start small">
                    <div className="col-sm-4">
                      <span className="text-muted d-block">Credential ID:</span>
                      <strong className="text-dark">{certData.certificateNumber}</strong>
                    </div>
                    <div className="col-sm-4 text-sm-center">
                      <span className="text-muted d-block">Issued On:</span>
                      <strong className="text-dark">{certData.issueDate}</strong>
                    </div>
                    <div className="col-sm-4 text-sm-end">
                      <span className="text-muted d-block">Honors:</span>
                      <span className="badge bg-success-subtle text-success">{certData.grade}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons: Download PDF, Verification Page, LinkedIn, WhatsApp */}
                <div className="card-footer bg-light p-3 border-0 d-flex flex-wrap justify-content-center gap-2">
                  <button
                    className="btn btn-primary btn-sm px-3 fw-semibold"
                    onClick={handleDownload}
                    disabled={downloading}
                  >
                    <i className="bi bi-file-earmark-pdf me-1"></i>
                    {downloading ? 'Generating...' : 'Download PDF'}
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm px-3"
                    onClick={() => setShowVerifyModal(true)}
                  >
                    <i className="bi bi-qr-code me-1"></i> View Verification Page
                  </button>
                  <button
                    className="btn btn-outline-primary btn-sm px-3"
                    onClick={handleShareLinkedIn}
                  >
                    <i className="bi bi-linkedin me-1"></i> Add to LinkedIn
                  </button>
                  <button
                    className="btn btn-outline-success btn-sm px-3"
                    onClick={handleShareWhatsApp}
                  >
                    <i className="bi bi-whatsapp me-1"></i> Share on WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Verification Modal */}
        {showVerifyModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Credential Authenticity Ledger</h5>
                  <button type="button" className="btn-close" onClick={() => setShowVerifyModal(false)}></button>
                </div>
                <div className="modal-body text-center p-3">
                  <div className="p-3 bg-light d-inline-block rounded-3 mb-3 border">
                    <i className="bi bi-shield-fill-check fs-1 text-success"></i>
                  </div>
                  <h5 className="fw-bold text-success mb-1">Cryptographically Verified</h5>
                  <p className="text-muted small mb-3">
                    This certificate is registered on the tamper-proof Ethiroli verification ledger.
                  </p>

                  <div className="bg-light p-3 rounded-2 text-start small mb-3 border">
                    <div className="mb-1">
                      <strong className="text-muted">Certificate ID:</strong> {certData.certificateNumber}
                    </div>
                    <div className="mb-1">
                      <strong className="text-muted">Recipient:</strong> {certData.issuedTo}
                    </div>
                    <div className="mb-1">
                      <strong className="text-muted">Track:</strong> {certData.track}
                    </div>
                    <div className="text-truncate">
                      <strong className="text-muted">SHA-256 Hash:</strong>
                      <span className="font-monospace ms-1 text-secondary">{certData.hash}</span>
                    </div>
                  </div>

                  <a
                    href={`https://ethiroli.net/verify/${certData.certificateNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-primary btn-sm"
                  >
                    <i className="bi bi-box-arrow-up-right me-1"></i> Public Ledger Link
                  </a>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowVerifyModal(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPage>
  );
}
