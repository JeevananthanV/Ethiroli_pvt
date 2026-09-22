import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { useAuth } from '../../../common/hooks/useAuth.js';

export default function Certificates() {
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const certData = {
    certificateNumber: 'ETH-2026-INT-0941',
    title: 'Certificate of Internship Completion',
    domain: 'Full-Stack Web Engineering & Branding Automation',
    issuedTo: user?.name || 'Jeevananthan V',
    issueDate: 'September 2026',
    status: 'ISSUED & VERIFIED',
    hash: 'e9b84a6c891e3f890b21a8cd34ef19a8bc43d7890123456789abcdef01234567',
    signatory: 'Founder & Managing Director, Ethiroli Pvt Ltd'
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Certificate PDF (${certData.certificateNumber}.pdf) downloaded successfully!`);
    }, 800);
  };

  return (
    <AdminPage
      title="Internship Certificates"
      subtitle="View, verify authenticity, and download your accredited internship completion credentials"
    >
      <div className="container-fluid px-0">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Certificate Preview Card */}
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden mb-4">
              {/* Gold Header Stripe */}
              <div className="bg-dark p-3 text-white text-center border-bottom border-warning border-3 d-flex justify-content-between align-items-center px-4">
                <span className="badge bg-warning text-dark fw-bold">OFFICIAL CREDENTIAL</span>
                <span className="small text-white-50">ID: {certData.certificateNumber}</span>
              </div>

              <div className="card-body p-4 p-md-5 text-center bg-white">
                <div className="mb-3">
                  <span className="text-warning display-4">★ ★ ★ ★ ★</span>
                </div>

                <p className="text-uppercase tracking-wide text-secondary fw-semibold mb-1">
                  Ethiroli Creative & Engineering Academy
                </p>
                <h1 className="fw-bold mb-3 text-dark display-6">
                  {certData.title}
                </h1>

                <p className="text-muted mb-1 fs-6">This is proudly awarded to</p>
                <h2 className="text-primary fw-bold mb-3 border-bottom d-inline-block pb-2 px-4">
                  {certData.issuedTo}
                </h2>

                <p className="text-muted w-75 mx-auto mb-4" style={{ lineHeight: 1.8 }}>
                  For successful completion of the intensive 12-week professional internship in{' '}
                  <strong className="text-dark">{certData.domain}</strong>. Having demonstrated mastery
                  in modern web engineering, relational data systems, and industry-standard deliverables.
                </p>

                <div className="row g-4 pt-3 border-top w-75 mx-auto justify-content-between text-start small">
                  <div className="col-sm-4">
                    <span className="text-muted d-block">Credential ID:</span>
                    <strong className="text-dark">{certData.certificateNumber}</strong>
                  </div>
                  <div className="col-sm-4 text-sm-center">
                    <span className="text-muted d-block">Issued On:</span>
                    <strong className="text-dark">{certData.issueDate}</strong>
                  </div>
                  <div className="col-sm-4 text-sm-end">
                    <span className="text-muted d-block">Verification Status:</span>
                    <span className="badge bg-success-subtle text-success">{certData.status}</span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="card-footer bg-light p-4 border-0 d-flex flex-column flex-sm-row justify-content-center gap-3">
                <button
                  className="btn btn-primary btn-lg px-4 fw-semibold"
                  onClick={handleDownload}
                  disabled={downloading}
                >
                  <i className="bi bi-file-earmark-pdf me-2"></i>
                  {downloading ? 'Generating PDF...' : 'Download Official PDF'}
                </button>
                <button
                  className="btn btn-outline-secondary btn-lg px-4"
                  onClick={() => setShowVerifyModal(true)}
                >
                  <i className="bi bi-qr-code me-2"></i>
                  Verify Authenticity
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Modal */}
        {showVerifyModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Credential Authenticity Check</h5>
                  <button type="button" className="btn-close" onClick={() => setShowVerifyModal(false)}></button>
                </div>
                <div className="modal-body text-center p-4">
                  <div className="p-3 bg-light d-inline-block rounded-3 mb-3 border">
                    <i className="bi bi-shield-fill-check fs-1 text-success"></i>
                  </div>
                  <h5 className="fw-bold text-success mb-2">Cryptographically Verified</h5>
                  <p className="text-muted small mb-3">
                    This certificate is registered on the tamper-proof Ethiroli verification ledger.
                  </p>

                  <div className="bg-light p-3 rounded-2 text-start small mb-3 border">
                    <div className="mb-1">
                      <strong className="text-muted">Certificate ID:</strong> {certData.certificateNumber}
                    </div>
                    <div className="mb-1">
                      <strong className="text-muted">Issued To:</strong> {certData.issuedTo}
                    </div>
                    <div className="text-truncate">
                      <strong className="text-muted">SHA-256 Hash:</strong>
                      <span className="font-monospace ms-1 text-secondary">{certData.hash}</span>
                    </div>
                  </div>

                  <a
                    href={`https://ethiroli.net/verify-certificate/${certData.certificateNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-primary btn-sm"
                  >
                    <i className="bi bi-box-arrow-up-right me-1"></i> Public Verification Link
                  </a>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowVerifyModal(false)}>
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
