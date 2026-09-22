import React, { useState, useEffect } from 'react';
import { getLeadScoreCard, getLeadScores } from '../../services/api/predictiveApi';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { RadialBarChart, RadialBar, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const LeadScoreCard = ({ leadId }) => {
  const [data, setData] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (leadId) {
      loadLeadScore(leadId);
    } else {
      loadLeads();
    }
  }, [leadId]);

  const loadLeadScore = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getLeadScoreCard(id);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getLeadScores();
      setLeads(result.leads || result || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#3b82f6';
    return '#f43f5e';
  };

  const getScoreClass = (score) => {
    if (score >= 80) return 'active';
    if (score >= 60) return 'pending';
    return 'error';
  };

  if (loading) return <div className="loading">Loading lead scores...</div>;
  if (error) return <div className="emptyState"><h3>Error</h3><p>{error}</p><button className="btn primary" onClick={leadId ? () => loadLeadScore(leadId) : loadLeads}>Retry</button></div>;

  if (leadId && data) {
    const score = data.score || data.leadScore || 0;
    return (
      <AdminPage
        title="Lead Score Card"
        subtitle="Lead scoring and recommended actions"
        loading={loading}
        error={error}
        onRetry={() => loadLeadScore(leadId)}
      >
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">{data.leadName || data.name || 'Lead Score'}</h3>
            <span className={`statusTag ${getScoreClass(score)}`}>
              Score: {score}
            </span>
          </div>
          <div className="cardBody">
            <div className="dashboardGrid" style={{ marginBottom: '24px' }}>
              <div className="statCard">
                <p className="statLabel">Lead Score</p>
                <h3 className="statValue" style={{ color: getScoreColor(score) }}>{score}</h3>
              </div>
              <div className="statCard">
                <p className="statLabel">Conversion Probability</p>
                <h3 className="statValue textSuccess">{data.conversionProbability ? `${(data.conversionProbability * 100).toFixed(1)}%` : 'N/A'}</h3>
              </div>
              <div className="statCard">
                <p className="statLabel">Engagement Level</p>
                <h3 className="statValue">{data.engagementLevel || 'N/A'}</h3>
              </div>
              <div className="statCard">
                <p className="statLabel">Last Contact</p>
                <h3 className="statValue textSecondary">{data.lastContact ? new Date(data.lastContact).toLocaleDateString() : 'N/A'}</h3>
              </div>
            </div>

            <div style={{ height: '300px', marginBottom: '24px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[{ name: 'Score', value: score, fill: getScoreColor(score) }]}>
                  <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={10} />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>

            {data.factors && data.factors.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h4 className="cardTitle" style={{ marginBottom: '12px' }}>Scoring Factors</h4>
                <div className="overflowAuto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Factor</th>
                        <th>Value</th>
                        <th>Impact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.factors.map((factor, idx) => (
                        <tr key={idx}>
                          <td className="textPrimary">{factor.name || factor.factor}</td>
                          <td className="textSecondary">{factor.value || 'N/A'}</td>
                          <td>
                            <span className={`statusTag ${(factor.impact > 0) ? 'active' : 'error'}`}>
                              {(factor.impact > 0 ? '+' : '') + (factor.impact || 0)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {data.recommendedActions && data.recommendedActions.length > 0 && (
              <div>
                <h4 className="cardTitle" style={{ marginBottom: '12px' }}>Recommended Actions</h4>
                <ul style={{ paddingLeft: '20px', color: 'var(--admin-text-secondary)' }}>
                  {data.recommendedActions.map((action, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </AdminPage>
    );
  }

  return (
    <AdminPage
      title="Lead Score Card"
      subtitle="Lead scoring overview"
      loading={loading}
      error={error}
      onRetry={loadLeads}
      actions={<button className="btn primary" onClick={loadLeads}>Refresh</button>}
    >
      <div className="dashboardGrid" style={{ marginBottom: '24px' }}>
        <div className="statCard">
          <p className="statLabel">Total Leads</p>
          <h3 className="statValue">{leads.length || 0}</h3>
        </div>
        <div className="statCard">
          <p className="statLabel">Hot Leads</p>
          <h3 className="statValue textDanger">{leads.filter(l => (l.score || l.leadScore || 0) >= 80).length || 0}</h3>
        </div>
        <div className="statCard">
          <p className="statLabel">Warm Leads</p>
          <h3 className="statValue textWarning">{leads.filter(l => (l.score || l.leadScore || 0) >= 60 && (l.score || l.leadScore || 0) < 80).length || 0}</h3>
        </div>
        <div className="statCard">
          <p className="statLabel">Cold Leads</p>
          <h3 className="statValue textInfo">{leads.filter(l => (l.score || l.leadScore || 0) < 60).length || 0}</h3>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Lead Scores</h3>
        </div>
        <div className="cardBody">
          {leads.length === 0 ? (
            <div className="emptyState">
              <h3>No leads found</h3>
              <p>No lead scores available at this time.</p>
            </div>
          ) : (
            <div className="overflowAuto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Score</th>
                    <th>Probability</th>
                    <th>Engagement</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => {
                    const score = lead.score || lead.leadScore || 0;
                    return (
                      <tr key={lead.id}>
                        <td className="textPrimary">{lead.name || lead.customerName || 'Unknown'}</td>
                        <td>
                          <span className={`statusTag ${getScoreClass(score)}`}>
                            {score}
                          </span>
                        </td>
                        <td className="textSecondary">{lead.conversionProbability ? `${(lead.conversionProbability * 100).toFixed(1)}%` : 'N/A'}</td>
                        <td className="textSecondary">{lead.engagementLevel || '-'}</td>
                        <td>
                          <button className="btn btnSm secondary" onClick={() => loadLeadScore(lead.id)}>View</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminPage>
  );
};

export default LeadScoreCard;
