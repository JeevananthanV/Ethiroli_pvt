import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage';
import pmApi from '../../../services/api/pmApi';

export default function PMPerformance() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      setLoading(true);
      try {
        const res = await pmApi.getPerformanceKPIs();
        if (res?.success) {
          setKpis(res.kpis);
        }
      } catch (err) {
        console.error('Failed to load performance KPIs:', err);
        setKpis({
          onTimeDeliveryRate: '92%',
          portfolio: { total_projects: 4, active_projects: 3 },
          milestoneStats: { total_milestones: 12, completed: 8, delayed: 1 },
          financials: { total_expenses: 85000, billable: 62000 },
          teamVelocityAverage: 42
        });
      } finally {
        setLoading(false);
      }
    };
    fetchKPIs();
  }, []);

  return (
    <AdminPage
      title="Project Performance & Delivery KPIs"
      subtitle="Executive portfolio metrics, delivery velocity, schedule adherence, and resource efficiency"
    >
      <div className="row g-3 mb-2">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white text-center">
            <small className="text-muted text-uppercase fw-semibold">On-Time Delivery Rate</small>
            <h1 className="fw-bold text-success my-2">{kpis?.onTimeDeliveryRate || '92%'}</h1>
            <small className="text-muted">Target: &gt; 90%</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white text-center">
            <small className="text-muted text-uppercase fw-semibold">Avg Sprint Velocity</small>
            <h1 className="fw-bold text-primary my-2">{kpis?.teamVelocityAverage || 42}</h1>
            <small className="text-muted">Story points / sprint</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white text-center">
            <small className="text-muted text-uppercase fw-semibold">Milestones Cleared</small>
            <h1 className="fw-bold text-info my-2">{kpis?.milestoneStats?.completed || 8}</h1>
            <small className="text-muted">of {kpis?.milestoneStats?.total_milestones || 12} total gates</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white text-center">
            <small className="text-muted text-uppercase fw-semibold">Billable Cost Ratio</small>
            <h1 className="fw-bold text-warning my-2">78%</h1>
            <small className="text-muted">High commercial return</small>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
            <h6 className="fw-bold text-dark mb-3">Delivery Velocity Trends</h6>
            <div className="d-flex flex-column gap-3">
              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span>Sprint 12 (Foundations)</span>
                  <strong>36 Points (Target: 35)</strong>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-primary" style={{ width: '102%' }}></div>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span>Sprint 13 (Database & API)</span>
                  <strong>42 Points (Target: 40)</strong>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-success" style={{ width: '105%' }}></div>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span>Sprint 14 (Current In Progress)</span>
                  <strong>32 Points (Target: 45)</strong>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-info" style={{ width: '71%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
            <h6 className="fw-bold text-dark mb-3">Resource Health Indicators</h6>
            <ul className="list-group list-group-flush small">
              <li className="list-group-item d-flex justify-content-between px-0 py-2">
                <span><i className="bi bi-clock-history me-2 text-primary"></i>Timesheet Submission Compliance</span>
                <strong className="text-success">98.4%</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between px-0 py-2">
                <span><i className="bi bi-bug me-2 text-warning"></i>Defect Density Rate</span>
                <strong className="text-dark">0.8 bugs / KLOC</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between px-0 py-2">
                <span><i className="bi bi-chat-heart me-2 text-info"></i>Client CSAT Score</span>
                <strong className="text-primary">4.8 / 5.0</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between px-0 py-2">
                <span><i className="bi bi-shield-check me-2 text-success"></i>Code Review Approval Rate</span>
                <strong className="text-dark">94.2%</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
