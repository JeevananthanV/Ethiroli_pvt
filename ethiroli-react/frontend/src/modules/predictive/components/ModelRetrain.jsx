import React, { useState, useEffect } from 'react'
import AdminPage from '../../common/components/AdminPage'
import Button from '../../common/components/Button'
import Modal from '../../common/components/Modal'
import Input from '../../common/components/Input'
import { predictiveApi } from '../../services/api/predictiveApi'

export default function ModelRetrain() {
  const [models, setModels] = useState([])
  const [selectedModel, setSelectedModel] = useState(null)
  const [config, setConfig] = useState({
    epochs: '10',
    batchSize: '32',
    learningRate: '0.001',
    trainSplit: '0.8',
  })
  const [loading, setLoading] = useState(false)
  const [training, setTraining] = useState(false)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    loadModels()
  }, [])

  const loadModels = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await predictiveApi.getAll()
      setModels(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleModelSelect = async (modelId) => {
    const model = models.find((m) => m.id === modelId)
    setSelectedModel(model)
    setStatus(null)
  }

  const handleRetrain = async () => {
    if (!selectedModel) return
    setTraining(true)
    setStatus(null)
    try {
      const result = await predictiveApi.retrain(selectedModel.id, {
        epochs: parseInt(config.epochs, 10),
        batchSize: parseInt(config.batchSize, 10),
        learningRate: parseFloat(config.learningRate),
        trainSplit: parseFloat(config.trainSplit),
      })
      setStatus(result)
    } catch (err) {
      setStatus({ success: false, message: err.message })
    } finally {
      setTraining(false)
    }
  }

  return (
    <AdminPage
      title="Model Retraining"
      subtitle="Retrain AI models with new data"
      loading={loading}
      error={error}
      onRetry={loadModels}
    >
      <div className="grid gridCols2">
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Select Model</h3>
          </div>
          <div className="cardBody">
            <div className="form">
              <div className="formGroup">
                <label className="label required">Model</label>
                <select
                  className="select"
                  value={selectedModel?.id || ''}
                  onChange={(e) => handleModelSelect(e.target.value)}
                >
                  <option value="">Select Model</option>
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedModel && (
                <>
                  <div className="formGroup">
                    <label className="label">Type</label>
                    <span className="textSecondary">{selectedModel.type || '-'}</span>
                  </div>
                  <div className="formGroup">
                    <label className="label">Last Trained</label>
                    <span className="textSecondary">
                      {selectedModel.lastTrained ? new Date(selectedModel.lastTrained).toLocaleString() : '-'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {selectedModel && (
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Training Configuration</h3>
            </div>
            <div className="cardBody">
              <div className="form">
                <div className="formGroup">
                  <label className="label">Epochs</label>
                  <Input type="number" value={config.epochs} onChange={(e) => setConfig({ ...config, epochs: e.target.value })} />
                </div>
                <div className="formGroup">
                  <label className="label">Batch Size</label>
                  <Input type="number" value={config.batchSize} onChange={(e) => setConfig({ ...config, batchSize: e.target.value })} />
                </div>
                <div className="formGroup">
                  <label className="label">Learning Rate</label>
                  <Input type="number" step="0.0001" value={config.learningRate} onChange={(e) => setConfig({ ...config, learningRate: e.target.value })} />
                </div>
                <div className="formGroup">
                  <label className="label">Train Split</label>
                  <Input type="number" step="0.1" value={config.trainSplit} onChange={(e) => setConfig({ ...config, trainSplit: e.target.value })} />
                </div>
                <Button variant="primary" onClick={handleRetrain} disabled={training} style={{ marginTop: '16px' }}>
                  {training ? 'Training...' : 'Start Retraining'}
                </Button>
                {status && (
                  <div className={`formGroup mt3 ${status.success ? 'textSuccess' : 'textDanger'}`}>
                    <span>{status.success ? 'Training completed successfully' : `Training failed: ${status.message}`}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPage>
  )
}
