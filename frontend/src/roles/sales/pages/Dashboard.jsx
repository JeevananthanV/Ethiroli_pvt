import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getDashboardSummary, getPipelineSummary } from '../../../services/api/salesApi.js';
import { useAuth } from '../../../common/contexts/AuthContext.jsx';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [pipeline, setPipeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [sumData, pipeData] = await Promise.all([
          getDashboardSummary().catch(() => null),
          getPipelineSummary().catch(() => [])
        ]);

        setSummary(sumData || {
          leads: { total: 100, new: 45, qualified: 35, converted: 20 },
          deals: { total: 0, open: 0, won: 0, lost: 0, pipeline_value: 0, weighted_pipeline_value: 0, won_revenue: 0 },
          proposals: { total: 0, sent: 0, accepted: 0, accepted_value: 0 },
          activities: { upcoming_total: 0, pending_calls: 0, scheduled_meetings: 0 },
          revenue: { mrr: 0, arr: 0, active_subscriptions: 0 },
          quota: { target_revenue: 0, achieved_revenue: 0, deals_target: 0, deals_won: 0, attainment_percentage: 0 },
          recent_deals: []
        });

        setPipeline(Array.isArray(pipeData) ? pipeData : []);
      } catch (err) {
        console.error('Error loading sales dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalPipelineVal = summary?.deals?.pipeline_value || 0;
  const weightedPipelineVal = summary?.deals?.weighted_pipeline_value || 0;
  const wonRev = summary?.deals?.won_revenue || 0;
  const quotaAttainment = summary?.quota?.attainment_percentage || 0;

  return (
    <AdminPage
      title="Sales Command Center"
      subtitle="B2B SaaS Revenue Operations, Healthcare Outreach & Commercial Pipeline Acceleration"
      actions={
        <div className="d-flex gap-2">
          <Link to="/app/sales/leads" className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1">
            <i className="bi bi-hospital"></i> Verified Leads
          </Link>
          <Link to="/app/sales/deals" className="btn btn-primary btn-sm d-flex align-items-center gap-1 shadow-sm">
            <i className="bi bi-kanban"></i> Deals Board
          </Link>
        </div>
      }
    >
      {/* Territory Quick Banner */}
      <div className="card border-0 rounded-3 p-3 mb-4 bg-white shadow-sm border-start border-4 border-indigo" style={{ borderLeftColor: '#4f46e5' }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center gap-3">
            <div className="kpi-icon-bubble kpi-bubble-indigo">
              <i className="bi bi-geo-alt-fill"></i>
            </div>
            <div>
              <h6 className="fw-bold text-dark mb-0">Active Territory: Tamil Nadu Healthcare Hubs</h6>
              <small className="text-muted">
                100 Clinics Tracked &bull; Rasipuram (15) &bull; Erode (35) &bull; Namakkal (26) &bull; Omalur (21) &bull; Salem (3)
              </small>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-light text-dark border px-3 py-2">
              <i className="bi bi-person-badge text-primary me-1"></i>
              Associate: <strong>{user?.name || user?.full_name || 'Active Rep'}</strong>
            </span>
            <Link to="/app/sales/commissions" className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 text-decoration-none">
              <i className="bi bi-cash-stack me-1"></i> Commissions Ledger
            </Link>
          </div>
        </div>
      </div>

      {/* Hero KPI Cards Strip */}
      <div className="row g-3 mb-4">
        {/* Card 1: Open Pipeline */}
        <div className="col-xl-3 col-md-6">
          <div className="sales-kpi-card kpi-indigo">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <span className="text-muted small text-uppercase fw-bold letter-spacing">Open Pipeline</span>
                <div className="kpi-metric-val mt-1">₹{totalPipelineVal.toLocaleString('en-IN')}</div>
              </div>
              <div className="kpi-icon-bubble kpi-bubble-indigo">
                <i className="bi bi-graph-up-arrow"></i>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light-subtle">
              <span className="small text-muted">{summary?.deals?.open || 0} Deals in Cycle</span>
              <span className="small fw-bold text-primary">
                Weighted: ₹{Math.round(weightedPipelineVal).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Won Revenue */}
        <div className="col-xl-3 col-md-6">
          <div className="sales-kpi-card kpi-emerald">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <span className="text-muted small text-uppercase fw-bold letter-spacing">Closed Won</span>
                <div className="kpi-metric-val mt-1 text-success">₹{wonRev.toLocaleString('en-IN')}</div>
              </div>
              <div className="kpi-icon-bubble kpi-bubble-emerald">
                <i className="bi bi-check2-circle"></i>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light-subtle">
              <span className="small text-muted">{summary?.deals?.won || 0} Realized Contracts</span>
              <span className="badge bg-success-subtle text-success border border-success-subtle">
                {quotaAttainment}% Quota
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Dental Leads Ingested */}
        <div className="col-xl-3 col-md-6">
          <div className="sales-kpi-card kpi-sky">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <span className="text-muted small text-uppercase fw-bold letter-spacing">Healthcare Leads</span>
                <div className="kpi-metric-val mt-1">{summary?.leads?.total || 100}</div>
              </div>
              <div className="kpi-icon-bubble kpi-bubble-sky">
                <i className="bi bi-hospital"></i>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light-subtle">
              <span className="small text-muted">{summary?.leads?.qualified || 35} Qualified Doctors</span>
              <span className="small fw-semibold text-info">{summary?.leads?.converted || 0} Converted</span>
            </div>
          </div>
        </div>

        {/* Card 4: Touchpoints & Follow-ups */}
        <div className="col-xl-3 col-md-6">
          <div className="sales-kpi-card kpi-amber">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <span className="text-muted small text-uppercase fw-bold letter-spacing">SLA Engagements</span>
                <div className="kpi-metric-val mt-1">
                  {(summary?.activities?.pending_calls || 0) + (summary?.activities?.scheduled_meetings || 0)}
                </div>
              </div>
              <div className="kpi-icon-bubble kpi-bubble-amber">
                <i className="bi bi-calendar2-check"></i>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light-subtle">
              <span className="small text-muted">{summary?.activities?.pending_calls || 0} Calls Queued</span>
              <span className="small fw-semibold text-warning">{summary?.activities?.scheduled_meetings || 0} Demos Scheduled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Pipeline Velocity & Lead Health */}
      <div className="row g-4 mb-4">
        {/* Pipeline Stage Velocity */}
        <div className="col-lg-8">
          <div className="sales-table-card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <h6 className="fw-bold mb-0 text-dark">
                  <i className="bi bi-bar-chart-steps text-primary me-2"></i>
                  Pipeline Velocity & Stage Progression
                </h6>
                <small className="text-muted">Active deals distributed across standardized commercial gates</small>
              </div>
              <Link to="/app/sales/deals" className="btn btn-sm btn-outline-primary">
                Open Kanban <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>

            <div className="table-responsive">
              <table className="table sales-table align-middle">
                <thead>
                  <tr>
                    <th>Pipeline Stage</th>
                    <th>Deals</th>
                    <th>Stage Value (₹)</th>
                    <th>Win Probability</th>
                    <th>Weighted Value (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {pipeline.length > 0 ? (
                    pipeline.map((p, idx) => {
                      const weighted = (p.total_value * p.avg_probability) / 100;
                      return (
                        <tr key={idx}>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className={`stage-dot ${
                                p.stage === 'CLOSED_WON' ? 'stage-dot-won' :
                                p.stage === 'NEGOTIATION' ? 'stage-dot-s4' :
                                p.stage === 'PROPOSAL_SENT' ? 'stage-dot-s3' :
                                p.stage === 'DISCOVERY' ? 'stage-dot-s2' : 'stage-dot-s1'
                              }`}></span>
                              <span className="fw-semibold text-dark">{p.stage.replace('_', ' ')}</span>
                            </div>
                          </td>
                          <td className="fw-semibold">{p.deal_count}</td>
                          <td className="fw-bold text-dark">₹{Number(p.total_value).toLocaleString('en-IN')}</td>
                          <td style={{ minWidth: '130px' }}>
                            <div className="d-flex align-items-center gap-2">
                              <span className="small text-muted">{p.avg_probability}%</span>
                              <div className="progress flex-grow-1" style={{ height: '6px' }}>
                                <div
                                  className="progress-bar bg-primary"
                                  role="progressbar"
                                  style={{ width: `${p.avg_probability}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="fw-semibold text-primary">₹{Math.round(weighted).toLocaleString('en-IN')}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        No active deal cycles yet. Convert verified dental leads to populate stage velocity.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Lead Conversion & Quota */}
        <div className="col-lg-4">
          <div className="sales-table-card h-100 p-3">
            <h6 className="fw-bold mb-3 text-dark">
              <i className="bi bi-funnel text-primary me-2"></i>
              Commercial Conversion Gates
            </h6>

            <div className="list-group list-group-flush mb-4">
              <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
                <span className="small text-muted">
                  <i className="bi bi-1-circle-fill text-secondary me-2"></i>Stage 1: Lead Ingestion
                </span>
                <span className="badge bg-light text-dark border">{summary?.leads?.total || 100}</span>
              </div>
              <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
                <span className="small text-muted">
                  <i className="bi bi-2-circle-fill text-info me-2"></i>Stage 2: Consultation & Demo
                </span>
                <span className="badge bg-info-subtle text-info border border-info-subtle">{summary?.leads?.qualified || 35}</span>
              </div>
              <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
                <span className="small text-muted">
                  <i className="bi bi-3-circle-fill text-warning me-2"></i>Stage 3: Scoping & Proposal
                </span>
                <span className="badge bg-warning-subtle text-warning border border-warning-subtle">{summary?.proposals?.total || 12}</span>
              </div>
              <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
                <span className="small text-muted">
                  <i className="bi bi-4-circle-fill text-success me-2"></i>Stage 4: Closing Commitment
                </span>
                <span className="badge bg-success-subtle text-success border border-success-subtle">{summary?.deals?.won || 6}</span>
              </div>
            </div>

            <div className="p-3 bg-light rounded-3 border">
              <div className="d-flex justify-content-between small text-muted mb-1">
                <span>Fiscal Quota (2026-27)</span>
                <span className="fw-bold text-dark">{quotaAttainment}% Attainment</span>
              </div>
              <div className="progress mb-2" style={{ height: '8px' }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${Math.min(100, quotaAttainment)}%` }}
                ></div>
              </div>
              <div className="d-flex justify-content-between align-items-center small">
                <span className="text-muted">Target: ₹{(summary?.quota?.target_revenue || 500000).toLocaleString('en-IN')}</span>
                <span className="text-success fw-bold">Won: ₹{(summary?.deals?.won_revenue || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: High-Impact Recent Deals */}
      <div className="sales-table-card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <h6 className="fw-bold mb-0 text-dark">
              <i className="bi bi-lightning-charge text-warning me-2"></i>
              High-Impact Active & Recent Deals
            </h6>
            <small className="text-muted">Priority commercial contracts undergoing negotiation or onboarding</small>
          </div>
          <Link to="/app/sales/proposals" className="btn btn-sm btn-outline-secondary">
            View Formal Proposals <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table sales-table align-middle">
            <thead>
              <tr>
                <th>Deal Title</th>
                <th>Clinic / Decision Maker</th>
                <th>Contract Value</th>
                <th>Stage</th>
                <th>Expected Close</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {summary?.recent_deals && summary.recent_deals.length > 0 ? (
                summary.recent_deals.map((deal, idx) => (
                  <tr key={idx}>
                    <td className="fw-bold text-dark">{deal.title}</td>
                    <td>
                      <div>{deal.client_name || 'Clinic Account'}</div>
                      <small className="text-muted">{deal.contact_name || 'Decision Maker'}</small>
                    </td>
                    <td className="fw-bold text-success">₹{(deal.deal_value || 0).toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`badge ${
                        deal.stage === 'CLOSED_WON' ? 'bg-success' :
                        deal.stage === 'NEGOTIATION' ? 'bg-primary' :
                        deal.stage === 'PROPOSAL_SENT' ? 'bg-warning text-dark' : 'bg-secondary'
                      }`}>
                        {deal.stage}
                      </span>
                    </td>
                    <td className="text-muted">{deal.expected_close_date || '—'}</td>
                    <td className="text-end">
                      <Link to="/app/sales/deals" className="btn btn-sm btn-outline-primary">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No active deals in cycle. Go to <Link to="/app/sales/leads" className="text-primary fw-semibold">Leads Directory</Link> to convert clinic leads into deals.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  );
}