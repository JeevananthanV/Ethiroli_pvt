import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function ReceptionReports() {
  const [period, setPeriod] = useState('THIS_WEEK');

  const footfallData = [
    { day: 'Mon', visitors: 28, enquiries: 12, admissions: 4 },
    { day: 'Tue', visitors: 34, enquiries: 18, admissions: 6 },
    { day: 'Wed', visitors: 31, enquiries: 15, admissions: 5 },
    { day: 'Thu', visitors: 42, enquiries: 22, admissions: 8 },
    { day: 'Fri', visitors: 38, enquiries: 19, admissions: 7 },
    { day: 'Sat', visitors: 55, enquiries: 30, admissions: 12 },
  ];

  const peakHours = [
    { slot: '09:00 AM - 11:00 AM', count: 68, percentage: 85, note: 'Morning batch entry & early candidate counseling' },
    { slot: '11:00 AM - 01:00 PM', count: 74, percentage: 92, note: 'Corporate visits & prospective admissions peak' },
    { slot: '02:00 PM - 04:00 PM', count: 45, percentage: 56, note: 'Courier deliveries & parent consultations' },
    { slot: '04:00 PM - 06:00 PM', count: 62, percentage: 78, note: 'Evening batch check-ins & fee counter payments' },
  ];

  return (
    <AdminPage
      title="Front Desk Footfall & Operations Analytics"
      subtitle="Campus visitor traffic analysis, lead acquisition velocity, fee collection summaries, and peak counter hours"
      actions={
        <div className="d-flex gap-2 align-items-center">
          <select
            className="form-select form-select-sm bg-white border shadow-sm"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="TODAY">Today's Summary</option>
            <option value="THIS_WEEK">This Week</option>
            <option value="THIS_MONTH">This Month (September 2026)</option>
          </select>
          <button className="btn btn-outline-secondary btn-sm shadow-sm" onClick={() => alert('Exporting comprehensive PDF report...')}>
            <i className="bi bi-file-earmark-pdf me-1"></i> Export PDF
          </button>
        </div>
      }
    >
      {/* High Level Metrics */}
      <div className="row g-3 mb-2">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Total Campus Footfall</span>
            <h3 className="fw-bold mb-0 mt-1">228</h3>
            <small className="text-success"><i className="bi bi-arrow-up-right me-1"></i>+14% vs last week</small>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Walk-in Enquiries</span>
            <h3 className="fw-bold mb-0 mt-1 text-primary">116</h3>
            <small className="text-muted">51% inquiry conversion</small>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Confirmed Admissions</span>
            <h3 className="fw-bold mb-0 mt-1 text-success">42</h3>
            <small className="text-success"><i className="bi bi-trophy-fill me-1"></i>36.2% closure rate</small>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Counter Collections</span>
            <h3 className="fw-bold mb-0 mt-1 text-dark">₹4,85,000</h3>
            <small className="text-muted">92% Digital (UPI/Card)</small>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Footfall Bar Comparison */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white h-100">
            <h6 className="fw-bold text-dark mb-3">
              <i className="bi bi-bar-chart-fill me-2 text-primary"></i>Weekly Footfall & Admissions Conversion
            </h6>
            <div className="table-responsive">
              <table className="table table-borderless align-middle">
                <thead>
                  <tr className="text-secondary small border-bottom">
                    <th>Day</th>
                    <th>Visitors</th>
                    <th>Walk-In Enquiries</th>
                    <th>Admitted</th>
                    <th>Conversion Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {footfallData.map(d => (
                    <tr key={d.day}>
                      <td className="fw-bold text-dark">{d.day}</td>
                      <td>
                        <span className="badge bg-light text-dark border px-2 py-1">{d.visitors}</span>
                      </td>
                      <td>
                        <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1">{d.enquiries}</span>
                      </td>
                      <td>
                        <span className="badge bg-success bg-opacity-10 text-success px-2 py-1">{d.admissions}</span>
                      </td>
                      <td>
                        <div className="progress" style={{ height: '6px' }}>
                          <div className="progress-bar bg-success" style={{ width: `${Math.round((d.admissions / d.enquiries) * 100)}%` }}></div>
                        </div>
                        <small className="text-muted">{Math.round((d.admissions / d.enquiries) * 100)}%</small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Peak Hours Breakdown */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white h-100">
            <h6 className="fw-bold text-dark mb-3">
              <i className="bi bi-clock-history me-2 text-warning"></i>Front Desk Peak Counter Hours
            </h6>
            <div className="d-flex flex-column gap-3">
              {peakHours.map((p, idx) => (
                <div key={idx} className="p-3 bg-light rounded-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-semibold text-dark small">{p.slot}</span>
                    <span className="badge bg-dark">{p.count} Visitors</span>
                  </div>
                  <div className="progress mb-2" style={{ height: '8px' }}>
                    <div
                      className={`progress-bar ${p.percentage > 80 ? 'bg-danger' : p.percentage > 60 ? 'bg-primary' : 'bg-success'}`}
                      style={{ width: `${p.percentage}%` }}
                    ></div>
                  </div>
                  <small className="text-secondary d-block">{p.note}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
