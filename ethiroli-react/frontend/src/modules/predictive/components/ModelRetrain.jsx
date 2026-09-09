import React, { useEffect, useState } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import axiosInstance from '../../services/api/axiosInstance.js';

export default function ModelRetrain() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [training, setTraining] = useState(false);
  const [status, setStatus] = useState({});
  const [config, setConfig] = useState({
    dataset_id: '',
    test_size: 0.2,
    epochs: 50,
    batch_size: 32,
    learning_rate: 0.001,
    features: [],
  });

  const loadModels = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('/v1/predictive/models');
      setModels(Array.isArray(res.data) ? res.data : []);
      if (Array.isArray(res.data) && res.data.length > 0) {
        setSelectedModel(res.data[0].id || res.data[0].name);
      }
    } catch (err) {
      setError(err.message || 'Failed to load models');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  const handleConfigChange = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleRetrain = async (e) => {
    e.preventDefault();
    if (!selectedModel || !config.dataset_id) {
      alert('Model and dataset are required');
      return;
    }
    setTraining(true);
    try {
      const res = await axiosInstance.post(`/v1/predictive/models/${selectedModel}/retrain`, config);
      const runId = res.data?.run_id || `run_${Date.now()}`;
      setStatus((prev) => ({
        ...prev,
        [selectedModel]: { status: 'training', runId, startedAt: new Date().toISOString() },
      }));
      pollStatus(selectedModel, runId);
    } catch (err) {
      alert(`Retraining failed: ${err.message}`);
    } finally {
      setTraining(false);
    }
  };

  const pollStatus = async (modelId, runId) => {
    const maxAttempts = 60;
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await axiosInstance.get(`/v1/predictive/models/${modelId}/retrain/${runId}`);
        const runStatus = res.data;
        setStatus((prev) => ({
          ...prev,
          [modelId]: { ...prev[modelId], ...runStatus },
        }));
        if (runStatus.status === 'completed' || runStatus.status === 'failed' || attempts >= maxAttempts) {
          clearInterval(interval);
        }
      } catch {
        if (attempts >= maxAttempts) clearInterval(interval);
      }
    }, 3000);
  };

  const currentStatus = selectedModel ? status[selectedModel] : null;

  return (
    <AdminPage
      title="Model Retraining"
      subtitle="Retrain AI models with selected datasets and configurations"
      loading={loading}
      error={error}
      onRetry={loadModels}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Model Selection</h3></div>
          <div className="cardBody">
            <div className="formGroup">
              <label className="label required">Select Model</label>
              <select className="select" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                <option value="">Select a model...</option>
                {models.map((model) => (
                  <option key={model.id || model.name} value={model.id || model.name}>
                    {model.name || model.id}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
              {models.map((model) => (
                <div
                  key={model.id || model.name}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 6,
                    background: selectedModel === (model.id || model.name) ? 'rgba(59,130,246,0.1)' : 'transparent',
                    border: `1px solid ${selectedModel === (model.id || model.name) ? 'var(--admin-primary)' : 'var(--admin-border)'}`,
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedModel(model.id || model.name)}
                >
                  <span className="textPrimary" style={{ fontWeight: 500 }}>{model.name || model.id}</span>
                  <span className={`statusTag ${model.status === 'trained' ? 'active' : 'pending'}`}>{model.status || 'untrained'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Training Configuration</h3></div>
          <div className="cardBody">
            <form onSubmit={handleRetrain} className="form">
              <div className="formGroup">
                <label className="label required">Dataset ID</label>
                <input className="inputField" required value={config.dataset_id} onChange={(e) => handleConfigChange('dataset_id', e.target.value)} placeholder="e.g. ds_12345" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                <div className="formGroup">
                  <label className="label">Test Size</label>
                  <input className="inputField" type="number" step="0.05" min="0" max="1" value={config.test_size} onChange={(e) => handleConfigChange('test_size', parseFloat(e.target.value))} />
                </div>
                <div className="formGroup">
                  <label className="label">Epochs</label>
                  <input className="inputField" type="number" min="1" value={config.epochs} onChange={(e) => handleConfigChange('epochs', parseInt(e.target.value, 10))} />
                </div>
                <div className="formGroup">
                  <label className="label">Batch Size</label>
                  <input className="inputField" type="number" min="1" value={config.batch_size} onChange={(e) => handleConfigChange('batch_size', parseInt(e.target.value, 10))} />
                </div>
                <div className="formGroup">
                  <label className="label">Learning Rate</label>
                  <input className="inputField" type="number" step="0.0001" value={config.learning_rate} onChange={(e) => handleConfigChange('learning_rate', parseFloat(e.target.value))} />
                </div>
              </div>
              <button type="submit" className="btn primary" disabled={training || !selectedModel}>
                {training ? 'Training...' : 'Start Retraining'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {currentStatus && (
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Training Status</h3>
            <span className={`statusTag ${currentStatus.status === 'completed' ? 'active' : currentStatus.status === 'failed' ? 'error' : 'pending'}`}>
              {currentStatus.status || 'pending'}
            </span>
          </div>
          <div className="cardBody">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div>
                <span className="textMuted">Run ID:</span>
                <div className="textSecondary"><code>{currentStatus.runId || '-'}</code></div>
              </div>
              <div>
                <span className="textMuted">Started:</span>
                <div className="textSecondary">{currentStatus.startedAt ? new Date(currentStatus.startedAt).toLocaleString() : '-'}</div>
              </div>
              <div>
                <span className="textMuted">Progress:</span>
                <div style={{ width: '100%', height: 8, background: 'var(--admin-bg-dark)', borderRadius: 4, marginTop: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min((currentStatus.progress || 0), 100)}%`, height: '100%', background: 'var(--admin-primary)', borderRadius: 4 }}></div>
                </div>
              </div>
            </div>
            {currentStatus.metrics && (
              <div style={{ marginTop: 16 }}>
                <span className="textMuted">Metrics:</span>
                <pre style={{ background: 'var(--admin-bg-dark)', padding: 12, borderRadius: 6, fontSize: 12, marginTop: 4 }}>
                  {JSON.stringify(currentStatus.metrics, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminPage>
  );
}
