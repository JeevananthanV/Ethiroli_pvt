import React from 'react';

export default function AIAnalytics() {
  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-cpu text-primary" aria-hidden="true"></i>
            Platform AI Analytics & Telemetry
          </h2>
          <p className="text-secondary small mb-0">
            Predictive modeling, cross-tenant churn forecasting, token consumption telemetry, and model governance.
          </p>
        </div>
        <button className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1">
          <i className="bi bi-arrow-clockwise" aria-hidden="true"></i> Re-train Predictive Models
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-semibold text-uppercase">Monthly Token Ingestion</span>
            <h3 className="fw-bold text-primary my-1">4.82M Tokens</h3>
            <small className="text-success"><i className="bi bi-arrow-up me-1"></i>Gemini Flash Optimized</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-semibold text-uppercase">Predicted Churn Risk</span>
            <h3 className="fw-bold text-success my-1">1.4%</h3>
            <small className="text-muted">Low across all 48 tenants</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-semibold text-uppercase">Automated Conversions</span>
            <h3 className="fw-bold text-info my-1">34.2%</h3>
            <small className="text-muted">AI Lead enrichment gain</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-semibold text-uppercase">Inference Latency</span>
            <h3 className="fw-bold text-dark my-1">210ms</h3>
            <small className="text-success">Sub-second response</small>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
        <h5 className="fw-bold mb-3">Model Governance & Cost Allocation</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Feature / Endpoint</th>
                <th>Model Backbone</th>
                <th>Monthly Requests</th>
                <th>Average Tokens</th>
                <th>Estimated Cost</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-semibold">Lead Intent Classification</td>
                <td>Gemini 1.5 Flash</td>
                <td>24,900</td>
                <td>180 tokens/req</td>
                <td>$3.82</td>
                <td><span className="badge bg-success">Optimal</span></td>
              </tr>
              <tr>
                <td className="fw-semibold">Automated Course Curriculum Drafter</td>
                <td>Gemini 1.5 Pro</td>
                <td>1,840</td>
                <td>2,400 tokens/req</td>
                <td>$12.40</td>
                <td><span className="badge bg-success">Optimal</span></td>
              </tr>
              <tr>
                <td className="fw-semibold">Sentiment & Doubt Resolution Assistant</td>
                <td>Gemini 1.5 Flash</td>
                <td>48,100</td>
                <td>220 tokens/req</td>
                <td>$7.94</td>
                <td><span className="badge bg-success">Optimal</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
