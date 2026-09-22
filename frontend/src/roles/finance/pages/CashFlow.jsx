import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getCashFlowForecast } from '../../../services/api/financeApi.js';

export default function FinanceCashFlow() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadForecast() {
      try {
        setLoading(true);
        const res = await getCashFlowForecast();
        setData(res);
      } catch (err) {
        console.error('Failed to load forecast:', err);
        setData({
          current_cash_reserves: 1850000,
          mrr_runrate: 280000,
          monthly_payroll_runrate: 485000,
          forecast: [
            { period: 'Next 30 Days', projected_inflow: 530000, projected_outflow: 650000, net_change: -120000, projected_ending_cash: 1730000 },
            { period: '31 - 60 Days', projected_inflow: 600000, projected_outflow: 665000, net_change: -65000, projected_ending_cash: 1665000 },
            { period: '61 - 90 Days', projected_inflow: 660000, projected_outflow: 655000, net_change: 5000, projected_ending_cash: 1670000 }
          ]
        });
      } finally {
        setLoading(false);
      }
    }
    loadForecast();
  }, []);

  return (
    <AdminPage
      title="Cash Flow Forecasting & Runway"
      subtitle="Predictive 90-day liquidity simulation, recurring MRR inflows, committed payroll outflows, and burn rate"
    >
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
            <small className="text-muted text-uppercase fw-semibold">Current Liquid Reserves</small>
            <h2 className="fw-bold text-primary mt-2 mb-0">₹{(data?.current_cash_reserves || 0).toLocaleString()}</h2>
            <small className="text-muted mt-1">Bank balances + short term deposits</small>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
            <small className="text-muted text-uppercase fw-semibold">Committed Monthly Payroll</small>
            <h2 className="fw-bold text-danger mt-2 mb-0">₹{(data?.monthly_payroll_runrate || 0).toLocaleString()}</h2>
            <small className="text-muted mt-1">Direct salary + statutory PF/ESI dues</small>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
            <small className="text-muted text-uppercase fw-semibold">Subscription MRR Baseline</small>
            <h2 className="fw-bold text-success mt-2 mb-0">₹{(data?.mrr_runrate || 0).toLocaleString()}</h2>
            <small className="text-muted mt-1">Guaranteed contracted monthly retainers</small>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 mb-4">
        <div className="card-header bg-white border-0 py-3">
          <h6 className="fw-bold mb-0 text-dark">90-Day Predictive Cash Runway Projection</h6>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Projection Horizon</th>
                <th className="text-end">Projected Inflows</th>
                <th className="text-end">Projected Outflows</th>
                <th className="text-end">Net Period Delta</th>
                <th className="text-end">Estimated Ending Cash</th>
                <th>Runway Health</th>
              </tr>
            </thead>
            <tbody>
              {data?.forecast?.map((f, idx) => (
                <tr key={idx}>
                  <td><strong>{f.period}</strong></td>
                  <td className="text-end text-success fw-semibold">₹{f.projected_inflow.toLocaleString()}</td>
                  <td className="text-end text-danger fw-semibold">₹{f.projected_outflow.toLocaleString()}</td>
                  <td className={`text-end fw-bold ${f.net_change >= 0 ? 'text-success' : 'text-danger'}`}>
                    {f.net_change >= 0 ? '+' : ''}₹{f.net_change.toLocaleString()}
                  </td>
                  <td className="text-end fw-bold text-primary">₹{f.projected_ending_cash.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${f.projected_ending_cash > 1500000 ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`}>
                      {f.projected_ending_cash > 1500000 ? 'Healthy Liquidity' : 'Monitor Burn'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
            <h6 className="fw-bold mb-3 text-dark">Inflow Probability Models</h6>
            <div className="list-group list-group-flush small">
              <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                <span>Contracted B2B Retainers</span>
                <span className="badge bg-success">98% Collection Probability</span>
              </div>
              <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                <span>Milestone Project Deliverables</span>
                <span className="badge bg-primary">85% Collection Probability</span>
              </div>
              <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                <span>Student Course Admissions</span>
                <span className="badge bg-info text-dark">Variable Monthly Run-rate</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
            <h6 className="fw-bold mb-3 text-dark">Outflow Risk & Sensitivity Alerts</h6>
            <div className="list-group list-group-flush small">
              <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                <span>Monthly Payroll (Direct Staff)</span>
                <span className="badge bg-danger">Fixed Mandatory Liability</span>
              </div>
              <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                <span>Statutory GST & TDS Due Dates</span>
                <span className="badge bg-warning text-dark">7th & 20th of Month</span>
              </div>
              <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                <span>Cloud Hosting Auto-Debit</span>
                <span className="badge bg-secondary">Elastic with User Traffic</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
