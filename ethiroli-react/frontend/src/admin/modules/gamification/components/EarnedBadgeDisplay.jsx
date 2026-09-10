import React, { useEffect, useState } from 'react';
import { getCertificates } from '../../../../services/api/certificateApi.js';

export default function EarnedBadgeDisplay() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const certsRes = await getCertificates().catch(() => []);
        setCertificates(Array.isArray(certsRes) ? certsRes : []);
      } catch (err) {
        console.error('Failed to load earned badges:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading earned badges...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">My Earned Badges</h2>
          <p className="pageSubtitle">Your achievements and certifications</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {certificates.length === 0 ? (
          <div className="emptyState" style={{ gridColumn: '1 / -1' }}><h3>No Badges Yet</h3><p>Complete courses to earn badges.</p></div>
        ) : (
          certificates.map((cert) => (
            <div key={cert.id} className="statCard" style={{ textAlign: 'center', padding: '24px' }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>🏆</div>
              <h4 style={{ margin: '0 0 8px' }}>{cert.course_name || cert.title || 'Certificate'}</h4>
              <p style={{ color: 'var(--admin-text-secondary)', fontSize: '13px' }}>Issued: {cert.issued_at ? new Date(cert.issued_at).toLocaleDateString() : '—'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
