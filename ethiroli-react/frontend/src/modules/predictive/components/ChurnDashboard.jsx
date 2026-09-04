import React, { useEffect, useState } from 'react';
import { getLeadScore } from '../../../services/api/predictiveApi.js';
import { getStudentChurn } from '../../../services/api/predictiveApi.js';
import { getLeads } from '../../../services/api/leadApi.js';

export default function ChurnDashboard() {
  const [leadScores, setLeadScores] = useState([]);
  const [churnData, setChurnData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const leadsRes = await getLeads().catch(() => []);
        setLeads(Array.isArray(leadsRes) ? leadsRes.slice(0, 10) : []);
        const scorePromises = (Array.isArray(leadsRes) ? leadsRes.slice(0, 10) : []).map((lead) =>
          getLeadScore(lead.id).catch(() => ({ score: null, confidence: 0 }))
        );
        const scores = await Promise.all(scorePromises);
        setLeadScores(scores);
      } catch (err) {
        console.error('Failed to load churn data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="loading">Loading predictive analytics...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Predictive Analytics</h2>
          <p className="pageSubtitle">Lead scores and student churn probability</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Lead Scoring</h3>
          </div>
          <div className="cardBody">
            {leads.length === 0 ? (
              <p style={{ color: 'var(--admin-text-secondary)' }}>No leads available.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Score</th>
                    <th>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, idx) => (
                    <tr key={lead.id}>
                      <td>{lead.full_name || lead.name || lead.email || `Lead #${lead.id}`}</td>
                      <td><span className={`statusTag ${(leadScores[idx]?.score || 0) >= 70 ? 'active' : 'pending'}`}>{leadScores[idx]?.score ?? 'N/A'}</span></td>
                      <td>{leadScores[idx]?.confidence ? `${leadScores[idx].confidence}%` : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
