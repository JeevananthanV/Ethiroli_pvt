import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listCertificates } from '../../../services/api/certificateApi.js';

export default function StudentCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <AdminPage
      title="My Certificates"
      subtitle="View and download your earned certificates"
      loading={loading}
      error={error}
      onRetry={fetchCertificates}
    >
      <div className="dashboard">
        {certificates.length === 0 ? (
          <div className="emptyState">
            <h3>No certificates yet</h3>
            <p>Complete courses to earn certificates.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
            {certificates.map((cert) => (
              <div key={cert.id} className="card" style={{ textAlign: 'center', maxWidth: 380, margin: '0 auto' }}>
                <div className="cardHeader">
                  <h3 className="cardTitle">{cert.title || cert.course_title || 'Certificate'}</h3>
                </div>
                <div className="cardBody">
                  <p style={{ margin: '10px 0', fontSize: 13, color: 'var(--admin-text-secondary)' }}>
                    Issued on {cert.issued_at ? new Date(cert.issued_at).toLocaleDateString() : 'N/A'}
                  </p>
                  <button className="btn primary" style={{ marginTop: 12, width: '100%' }}>
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminPage>
  );
}