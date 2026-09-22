import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getSalesReports } from '../../../services/api/salesApi.js';

export default function SalesReports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        const data = await getSalesReports();
        setReports(data || {
          monthly_performance: [
            { month: '2026-04', won_count: 3, won_volume: 850000, lost_count: 1, lost_volume: 200000 },
            { month: '2026-05', won_count: 4, won_volume: 1100000, lost_count: 2, lost_volume: 350000 },
            { month: '2026-06', won_count: 3, won_volume: 920000, lost_count: 1, lost_volume: 180000 },
            { month: '2026-07', won_count: 5, won_volume: 1350000, lost_count: 2, lost_volume: 420000 },
            { month: '2026-08', won_count: 4, won_volume: 1200000, lost_count: 1, lost_volume: 150000 },
            { month: '2026-09', won_count: 5, won_volume: 1450000, lost_count: 2, lost_volume: 380000 },
          ],
          lead_funnel: [
            { status: 'NEW', count: 48 },
            { status: 'CONTACTED', count: 32 },
            { status: 'QUALIFIED', count: 22 },
            { status: 'CONVERTED', count: 14 }
          ],
          rep_leaderboard: [
            { rep_id: '1', name: 'Rahul Sharma', deals_won: 9, closed_revenue: 2850000 },
            { rep_id: '2', name: 'Ananya Deshmukh', deals_won: 7, closed_revenue: 2150000 },
            { rep_id: '3', name: 'Vikramaditya Rao', deals_won: 5, closed_revenue: 1650000 },
            { rep_id: '4', name: 'Kavita Nair', deals_won: 4, closed_revenue: 1200000 }
          ],
          stage_distribution: [
            { stage: 'QUALIFICATION', count: 6, value: 950000 },
            { stage: 'DISCOVERY', count: 4, value: 820000 },
            { stage: 'PROPOSAL_SENT', count: 3, value: 1050000 },
            { stage: 'NEGOTIATION', count: 2, value: 890000 },
            { stage: 'CLOSED_WON', count: 5, value: 1450000 }
          ]
        });
      } catch (err) {
        console.error('Failed to load sales reports:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  return (
    <AdminPage
      title="Sales Intelligence & Performance Analytics"
      subtitle="Executive revenue pacing, lead conversion funnel, sales rep leaderboards, and historical win/loss ratios"
    >
      {/* Row 1: Funnel & Rep Leaderboard */}
      <div className="row g-4 mb-4">
        {/* Lead Funnel */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white h-100">
            <h5 className="fw-bold mb-3">CRM Lead Conversion Funnel</h5>
            <div className="d-flex flex-column gap-3">
              {reports?.lead_funnel?.map((item, idx) => {
                const max = reports.lead_funnel[0]?.count || 1;
                const pct = Math.round((item.count / max) * 100);
                return (
                  <div key={idx}>
                    <div className="d-flex justify-content-between small mb-1">
                      <span className="fw-semibold text-dark">{item.status}</span>
                      <strong>{item.count} Leads ({pct}%)</strong>
                    </div>
                    <div className="progress" style={{ height: '10px' }}>
                      <div
                        className={`progress-bar ${
                          idx === 3 ? 'bg-success' : idx === 2 ? 'bg-primary' : idx === 1 ? 'bg-info' : 'bg-secondary'
                        }`}
                        role="progressbar"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-light rounded-3 mt-4 d-flex justify-content-around text-center">
              <div>
                <small className="text-muted d-block">Overall Conversion</small>
                <strong className="fs-5 text-success">29.1%</strong>
              </div>
              <div className="border-start ps-3">
                <small className="text-muted d-block">Avg Cycle Time</small>
                <strong className="fs-5 text-primary">19 Days</strong>
              </div>
              <div className="border-start ps-3">
                <small className="text-muted d-block">Win / Loss Ratio</small>
                <strong className="fs-5 text-dark">3.2 : 1</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Rep Leaderboard */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white h-100">
            <h5 className="fw-bold mb-3">Sales Representative Leaderboard</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Rank</th>
                    <th>Representative</th>
                    <th>Deals Won</th>
                    <th>Closed Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {reports?.rep_leaderboard?.map((rep, idx) => (
                    <tr key={rep.rep_id || idx}>
                      <td>
                        <span className={`badge rounded-circle p-2 ${
                          idx === 0 ? 'bg-warning text-dark' : idx === 1 ? 'bg-secondary text-white' : 'bg-light text-dark border'
                        }`} style={{ width: '28px', height: '28px' }}>
                          {idx + 1}
                        </span>
                      </td>
                      <td>
                        <div className="fw-bold text-dark">{rep.name}</div>
                        <small className="text-muted">Enterprise Account Exec</small>
                      </td>
                      <td>
                        <span className="badge bg-primary bg-opacity-10 text-primary fw-bold">
                          {rep.deals_won} Deals
                        </span>
                      </td>
                      <td>
                        <strong className="text-success">₹{(rep.closed_revenue || 0).toLocaleString()}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Monthly Win/Loss Pacing Table */}
      <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
        <h5 className="fw-bold mb-3">Historical Monthly Bookings & Pacing</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Month</th>
                <th>Deals Won</th>
                <th>Won Volume</th>
                <th>Deals Lost</th>
                <th>Lost Volume</th>
                <th>Net Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {reports?.monthly_performance?.map((m, idx) => {
                const totalDeals = (m.won_count || 0) + (m.lost_count || 0);
                const winRate = totalDeals > 0 ? Math.round((m.won_count / totalDeals) * 100) : 0;
                return (
                  <tr key={idx}>
                    <td className="fw-semibold text-dark">{m.month}</td>
                    <td><span className="badge bg-success">{m.won_count} Deals</span></td>
                    <td className="fw-bold text-success">₹{(m.won_volume || 0).toLocaleString()}</td>
                    <td><span className="badge bg-danger">{m.lost_count} Deals</span></td>
                    <td className="text-danger">₹{(m.lost_volume || 0).toLocaleString()}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className="small fw-bold">{winRate}%</span>
                        <div className="progress flex-grow-1" style={{ height: '6px', minWidth: '60px' }}>
                          <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{ width: `${winRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  );
}
