import React, { useEffect, useState } from 'react';
import { getCandidates } from '../../../../services/api/candidateApi.js';

export default function CandidatePipeline() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getCandidates().catch(() => []);
        setCandidates(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load candidates:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading candidates...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Candidate Pipeline</h2>
          <p className="pageSubtitle">Hiring pipeline candidates</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {candidates.length === 0 ? (
            <div className="emptyState"><h3>No Candidates</h3><p>No candidates in pipeline.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Name</th><th>Position</th><th>Status</th></tr></thead>
              <tbody>
                {candidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>{candidate.full_name}</td>
                    <td>{candidate.position || '—'}</td>
                    <td><span className={`statusTag ${candidate.status === 'hired' ? 'active' : 'pending'}`}>{candidate.status || 'New'}</span></td>
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
