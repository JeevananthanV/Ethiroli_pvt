import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listCertificates, getCertificate } from '../../../services/api/certificateApi.js';
import styles from './Lms.module.css';

export default function CertificateViewer({ certificateId }) {
  const [certificates, setCertificates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true);
      setError(null);
      try {
        if (certificateId) {
          const data = await getCertificate(certificateId);
          setSelected(data);
        } else {
          const data = await listCertificates();
          setCertificates(Array.isArray(data) ? data : [data]);
        }
      } catch (err) {
        setError(err.message || 'Failed to load certificates');
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, [certificateId]);

  const cert = selected || certificates[0];

  if (loading) {
    return (
      <div className="card">
        <div className="loading">Loading certificates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{borderColor: 'rgba(244, 63, 94, 0.3)', background: 'rgba(244, 63, 94, 0.05)'}}>
        <p style={{color: 'var(--admin-danger)', margin: 0}}>{error}</p>
      </div>
    );
  }

  return (
    <AdminPage
      title="Certificates"
      subtitle="View and download your earned certificates"
      loading={loading}
      error={error}
      onRetry={() => window.location.reload()}
    >
      {certificates.length === 0 && !selected ? (
        <div className="emptyState">
          <h3>No certificates yet</h3>
          <p>Complete a course to earn your first certificate</p>
        </div>
      ) : (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20}}>
          {(selected ? [selected] : certificates).map(cert => (
            <div key={cert.id} className={styles.certificateCard}>
              <div className={styles.certificateBorder}>
                <h2 style={{fontFamily: "'Alice', serif", letterSpacing: 2, color: 'var(--base-clay, #AF431E)', margin: '0 0 12px'}}>
                  CERTIFICATE OF COMPLETION
                </h2>
                <p className={styles.certSub} style={{fontStyle: 'italic', fontSize: 14, margin: '0 0 12px'}}>
                  This is proudly presented to
                </p>
                <h3 style={{margin: '0 0 12px', fontSize: 20, fontWeight: 700}}>{cert.recipientName || cert.student?.name || 'Student Name'}</h3>
                <p className={styles.certSub} style={{fontStyle: 'italic', fontSize: 14, margin: '0 0 12px'}}>
                  for successfully completing the course
                </p>
                <h4 style={{margin: 0, fontSize: 16, fontWeight: 600}}>{cert.courseTitle || cert.course?.title || 'Course Name'}</h4>
                <div className={styles.certMeta} style={{display: 'flex', justifyContent: 'space-around', marginTop: 40, fontSize: 12}}>
                  <div>
                    <p style={{margin: '0 0 4px'}}><strong>Credential ID:</strong> {cert.credentialId || cert.id}</p>
                    <p style={{margin: 0}}><strong>Date Issued:</strong> {cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : '—'}</p>
                  </div>
                  <div className={styles.qrPlaceholder} style={{
                    border: '1px solid #ccc',
                    width: 80,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    color: 'var(--admin-text-muted)'
                  }}>
                    [QR]
                  </div>
                </div>
              </div>
              <button className="btn primary" style={{width: '100%', marginTop: 16}}>
                Download PDF Certificate
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminPage>
  );
}
