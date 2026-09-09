import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getCandidates } from '../../services/api/candidateApi.js';

export default function CandidatePipeline() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setCandidates((await getCandidates().catch(() => [])) || []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const stages = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'];
  const grouped = stages.reduce((acc, stage) => { acc[stage] = candidates.filter(c => c.stage === stage); return acc; }, {});

  return (
    <AdminPage title="Candidate Pipeline" subtitle="Track candidates through interview stages" loading={loading} error={null} onRetry={load}>
      <div className="dashboardGrid" style={{ marginBottom: 24 }}>
        {stages.map((stage) => (
          <div className="statCard" key={stage}>
            <p className="statLabel">{stage}</p>
            <p className="statValue">{(grouped[stage] || []).length}</p>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="cardHeader"><h3 className="cardTitle">All Candidates</h3></div>
        <div className="cardBody">
          {candidates.length === 0 ? <p className="textSecondary">No candidates yet.</p> : (
            <div className="overflowAuto">
              <table className="table">
                <thead><tr><th>Name</th><th>Email</th><th>Stage</th><th>Applied Date</th></tr></thead>
                <tbody>
                  {candidates.map((c) => (
                    <tr key={c.id}>
                      <td className="textPrimary" style={{ fontWeight: 500 }}>{c.name}</td>
                      <td className="textSecondary">{c.email}</td>
                      <td><span className="statusTag active">{c.stage}</span></td>
                      <td className="textSecondary">{c.applied_date ? new Date(c.applied_date).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
