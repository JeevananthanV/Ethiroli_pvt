import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listCertificates, downloadCertificate } from '../../../services/api/certificateApi.js';

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const formatDate = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

/**
 * Renders the certificate into a dedicated print window so "Download PDF"
 * works through the browser's print-to-PDF without a server-side PDF engine.
 */
function buildCertificateDocument(cert) {
  const student = escapeHtml(cert.student_name || cert.full_name || 'Learner');
  const course = escapeHtml(cert.course_name || cert.course_title || cert.title || 'Course');
  const code = escapeHtml(cert.course_code || '');
  const number = escapeHtml(cert.certificate_number || '');
  const issued = escapeHtml(formatDate(cert.issue_date || cert.issued_at));
  const tutor = escapeHtml(cert.tutor_name || '');
  const verifyUrl = escapeHtml(
    `${window.location.origin}/api/v1/certificates/verify/${cert.certificate_number || ''}`
  );

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Certificate - ${student}</title>
<style>
  @page { size: A4 landscape; margin: 12mm; }
  body { margin:0; font-family: Georgia, 'Times New Roman', serif; background:#f7f5f1; color:#1f2937; }
  .sheet { position:relative; width:275mm; min-height:190mm; margin:20px auto; background:#fff;
           border:2px solid #819E35; box-sizing:border-box; padding:26mm 22mm; text-align:center; }
  .sheet:before { content:''; position:absolute; inset:7mm; border:1px solid rgba(128,158,53,.45); pointer-events:none; }
  .eyebrow { letter-spacing:.34em; font-size:11px; text-transform:uppercase; color:#819E35; }
  h1 { font-size:44px; margin:14px 0 6px; color:#1A4B48; font-weight:600; }
  .lead { font-size:15px; color:#6b7280; margin:0 0 26px; }
  .name { font-size:34px; margin:10px 0; color:#111827; border-bottom:1px solid #d6d3cd; display:inline-block; padding:0 40px 8px; }
  .course { font-size:24px; margin:26px 0 4px; color:#AF431E; }
  .meta { margin-top:34px; display:flex; justify-content:space-between; font-size:12px; color:#6b7280; }
  .meta div { text-align:left; }
  .meta b { display:block; color:#1f2937; font-size:13px; }
  .seal { position:absolute; right:22mm; bottom:22mm; width:34mm; height:34mm; border:2px solid #819E35;
          border-radius:50%; display:flex; align-items:center; justify-content:center; text-align:center;
          font-size:10px; letter-spacing:.08em; color:#819E35; text-transform:uppercase; }
  .verify { margin-top:26px; font-size:11px; color:#9ca3af; word-break:break-all; }
</style>
</head>
<body>
  <div class="sheet">
    <div class="eyebrow">Ethiroli Learning</div>
    <h1>Certificate of Completion</h1>
    <p class="lead">This is to certify that</p>
    <div class="name">${student}</div>
    <p class="lead">has successfully completed the course</p>
    <div class="course">${course}${code ? ` (${code})` : ''}</div>
    <div class="meta">
      <div><b>Certificate No.</b>${number || '-'}</div>
      <div><b>Issued On</b>${issued}</div>
      <div><b>Issued By</b>${tutor || 'Ethiroli'}</div>
    </div>
    <div class="seal">Verified<br />Completion</div>
    <div class="verify">Verify: ${verifyUrl}</div>
  </div>
  <script>window.onload = function () { setTimeout(function () { window.print(); }, 400); };</script>
</body>
</html>`;
}

export default function StudentCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState(null);

  const fetchCertificates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listCertificates().catch(() => []);
      setCertificates(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load certificates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const handleDownload = useCallback(async (cert) => {
    setBusyId(cert.id);
    try {
      const details = await downloadCertificate(cert.id).catch(() => cert);
      const payload = details || cert;
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        setNotice('Allow pop-ups to open the printable certificate.');
        return;
      }
      printWindow.document.write(buildCertificateDocument(payload));
      printWindow.document.close();
    } catch (err) {
      setNotice(err.message || 'Could not prepare the certificate download.');
    } finally {
      setBusyId(null);
    }
  }, []);

  const handleCopyVerifyLink = useCallback(async (cert) => {
    const link = `${window.location.origin}/api/v1/certificates/verify/${cert.certificate_number || ''}`;
    try {
      await navigator.clipboard.writeText(link);
      setNotice('Verification link copied to clipboard.');
    } catch {
      setNotice(link);
    }
  }, []);

  return (
    <AdminPage
      title="My Certificates"
      subtitle="View, print and share the certificates you have earned"
      loading={loading}
      error={error}
      onRetry={fetchCertificates}
    >
      <div className="dashboard">
        {notice && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              marginBottom: 18,
              borderRadius: 8,
              background: 'rgba(129, 158, 53, 0.12)',
              border: '1px solid rgba(129, 158, 53, 0.4)',
              fontSize: 13
            }}
          >
            <span>{notice}</span>
            <button onClick={() => setNotice(null)} className="btn secondary" style={{ padding: '4px 10px' }}>
              Dismiss
            </button>
          </div>
        )}

        {certificates.length === 0 ? (
          <div className="emptyState">
            <h3>No certificates yet</h3>
            <p>Complete every lesson in a course and your certificate is issued automatically.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
            {certificates.map((cert) => {
              const courseName = cert.course_name || cert.course_title || cert.title || 'Certificate';
              const studentName = cert.student_name || cert.full_name || '';
              const issuedOn = cert.issue_date || cert.issued_at;

              return (
                <div key={cert.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="cardHeader">
                    <h3 className="cardTitle" style={{ fontSize: 16 }}>{courseName}</h3>
                    <span className="statusTag active" style={{ fontSize: 11 }}>Issued</span>
                  </div>
                  <div className="cardBody" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div
                      style={{
                        border: '2px dashed rgba(129, 158, 53, 0.6)',
                        borderRadius: 8,
                        padding: '16px 14px',
                        textAlign: 'center',
                        background: 'rgba(129, 158, 53, 0.06)'
                      }}
                    >
                      <div style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--admin-primary)' }}>
                        Certificate of Completion
                      </div>
                      <div style={{ fontSize: 18, margin: '8px 0 4px', fontWeight: 600 }}>{studentName || 'You'}</div>
                      <div style={{ fontSize: 12, color: 'var(--admin-text-secondary)' }}>
                        {cert.course_code ? `${cert.course_code} · ` : ''}{formatDate(issuedOn)}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginTop: 8 }}>
                        No. {cert.certificate_number || '—'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                      <button
                        className="btn primary"
                        style={{ flex: 1 }}
                        disabled={busyId === cert.id}
                        onClick={() => handleDownload(cert)}
                      >
                        {busyId === cert.id ? 'Preparing…' : 'Download PDF'}
                      </button>
                      <button
                        className="btn secondary"
                        onClick={() => handleCopyVerifyLink(cert)}
                        title="Copy the public verification link"
                      >
                        Copy Verify Link
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminPage>
  );
}
