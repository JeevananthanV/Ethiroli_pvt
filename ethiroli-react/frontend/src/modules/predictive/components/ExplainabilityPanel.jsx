import React, { useState, useEffect } from 'react'
import AdminPage from '../../common/components/AdminPage'
import Button from '../../common/components/Button'
import Modal from '../../common/components/Modal'
import { predictiveApi } from '../../services/api/predictiveApi'

export default function ExplainabilityPanel() {
  const [models, setModels] = useState([])
  const [selectedModel, setSelectedModel] = useState(null)
  const [explanation, setExplanation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
    setExplanation(null)
    try {
      const data = await predictiveApi.predict({ modelId })
      setExplanation(data)
    } catch (err) {
      console.error('Failed to load explanation', err)
    }
  }

  return (
    <AdminPage
      title="Explainability Panel"
      subtitle="AI model explainability with feature importance and SHAP values"
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
            </div>
          </div>
        </div>

        {selectedModel && (
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Model Info</h3>
            </div>
            <div className="cardBody">
              <div className="form">
                <div className="formGroup">
                  <label className="label">Name</label>
                  <span className="textSecondary">{selectedModel.name}</span>
                </div>
                <div className="formGroup">
                  <label className="label">Type</label>
                  <span className="textSecondary">{selectedModel.type || '-'}</span>
                </div>
                <div className="formGroup">
                  <label className="label">Accuracy</label>
                  <span className="textSecondary">{selectedModel.accuracy ? `${(selectedModel.accuracy * 100).toFixed(2)}%` : '-'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {explanation && (
        <div className="card mt4">
          <div className="cardHeader">
            <h3 className="cardTitle">Feature Importance</h3>
          </div>
          <div className="cardBody">
            {explanation.features?.length > 0 ? (
              <div className="overflowAuto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Feature</th>
                      <th>Importance</th>
                      <th>SHAP Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {explanation.features.map((feature, idx) => (
                      <tr key={idx}>
                        <td>{feature.name}</td>
                        <td>{feature.importance?.toFixed(4) || '-'}</td>
                        <td>{feature.shapValue?.toFixed(4) || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="textMuted">No explanation data available</p>
            )}
          </div>
        </div>
      )}
    </AdminPage>
  )
}
