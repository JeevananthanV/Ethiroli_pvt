import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getStudentChurn, getLeadScore } from '../../../services/api/predictiveApi.js';

export default function AdminAIAnalytics() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPredictions = async () => {
    setLoading(true);
    setError(null);
    try {
      const [churnRes, leadRes] = await Promise.allSettled([
        getStudentChurn('all'),
        getLeadScore('all'),
      ]);
      const churnData = churnRes.status === 'fulfilled' ? churnRes.value : [];
      const leadData = leadRes.status === 'fulfilled' ? leadRes.value : [];
      setPredictions(Array.isArray(churnData) ? churnData : Array.isArray(leadData) ? leadData : []);
    } catch (err) {
      setError(err.message || 'Failed to load AI analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  return (
    <AdminPage
      title="AI Analytics"
      subtitle="Predictive models for student churn and lead scoring"
      loading={loading}
      error={error}
      onRetry={fetchPredictions}
      actions={
        <button className="btn primary btnSm" onClick={fetchPredictions} disabled={loading}>
          Refresh Analytics
        </button>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '24px' }}>
        <div className="statCard">
          <p className="statLabel">Total Predictions</p>
          <p className="statValue">{predictions.length}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">High Risk (Churn)</p>
          <p className="statValue" style={{ color: 'var(--admin-danger)' }}>
            {predictions.filter((p) => p.churn_risk === 'high').length}
          </p>
        </div>
        <div className="statCard">
          <p className="statLabel">Hot Leads</p>
          <p className="statValue" style={{ color: 'var(--admin-success)' }}>
            {predictions.filter((p) => p.lead_score >= 80).length}
          </p>
        </div>
      </div>

      <div className="card">
        <h3 className="cardTitle" style={{ marginBottom: '16px' }}>Predictions Log</h3>
        {predictions.length === 0 ? (
          <div className="emptyState">
            <h3>No predictions yet</h3>
            <p>Run AI models to generate predictions for your users.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Subject ID</th>
                <th>Churn Risk</th>
                <th>Lead Score</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((pred, idx) => (
                <tr key={pred.id || idx}>
                  <td style={{ fontWeight: '500' }}>{pred.student_id || pred.lead_id || '—'}</td>
                  <td>
                    <span
                      className={`statusTag ${
                        pred.churn_risk === 'high' ? 'error' : pred.churn_risk === 'medium' ? 'pending' : 'active'
                      }`}
                    >
                      {pred.churn_risk || 'N/A'}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600' }}>
                    {typeof pred.lead_score === 'number' ? `${pred.lead_score}/100` : '—'}
                  </td>
                  <td style={{ color: 'var(--admin-text-muted)', fontSize: '12px' }}>
                    {typeof pred.confidence === 'number' ? `${(pred.confidence * 100).toFixed(0)}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminPage>
  );
}
