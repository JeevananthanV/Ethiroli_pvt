import React, { useEffect, useState } from 'react';
import { getLeadScore } from '../../../../services/api/predictiveApi.js';
import { getLeads } from '../../../../services/api/leadApi.js';

export default function LeadScoreCard() {
  const [leadScores, setLeadScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const leadsRes = await getLeads().catch(() => []);
        const leads = Array.isArray(leadsRes) ? leadsRes.slice(0, 10) : [];
        const scores = await Promise.all(leads.map((lead) => getLeadScore(lead.id).catch(() => ({ score: null }))));
        setLeadScores(scores.filter((s) => s !== null));
      } catch (err) {
        console.error('Failed to load lead scores:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading lead scores...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Predictive Conversion Analytics</h2>
          <p className="pageSubtitle">Lead scores and conversion probability</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {leadScores.length === 0 ? (
            <div className="emptyState"><h3>No Scores</h3><p>No lead scores available.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Score</th><th>Confidence</th></tr></thead>
              <tbody>
                {leadScores.map((score, idx) => (
                  <tr key={idx}>
                    <td><span className={`statusTag ${score.score >= 70 ? 'active' : 'pending'}`}>{score.score ?? 'N/A'}</span></td>
                    <td>{score.confidence ? `${score.confidence}%` : 'N/A'}</td>
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
