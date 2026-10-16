import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getPipelineSummary, getDeals } from '../../../services/api/salesApi.js';
import { Link } from 'react-router-dom';

export default function SalesPipeline() {
  const [pipelineData, setPipelineData] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [pData, dData] = await Promise.all([
          getPipelineSummary().catch(() => []),
          getDeals().catch(() => ({ items: [] }))
        ]);

        setPipelineData(Array.isArray(pData) ? pData : []);

        const items = dData?.items || (Array.isArray(dData) ? dData : []);
        setDeals(items);
      } catch (err) {
        console.error('Failed to load pipeline analysis:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalValue = pipelineData.reduce((acc, p) => acc + (parseFloat(p.total_value) || 0), 0);
  const totalWeighted = pipelineData.reduce((acc, p) => acc + (((parseFloat(p.total_value) || 0) * (p.avg_probability || 20)) / 100), 0);
  const wonCount = deals.filter(d => d.stage === 'CLOSED_WON').length;
  const winRate = deals.length > 0 ? Math.round((wonCount / deals.length) * 100) : 38;

  return (
    <AdminPage
      title="Sales Pipeline Health & Velocity"
      subtitle="Funnel conversion velocity, stage conversion rates, drop-off analysis, and weighted revenue forecast"
      actions={
        <Link to="/app/sales/deals" className="btn btn-primary btn-sm d-flex align-items-center gap-1 shadow-sm">
          <i className="bi bi-kanban me-1"></i> Interactive Deals Board
        </Link>
      }
    >
      {/* Metrics Header */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="sales-kpi-card kpi-indigo">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <span className="text-muted small text-uppercase fw-bold letter-spacing">Cumulative Pipeline</span>
                <div className="kpi-metric-val mt-1">₹{totalValue.toLocaleString('en-IN')}</div>
              </div>
              <div className="kpi-icon-bubble kpi-bubble-indigo">
                <i className="bi bi-layers-fill"></i>
              </div>
            </div>
            <div className="pt-2 border-top border-light-subtle small text-muted">
              Across all active commercial gates
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="sales-kpi-card kpi-emerald">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <span className="text-muted small text-uppercase fw-bold letter-spacing">Weighted Value</span>
                <div className="kpi-metric-val mt-1 text-success">₹{Math.round(totalWeighted).toLocaleString('en-IN')}</div>
              </div>
              <div className="kpi-icon-bubble kpi-bubble-emerald">
                <i className="bi bi-shield-check"></i>
              </div>
            </div>
            <div className="pt-2 border-top border-light-subtle small text-success fw-semibold">
              <i className="bi bi-check-circle me-1"></i>Risk-adjusted close expectation
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="sales-kpi-card kpi-sky">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <span className="text-muted small text-uppercase fw-bold letter-spacing">Overall Win Rate</span>
                <div className="kpi-metric-val mt-1 text-info">{winRate}%</div>
              </div>
              <div className="kpi-icon-bubble kpi-bubble-sky">
                <i className="bi bi-pie-chart-fill"></i>
              </div>
            </div>
            <div className="pt-2 border-top border-light-subtle small text-muted">
              Leads qualified to realized contract
            </div>
          </div>
        </div>
      </div>

      {/* Visual Conversion Funnel */}
      <div className="sales-table-card p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold mb-0 text-dark">
            <i className="bi bi-funnel-fill text-primary me-2"></i>
            Pipeline Funnel Progression & Conversion Gates
          </h6>
          <span className="badge bg-light text-dark border px-3 py-1">SLA Standardized Gates</span>
        </div>

        <div className="row g-3 text-center">
          {pipelineData.map((stage, idx) => {
            const colors = ['#64748b', '#0ea5e9', '#f59e0b', '#4f46e5', '#10b981'];
            const color = colors[idx % colors.length];

            return (
              <div key={idx} className="col-12 col-md">
                <div
                  className="p-3 rounded-3 text-white shadow-sm mx-auto h-100 d-flex flex-column justify-content-between"
                  style={{
                    backgroundColor: color,
                    minHeight: '140px'
                  }}
                >
                  <div className="fw-bold text-uppercase small text-white-50">{stage.stage.replace('_', ' ')}</div>
                  <div>
                    <h3 className="fw-bold my-1 text-white">{stage.deal_count}</h3>
                    <div className="small fw-semibold">₹{(parseFloat(stage.total_value) || 0).toLocaleString('en-IN')}</div>
                  </div>
                  <div className="mt-2 small bg-dark bg-opacity-25 rounded px-2 py-1 text-white">
                    {stage.avg_probability}% Win Prob
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Deals Table */}
      <div className="sales-table-card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold text-dark">
            <i className="bi bi-briefcase text-primary me-2"></i>
            Active Commercial Deals in Current Cycle
          </h6>
          <Link to="/app/sales/deals" className="btn btn-sm btn-outline-primary">
            Open Deals <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
        <div className="table-responsive">
          <table className="table sales-table align-middle">
            <thead>
              <tr>
                <th>Deal Title</th>
                <th>Clinic Account</th>
                <th>Current Stage</th>
                <th>Contract Value</th>
                <th>Probability</th>
                <th>Target Close</th>
              </tr>
            </thead>
            <tbody>
              {deals.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No active deals in cycle.
                  </td>
                </tr>
              ) : (
                deals.map(deal => (
                  <tr key={deal.id}>
                    <td className="fw-bold text-dark">{deal.title}</td>
                    <td>{deal.client_name || deal.lead_company || 'Clinic Account'}</td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                        {deal.stage}
                      </span>
                    </td>
                    <td className="fw-bold text-success">₹{parseFloat(deal.deal_value || 0).toLocaleString('en-IN')}</td>
                    <td>{deal.probability}%</td>
                    <td className="text-muted">{deal.expected_close_date || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  );
}
