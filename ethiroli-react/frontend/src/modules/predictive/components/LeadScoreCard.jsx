import React, { useEffect, useState } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { getPredictions } from '../../services/api/predictiveApi.js';

export default function LeadScoreCard() {
  const [predictions, setPredictions] = useState([]);
  const [_loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setPredictions((await getPredictions().catch(() => [])) || []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  return (
    <AdminPage title="Lead Scores" subtitle="AI-powered lead scoring">
      <div className="card">
        <div className="cardBody">
          {predictions.length === 0 ? <p className="textSecondary">No scores available.</p> : (
            <div className="overflowAuto">
              <table className="table">
                <thead><tr><th>Lead</th><th>Score</th><th>Probability</th><th>Factors</th></tr></thead>
                <tbody>
                  {predictions.map((p) => (
                    <tr key={p.id}>
                      <td className="textPrimary" style={{ fontWeight: 500 }}>{p.lead_name || p.lead_id}</td>
                      <td className="textSecondary">{p.score}</td>
                      <td className="textSecondary">{(Number(p.probability) * 100).toFixed(1)}%</td>
                      <td className="textSecondary">{(p.factors || []).slice(0, 2).join(', ')}</td>
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
