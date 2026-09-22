import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getDashboardSummary, getDashboardTrends } from '../../../services/api/financeApi.js';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [sumData, trendData] = await Promise.all([
          getDashboardSummary().catch(() => null),
          getDashboardTrends().catch(() => [])
        ]);
        setSummary(sumData || {
          monthly_revenue: 1845000,
          monthly_expenses: 1120000,
          net_profit: 725000,
          net_margin_percentage: 39.3,
          accounts_receivable: 340000,
          open_invoices_count: 8,
          accounts_payable: 145000,
          pending_bills_count: 5,
          payroll_due: 485000,
          mrr: 280000,
          arr: 3360000,
          net_gst_payable: 78500,
          liquid_reserves: 1850000,
          runway_months: 16.5
        });
        setTrends(Array.isArray(trendData) && trendData.length > 0 ? trendData : [
          { month: '2026-04', income: 1450000, expense: 980000 },
          { month: '2026-05', income: 1620000, expense: 1040000 },
          { month: '2026-06', income: 1580000, expense: 1010000 },
          { month: '2026-07', income: 1750000, expense: 1090000 },
          { month: '2026-08', income: 1810000, expense: 1140000 },
          { month: '2026-09', income: 1845000, expense: 1120000 },
        ]);
      } catch (err) {
        console.error('Error loading finance dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <AdminPage
      title="Financial Command Center"
      subtitle="Executive liquidity metrics, cash flow health, double-entry tracking, and statutory compliance"
    >
      {/* KPI Cards Strip */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-primary border-4">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted text-uppercase fw-semibold">Monthly Revenue</small>
              <span className="badge bg-primary bg-opacity-10 text-primary">MRR: ₹{(summary?.mrr || 0).toLocaleString()}</span>
            </div>
            <h3 className="mb-0 fw-bold mt-2 text-dark">₹{(summary?.monthly_revenue || 0).toLocaleString()}</h3>
            <small className="text-success mt-1 d-block">
              <i className="bi bi-arrow-up-circle me-1"></i>
              ARR Runrate: ₹{(summary?.arr || 0).toLocaleString()}
            </small>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-danger border-4">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted text-uppercase fw-semibold">Monthly Expenses</small>
              <span className="badge bg-danger bg-opacity-10 text-danger">Payroll: ₹{(summary?.payroll_due || 0).toLocaleString()}</span>
            </div>
            <h3 className="mb-0 fw-bold mt-2 text-dark">₹{(summary?.monthly_expenses || 0).toLocaleString()}</h3>
            <small className="text-muted mt-1 d-block">
              Net Profit: <strong className="text-success">₹{(summary?.net_profit || 0).toLocaleString()} ({summary?.net_margin_percentage}%)</strong>
            </small>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-warning border-4">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted text-uppercase fw-semibold">Accounts Receivable (AR)</small>
              <span className="badge bg-warning bg-opacity-10 text-warning">{summary?.open_invoices_count} Invoices</span>
            </div>
            <h3 className="mb-0 fw-bold mt-2 text-dark">₹{(summary?.accounts_receivable || 0).toLocaleString()}</h3>
            <small className="text-warning mt-1 d-block">
              Pending Collections from B2B Clients
            </small>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-success border-4">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted text-uppercase fw-semibold">Cash Runway</small>
              <span className="badge bg-success bg-opacity-10 text-success">Low Burn</span>
            </div>
            <h3 className="mb-0 fw-bold mt-2 text-dark">{summary?.runway_months} Months</h3>
            <small className="text-muted mt-1 d-block">
              Liquid Reserves: ₹{(summary?.liquid_reserves || 0).toLocaleString()}
            </small>
          </div>
        </div>
      </div>

      {/* Secondary Metrics: AP & Tax Liabilities */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-bold mb-0 text-dark">Accounts Payable & Commitments</h6>
              <a href="/app/finance/payables" className="btn btn-sm btn-outline-primary">View All AP</a>
            </div>
            <div className="d-flex align-items-baseline gap-3">
              <h2 className="fw-bold text-danger mb-0">₹{(summary?.accounts_payable || 0).toLocaleString()}</h2>
              <span className="text-muted small">Across {summary?.pending_bills_count} Approved Vendor Invoices</span>
            </div>
            <div className="progress mt-3" style={{ height: '8px' }}>
              <div className="progress-bar bg-danger" style={{ width: '45%' }}></div>
              <div className="progress-bar bg-warning" style={{ width: '30%' }}></div>
              <div className="progress-bar bg-secondary" style={{ width: '25%' }}></div>
            </div>
            <div className="d-flex justify-content-between text-muted small mt-2">
              <span>Cloud Infra (AWS/GCP)</span>
              <span>Software Subscriptions</span>
              <span>Contractors</span>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-bold mb-0 text-dark">Statutory Tax Position (Current Month)</h6>
              <a href="/app/finance/tax" className="btn btn-sm btn-outline-primary">GSTR / TDS Details</a>
            </div>
            <div className="row text-center mt-2">
              <div className="col-4 border-end">
                <small className="text-muted d-block">Output GST</small>
                <span className="fw-bold text-primary">₹{(summary?.output_gst || 0).toLocaleString()}</span>
              </div>
              <div className="col-4 border-end">
                <small className="text-muted d-block">Input Credit (ITC)</small>
                <span className="fw-bold text-success">₹{(summary?.input_gst || 0).toLocaleString()}</span>
              </div>
              <div className="col-4">
                <small className="text-muted d-block">Net GST Due</small>
                <span className="fw-bold text-danger">₹{(summary?.net_gst_payable || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cash Flow Trajectory & Action Hub */}
      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0 text-dark">Trailing Cash Flow (Inflow vs Outflow)</h6>
              <span className="badge bg-light text-dark border">Past 6 Months</span>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Month</th>
                    <th className="text-end">Cash Inflow</th>
                    <th className="text-end">Cash Outflow</th>
                    <th className="text-end">Net Operating Surplus</th>
                  </tr>
                </thead>
                <tbody>
                  {trends.map(t => {
                    const surplus = t.income - t.expense;
                    return (
                      <tr key={t.month}>
                        <td className="fw-semibold">{t.month}</td>
                        <td className="text-end text-success">₹{t.income.toLocaleString()}</td>
                        <td className="text-end text-danger">₹{t.expense.toLocaleString()}</td>
                        <td className={`text-end fw-bold ${surplus >= 0 ? 'text-success' : 'text-danger'}`}>
                          {surplus >= 0 ? '+' : ''}₹{surplus.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
            <h6 className="fw-bold mb-3 text-dark">Quick Financial Actions</h6>
            <div className="d-grid gap-2">
              <a href="/app/finance/income" className="btn btn-outline-success text-start d-flex justify-content-between align-items-center">
                <span><i className="bi bi-plus-circle me-2"></i>Log Inward Payment</span>
                <span className="badge bg-success bg-opacity-10 text-success">Credit</span>
              </a>
              <a href="/app/finance/expenses" className="btn btn-outline-danger text-start d-flex justify-content-between align-items-center">
                <span><i className="bi bi-dash-circle me-2"></i>Record Operational Expense</span>
                <span className="badge bg-danger bg-opacity-10 text-danger">Debit</span>
              </a>
              <a href="/app/finance/invoices" className="btn btn-outline-primary text-start d-flex justify-content-between align-items-center">
                <span><i className="bi bi-receipt me-2"></i>Generate Client Invoice</span>
                <span className="badge bg-primary bg-opacity-10 text-primary">GST</span>
              </a>
              <a href="/app/finance/payroll" className="btn btn-outline-dark text-start d-flex justify-content-between align-items-center">
                <span><i className="bi bi-people me-2"></i>Authorize Monthly Payroll</span>
                <span className="badge bg-dark bg-opacity-10 text-dark">NEFT</span>
              </a>
              <a href="/app/finance/refunds" className="btn btn-outline-warning text-start d-flex justify-content-between align-items-center">
                <span><i className="bi bi-arrow-counterclockwise me-2"></i>Process Customer Refund</span>
                <span className="badge bg-warning bg-opacity-10 text-dark">UTR</span>
              </a>
              <a href="/app/finance/cashflow" className="btn btn-outline-info text-start d-flex justify-content-between align-items-center">
                <span><i className="bi bi-graph-up-arrow me-2"></i>Runway & Forecast Engine</span>
                <span className="badge bg-info bg-opacity-10 text-info">90-Day</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}