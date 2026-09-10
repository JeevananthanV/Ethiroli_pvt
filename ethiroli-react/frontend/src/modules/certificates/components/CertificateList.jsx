import React, { useEffect, useState } from 'react';
import { getCertificates } from '../../../../services/api/certificateApi.js';

export default function CertificateList() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getCertificates().catch(() => []);
        setCertificates(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load certificates:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading certificates...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Certificates</h2>
          <p className="pageSubtitle">Student certificates and achievements</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {certificates.length === 0 ? (
            <div className="emptyState"><h3>No Certificates</h3><p>No certificates issued yet.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Student</th><th>Course</th><th>Issue Date</th></tr></thead>
              <tbody>
                {certificates.map((cert) => (
                  <tr key={cert.id}>
                    <td>{cert.student_name || cert.student_id}</td>
                    <td>{cert.course_name || cert.course_id}</td>
                    <td>{cert.issued_at ? new Date(cert.issued_at).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
