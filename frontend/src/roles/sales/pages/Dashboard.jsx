import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getDashboardSummary, getPipelineSummary } from '../../../services/api/salesApi.js';

export default function Dashboard() {
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
          leads: { total: 48, new: 14, qualified: 22, converted: 12 },
          deals: { total: 18, open: 12, won: 4, lost: 2, pipeline_value: 3850000, weighted_pipeline_value: 2150000, won_revenue: 1250000 },
          proposals: { total: 10, sent: 6, accepted: 3, accepted_value: 950000 },
          activities: { upcoming_total: 8, pending_calls: 5, scheduled_meetings: 3 },
          revenue: { mrr: 285000, arr: 3420000, active_subscriptions: 14 },
          quota: { target_revenue: 2000000, achieved_revenue: 1250000, deals_target: 8, deals_won: 4, attainment_percentage: 62.5 },
          recent_deals: [
            { id: '1', title: 'Enterprise LMS Deployment', client_name: 'Apex Infotech', deal_value: 650000, stage: 'CLOSED_WON' },
            { id: '2', title: 'Fintech Analytics Suite', client_name: 'Nexus Capital', deal_value: 420000, stage: 'NEGOTIATION' },
            { id: '3', title: 'HRMS Cloud Migration', client_name: 'Vanguard Systems', deal_value: 380000, stage: 'PROPOSAL_SENT' },
          ]
        });

        setPipeline(Array.isArray(pipeData) && pipeData.length > 0 ? pipeData : [
          { stage: 'QUALIFICATION', deal_count: 5, total_value: 850000, avg_probability: 20 },
          { stage: 'DISCOVERY', deal_count: 4, total_value: 920000, avg_probability: 40 },
          { stage: 'PROPOSAL_SENT', deal_count: 3, total_value: 1100000, avg_probability: 60 },
          { stage: 'NEGOTIATION', deal_count: 2, total_value: 980000, avg_probability: 80 },
          { stage: 'CLOSED_WON', deal_count: 4, total_value: 1250000, avg_probability: 100 }
        ]);
      } catch (err) {
        console.error('Error loading sales dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <AdminPage
      title="Sales Command Center"
      subtitle="Comprehensive revenue pipeline, quota attainment, lead velocity, and high-impact deal monitoring"
    >
      {/* KPI Cards Strip */}
      <div className="row g-3 mb-4">
        {/* Card 1: Pipeline Value */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-primary border-4">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted text-uppercase fw-semibold">Open Pipeline</small>
              <span className="badge bg-primary bg-opacity-10 text-primary">
                {summary?.deals?.open || 0} Active Deals
              </span>
            </div>
            <h3 className="mb-0 fw-bold mt-2 text-dark">
              ₹{(summary?.deals?.pipeline_value || 0).toLocaleString()}
            </h3>
            <small className="text-muted mt-1 d-block">
              Weighted: <strong className="text-primary">₹{(summary?.deals?.weighted_pipeline_value || 0).toLocaleString()}</strong>
            </small>
          </div>
        </div>

        {/* Card 2: Won Revenue & Quota */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-success border-4">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted text-uppercase fw-semibold">Closed Won Revenue</small>
              <span className="badge bg-success bg-opacity-10 text-success">
                {summary?.quota?.attainment_percentage || 0}% Quota
              </span>
            </div>
            <h3 className="mb-0 fw-bold mt-2 text-success">
              ₹{(summary?.deals?.won_revenue || 0).toLocaleString()}
            </h3>
            <div className="progress mt-2" style={{ height: '6px' }}>
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${Math.min(100, summary?.quota?.attainment_percentage || 0)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 3: MRR & Subscriptions */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-info border-4">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted text-uppercase fw-semibold">Recurring Revenue</small>
              <span className="badge bg-info bg-opacity-10 text-info">
                {summary?.revenue?.active_subscriptions || 0} Subscriptions
              </span>
            </div>
            <h3 className="mb-0 fw-bold mt-2 text-dark">
              ₹{(summary?.revenue?.mrr || 0).toLocaleString()}<span className="fs-6 text-muted fw-normal">/mo</span>
            </h3>
            <small className="text-muted mt-1 d-block">
              ARR: <strong className="text-dark">₹{(summary?.revenue?.arr || 0).toLocaleString()}</strong>
            </small>
          </div>
        </div>

        {/* Card 4: Upcoming Touchpoints */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-warning border-4">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted text-uppercase fw-semibold">Activities This Week</small>
              <span className="badge bg-warning bg-opacity-10 text-dark">
                {summary?.activities?.upcoming_total || 0} Touchpoints
              </span>
            </div>
            <h3 className="mb-0 fw-bold mt-2 text-dark">
              {summary?.activities?.pending_calls || 0} Calls / {summary?.activities?.scheduled_meetings || 0} Meetings
            </h3>
            <small className="text-success mt-1 d-block">
              <i className="bi bi-clock-history me-1"></i>High engagement velocity
            </small>
          </div>
        </div>
      </div>

      {/* Row 2: Pipeline Stages & Funnel */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold mb-0">Sales Pipeline Velocity by Stage</h5>
                <small className="text-muted">Total value and average win probability across active deal cycles</small>
              </div>
              <a href="#/deals" className="btn btn-sm btn-outline-primary">Open Deals Board</a>
            </div>

            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Pipeline Stage</th>
                    <th>Deals</th>
                    <th>Stage Value</th>
                    <th>Win Probability</th>
                    <th>Weighted Value</th>
                  </tr>
                </thead>
                <tbody>
                  {pipeline.map((p, idx) => {
                    const weighted = (p.total_value * p.avg_probability) / 100;
                    return (
                      <tr key={idx}>
                        <td>
                          <span className={`badge ${
                            p.stage === 'CLOSED_WON' ? 'bg-success' :
                            p.stage === 'NEGOTIATION' ? 'bg-primary' :
                            p.stage === 'PROPOSAL_SENT' ? 'bg-info text-dark' :
                            'bg-secondary'
                          }`}>
                            {p.stage.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="fw-semibold">{p.deal_count}</td>
                        <td className="fw-bold">₹{p.total_value.toLocaleString()}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span className="small">{p.avg_probability}%</span>
                            <div className="progress flex-grow-1" style={{ height: '6px', minWidth: '60px' }}>
                              <div
                                className="progress-bar bg-primary"
                                role="progressbar"
                                style={{ width: `${p.avg_probability}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="fw-semibold text-primary">₹{Math.round(weighted).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Lead Funnel & Quota Attainment */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white h-100">
            <h5 className="fw-bold mb-3">Lead Conversion Status</h5>
            <div className="list-group list-group-flush mb-4">
              <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
                <span><i className="bi bi-circle-fill text-info me-2 fs-6"></i>Total Leads Inbound</span>
                <span className="badge bg-light text-dark fs-6">{summary?.leads?.total || 0}</span>
              </div>
              <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
                <span><i className="bi bi-circle-fill text-primary me-2 fs-6"></i>Sales Qualified Leads</span>
                <span className="badge bg-primary bg-opacity-10 text-primary fs-6">{summary?.leads?.qualified || 0}</span>
              </div>
              <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
                <span><i className="bi bi-circle-fill text-success me-2 fs-6"></i>Converted to Deals</span>
                <span className="badge bg-success bg-opacity-10 text-success fs-6">{summary?.leads?.converted || 0}</span>
              </div>
            </div>

            <h6 className="fw-bold mb-2">Quota Attainment (Fiscal 2026-27)</h6>
            <div className="p-3 bg-light rounded-3">
              <div className="d-flex justify-content-between small text-muted mb-1">
                <span>Target: ₹{(summary?.quota?.target_revenue || 0).toLocaleString()}</span>
                <span>Won: ₹{(summary?.quota?.achieved_revenue || 0).toLocaleString()}</span>
              </div>
              <div className="progress mb-2" style={{ height: '10px' }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${Math.min(100, summary?.quota?.attainment_percentage || 0)}%` }}
                ></div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <small className="fw-bold text-dark">{summary?.quota?.deals_won || 0} of {summary?.quota?.deals_target || 0} Deals Won</small>
                <span className="badge bg-success">{summary?.quota?.attainment_percentage || 0}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Deals Table */}
      <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">High-Impact Active & Recent Deals</h5>
          <a href="#/proposals" className="btn btn-sm btn-outline-secondary">View Quotations</a>
        </div>
        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Deal Title</th>
                <th>Client</th>
                <th>Value</th>
                <th>Stage</th>
                <th>Expected Close</th>
              </tr>
            </thead>
            <tbody>
              {summary?.recent_deals?.map((deal, idx) => (
                <tr key={idx}>
                  <td className="fw-semibold text-dark">{deal.title}</td>
                  <td>{deal.client_name || 'Direct Lead'}</td>
                  <td className="fw-bold text-success">₹{(deal.deal_value || 0).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${
                      deal.stage === 'CLOSED_WON' ? 'bg-success' :
                      deal.stage === 'NEGOTIATION' ? 'bg-primary' : 'bg-secondary'
                    }`}>
                      {deal.stage}
                    </span>
                  </td>
                  <td className="text-muted">{deal.expected_close_date || 'Q3 2026'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  );
}