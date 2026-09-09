import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getLeadScore, getStudentChurn } from '../../services/api/predictiveApi.js';

export default function ExplainabilityPanel() {
  const [leadScore, setLeadScore] = useState(null);
  const [churnScore, setChurnScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [targetId, setTargetId] = useState('');
  const [mode, setMode] = useState('lead');

  const loadExplanation = useCallback(async () => {
    if (!targetId.trim()) return;
    setLoading(true);
    setError(null);
    try {
      if (mode === 'lead') {
        const data = await getLeadScore(targetId.trim());
        setLeadScore(data || null);
        setChurnScore(null);
      } else {
        const data = await getStudentChurn(targetId.trim());
        setChurnScore(data || null);
        setLeadScore(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to load explanation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExplanation();
  }, []);

  const getBarColor = (value) => {
    const val = Number(value) || 0;
    if (val >= 0.7) return 'var(--admin-success)';
    if (val >= 0.4) return 'var(--admin-warning)';
    return 'var(--admin-danger)';
  };

  const renderFeatureImportance = (features) => {
    if (!Array.isArray(features)) return <div className="textMuted">No feature data available.</div>;
    const maxVal = Math.max(...features.map((f) => Math.abs(f.importance || f.value || 0)), 0.01);
    return (
      <div style={{ display: 'grid', gap: 10 }}>
        {features.map((feature, idx) => {
          const importance = feature.importance || feature.value || 0;
          const width = Math.max((Math.abs(importance) / maxVal) * 100, 2);
          return (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span className="textPrimary" style={{ fontSize: 13 }}>{feature.name || feature.feature}</span>
                <span className="textSecondary" style={{ fontSize: 12 }}>{typeof importance === 'number' ? importance.toFixed(4) : importance}</span>
              </div>
              <div style={{ width: '100%', height: 8, background: 'var(--admin-bg-dark)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${width}%`, height: '100%', background: getBarColor(importance), borderRadius: 4, transition: 'width 0.3s' }}></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const activeData = mode === 'lead' ? leadScore : churnScore;

  return (
    <AdminPage
      title="Explainability Panel"
      subtitle="AI model feature importance and SHAP values"
      loading={loading}
      error={error}
      onRetry={loadExplanation}
    >
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="cardHeader">
          <h3 className="cardTitle">Query Model Explanation</h3>
        </div>
        <div className="cardBody">
          <form onSubmit={(e) => { e.preventDefault(); loadExplanation(); }} className="form">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div className="formGroup">
                <label className="label required">Target ID</label>
                <input className="inputField" required value={targetId} onChange={(e) => setTargetId(e.target.value)} placeholder="Enter lead or student ID" />
              </div>
              <div className="formGroup">
                <label className="label">Mode</label>
                <select className="select" value={mode} onChange={(e) => setMode(e.target.value)}>
                  <option value="lead">Lead Score</option>
                  <option value="churn">Student Churn</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn primary" disabled={loading || !targetId.trim()}>
              {loading ? 'Loading...' : 'Load Explanation'}
            </button>
          </form>
        </div>
      </div>

      {activeData && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Feature Importance</h3>
            </div>
            <div className="cardBody">
              {renderFeatureImportance(activeData.features || activeData.feature_importance || activeData.shap_values)}
            </div>
          </div>

          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Prediction Details</h3>
            </div>
            <div className="cardBody">
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="textMuted">Score</span>
                  <span className="textPrimary" style={{ fontWeight: 600, fontSize: 20 }}>
                    {typeof activeData.score === 'number' ? activeData.score.toFixed(4) : activeData.score}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="textMuted">Confidence</span>
                  <span className="textSecondary">
                    {typeof activeData.confidence === 'number' ? `${(activeData.confidence * 100).toFixed(1)}%` : activeData.confidence || '-'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="textMuted">Prediction</span>
                  <span className={`statusTag ${(activeData.prediction || activeData.label) === 'positive' || (activeData.prediction || activeData.label) === 'high' ? 'active' : 'error'}`}>
                    {activeData.prediction || activeData.label || '-'}
                  </span>
                </div>
                {activeData.shap_values && (
                  <div>
                    <span className="textMuted">SHAP Values:</span>
                    <pre style={{ background: 'var(--admin-bg-dark)', padding: 12, borderRadius: 6, fontSize: 12, marginTop: 4 }}>
                      {JSON.stringify(activeData.shap_values, null, 2)}
                    </pre>
                  </div>
                )}
                <div>
                  <span className="textMuted">Raw Response:</span>
                  <pre style={{ background: 'var(--admin-bg-dark)', padding: 12, borderRadius: 6, fontSize: 12, marginTop: 4, maxHeight: 300, overflow: 'auto' }}>
                    {JSON.stringify(activeData, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!activeData && !loading && (
        <div className="card">
          <div className="cardBody">
            <div className="emptyState">
              <h3>No explanation loaded</h3>
              <p>Enter an ID and click Load Explanation to see feature importance and SHAP values.</p>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
