import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getDeals, updateDealStage } from '../../../services/api/salesApi.js';

export default function SalesOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStage, setFilterStage] = useState('');

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      const res = await getDeals({ stage: filterStage || undefined });
      const items = res?.items || (Array.isArray(res) ? res : []);
      if (items.length > 0) {
        setOpportunities(items.filter(d => !['CLOSED_LOST'].includes(d.stage)));
      } else {
        setOpportunities([
          { id: '1', title: 'Enterprise Training License - 50 Seats', client_name: 'Zenith Tech', deal_value: 350000, probability: 80, stage: 'PROPOSAL_SENT', expected_close_date: '2026-09-30', contact_name: 'Vikramaditya Rao' },
          { id: '2', title: 'College Campus LMS Integration', client_name: 'EduGlobal Institute', deal_value: 600000, probability: 60, stage: 'DISCOVERY', expected_close_date: '2026-10-15', contact_name: 'Priya Sundaram' },
          { id: '3', title: 'Corporate Upskilling Cohort', client_name: 'Quantum Labs', deal_value: 220000, probability: 90, stage: 'NEGOTIATION', expected_close_date: '2026-09-20', contact_name: 'Rohan Mehra' },
          { id: '4', title: 'Fintech Automated Compliance Engine', client_name: 'Apex Infotech', deal_value: 850000, probability: 40, stage: 'QUALIFICATION', expected_close_date: '2026-11-01', contact_name: 'Siddharth Roy' }
        ]);
      }
    } catch (err) {
      console.error('Failed to load opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, [filterStage]);

  const handleAdvanceStage = async (id, currentStage) => {
    const stageFlow = {
      QUALIFICATION: 'DISCOVERY',
      DISCOVERY: 'PROPOSAL_SENT',
      PROPOSAL_SENT: 'NEGOTIATION',
      NEGOTIATION: 'CLOSED_WON'
    };
    const next = stageFlow[currentStage];
    if (!next) return;

    try {
      await updateDealStage(id, next);
      loadOpportunities();
    } catch (err) {
      alert('Failed to advance stage: ' + err.message);
    }
  };

  const totalValue = opportunities.reduce((acc, o) => acc + (parseFloat(o.deal_value) || 0), 0);
  const weightedValue = opportunities.reduce((acc, o) => acc + ((parseFloat(o.deal_value) || 0) * (parseInt(o.probability) || 0) / 100), 0);

  return (
    <AdminPage
      title="Sales Opportunities Pipeline"
      subtitle="Track qualified buyer opportunities, dynamic win probabilities, expected close dates, and stage progression"
      actions={
        <a href="#/deals" className="btn btn-primary">
          <i className="bi bi-kanban me-1"></i> Open Kanban Board
        </a>
      }
    >
      {/* Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-primary border-4">
            <small className="text-uppercase fw-semibold text-muted">Total Opportunity Pipeline</small>
            <h3 className="mb-0 fw-bold mt-1 text-primary">₹{Math.round(totalValue).toLocaleString()}</h3>
            <small className="text-muted">{opportunities.length} Active Opportunities</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-success border-4">
            <small className="text-uppercase fw-semibold text-muted">Probability Weighted Value</small>
            <h3 className="mb-0 fw-bold mt-1 text-success">₹{Math.round(weightedValue).toLocaleString()}</h3>
            <small className="text-success"><i className="bi bi-graph-up-arrow me-1"></i>Risk-adjusted revenue forecast</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-info border-4">
            <small className="text-uppercase fw-semibold text-muted">Average Deal Size</small>
            <h3 className="mb-0 fw-bold mt-1 text-dark">
              ₹{opportunities.length > 0 ? Math.round(totalValue / opportunities.length).toLocaleString() : 0}
            </h3>
            <small className="text-muted">Per active opportunity</small>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 bg-white">
        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold">Active Opportunities</h6>
          <div style={{ width: '220px' }}>
            <select
              className="form-select form-select-sm"
              value={filterStage}
              onChange={e => setFilterStage(e.target.value)}
            >
              <option value="">All Active Stages</option>
              <option value="QUALIFICATION">Qualification</option>
              <option value="DISCOVERY">Discovery</option>
              <option value="PROPOSAL_SENT">Proposal Sent</option>
              <option value="NEGOTIATION">Negotiation</option>
              <option value="CLOSED_WON">Closed Won</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Opportunity Title</th>
                <th>Target Account</th>
                <th>Deal Value</th>
                <th>Current Stage</th>
                <th>Win Probability</th>
                <th>Expected Close</th>
                <th className="text-end">Stage Transition</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-4">Loading opportunities...</td></tr>
              ) : opportunities.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-4 text-muted">No opportunities found.</td></tr>
              ) : (
                opportunities.map(opp => (
                  <tr key={opp.id}>
                    <td>
                      <div className="fw-semibold text-dark">{opp.title}</div>
                      <small className="text-muted">{opp.contact_name || 'Buyer'}</small>
                    </td>
                    <td>{opp.client_name || opp.lead_company || 'Corporate Client'}</td>
                    <td><strong className="text-dark">₹{parseFloat(opp.deal_value || 0).toLocaleString()}</strong></td>
                    <td>
                      <span className={`badge ${
                        opp.stage === 'CLOSED_WON' ? 'bg-success' :
                        opp.stage === 'NEGOTIATION' ? 'bg-primary' :
                        opp.stage === 'PROPOSAL_SENT' ? 'bg-info text-dark' : 'bg-secondary'
                      }`}>
                        {opp.stage.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className="small fw-bold">{opp.probability}%</span>
                        <div className="progress flex-grow-1" style={{ height: '6px', minWidth: '50px' }}>
                          <div
                            className="progress-bar bg-primary"
                            role="progressbar"
                            style={{ width: `${opp.probability}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="text-muted">{opp.expected_close_date || 'Q3 2026'}</td>
                    <td className="text-end">
                      {opp.stage !== 'CLOSED_WON' ? (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleAdvanceStage(opp.id, opp.stage)}
                        >
                          Advance <i className="bi bi-chevron-right ms-1"></i>
                        </button>
                      ) : (
                        <span className="badge bg-success bg-opacity-10 text-success py-2 px-3">
                          <i className="bi bi-check-circle-fill me-1"></i>Won
                        </span>
                      )}
                    </td>
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
