import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function HRReports() {
  const [selectedReport, setSelectedReport] = useState('headcount');
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const deptData = [
    { name: 'Engineering', count: 14, pct: 58 },
    { name: 'Design & UI/UX', count: 4, pct: 17 },
    { name: 'Marketing & Sales', count: 3, pct: 13 },
    { name: 'Operations & HR', count: 3, pct: 12 }
  ];

  const leaveSummary = [
    { type: 'Casual Leave (CL)', allocated: 120, consumed: 48, balance: 72 },
    { type: 'Sick Leave (SL)', allocated: 96, consumed: 28, balance: 68 },
    { type: 'Earned / Privilege (EL)', allocated: 144, consumed: 34, balance: 110 }
  ];

  const handleExportCSV = () => {
    let csvContent = '';
    let fileName = `hr_${selectedReport}_report_${new Date().toISOString().slice(0, 10)}.csv`;

    if (selectedReport === 'headcount') {
      csvContent = 'Department,Headcount,Percentage\n' +
        deptData.map((d) => `"${d.name}",${d.count},${d.pct}%`).join('\n');
    } else if (selectedReport === 'leaves') {
      csvContent = 'Leave Category,Allocated,Consumed,Balance\n' +
        leaveSummary.map((l) => `"${l.type}",${l.allocated},${l.consumed},${l.balance}`).join('\n');
    } else {
      csvContent = 'Date,Present,On Leave,Attendance Rate\n' +
        '2026-09-01,22,2,92%\n2026-09-02,23,1,96%\n2026-09-03,21,3,88%\n2026-09-04,24,0,100%\n2026-09-05,22,2,92%';
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Exported ${fileName} successfully!`);
  };

  return (
    <AdminPage
      title="HR Reports & Workforce Analytics"
      subtitle="Comprehensive metrics for workforce distribution, attendance trends, and leave utilization"
    >
      <div className="dashboard">
        {toastMsg && (
          <div style={{
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <i className="bi bi-check-circle-fill text-success" />
            {toastMsg}
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div className="btn-group">
            <button
              className={`btn btn-sm ${selectedReport === 'headcount' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setSelectedReport('headcount')}
            >
              Headcount by Department
            </button>
            <button
              className={`btn btn-sm ${selectedReport === 'leaves' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setSelectedReport('leaves')}
            >
              Leave Utilization Ledger
            </button>
            <button
              className={`btn btn-sm ${selectedReport === 'attendance' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setSelectedReport('attendance')}
            >
              Monthly Attendance Trend
            </button>
          </div>

          <button
            className="btn btn-outline-primary btn-sm"
            onClick={handleExportCSV}
            title="Download CSV report"
          >
            <i className="bi bi-download me-1"></i> Export Report (CSV)
          </button>
        </div>

        {selectedReport === 'headcount' && (
          <div className="row g-3">
            <div className="col-12 col-md-8">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-transparent border-0 pt-3">
                  <h6 className="mb-0 fw-bold">Department Headcount Distribution</h6>
                </div>
                <div className="card-body">
                  {deptData.map((d) => (
                    <div className="mb-3" key={d.name}>
                      <div className="d-flex justify-content-between small mb-1">
                        <span className="fw-semibold">{d.name}</span>
                        <span className="text-muted">{d.count} Members ({d.pct}%)</span>
                      </div>
                      <div className="progress" style={{ height: 8 }}>
                        <div
                          className="progress-bar bg-primary"
                          style={{ width: `${d.pct}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-transparent border-0 pt-3">
                  <h6 className="mb-0 fw-bold">Workforce Summary</h6>
                </div>
                <div className="card-body">
                  <div className="p-3 bg-light rounded-3 mb-2">
                    <span className="text-muted small">Total Headcount</span>
                    <h3 className="fw-bold mb-0">24</h3>
                  </div>
                  <div className="p-3 bg-light rounded-3 mb-2">
                    <span className="text-muted small">Active Interns</span>
                    <h3 className="fw-bold mb-0 text-info">8</h3>
                  </div>
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted small">Annual Attrition Rate</span>
                    <h3 className="fw-bold mb-0 text-success">4.2%</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'leaves' && (
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0 pt-3">
              <h6 className="mb-0 fw-bold">Leave Utilization & Balances</h6>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Leave Category</th>
                      <th>Total Quota</th>
                      <th>Consumed</th>
                      <th>Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveSummary.map((l) => (
                      <tr key={l.type}>
                        <td className="fw-bold">{l.type}</td>
                        <td>{l.allocated} Days</td>
                        <td className="text-warning fw-semibold">{l.consumed} Days</td>
                        <td className="text-success fw-bold">{l.balance} Days</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'attendance' && (
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0 pt-3">
              <h6 className="mb-0 fw-bold">Monthly Working Days & Attendance Ratio</h6>
            </div>
            <div className="card-body">
              <div className="p-3 bg-light rounded-3 mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="fw-semibold">Monthly Attendance Average</span>
                  <span className="fw-bold text-success">94.8%</span>
                </div>
                <div className="progress" style={{ height: 10 }}>
                  <div className="progress-bar bg-success" style={{ width: '94.8%' }}></div>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-4">
                  <div className="p-3 border rounded text-center">
                    <div className="text-muted small">Total Working Days</div>
                    <h4 className="fw-bold mb-0">22</h4>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 border rounded text-center">
                    <div className="text-muted small">Average Daily Present</div>
                    <h4 className="fw-bold mb-0 text-primary">22.8</h4>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 border rounded text-center">
                    <div className="text-muted small">Average Daily Leaves</div>
                    <h4 className="fw-bold mb-0 text-danger">1.2</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPage>
  );
}
