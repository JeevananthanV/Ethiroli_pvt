import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listEmployees } from '../../../services/api/employeeApi.js';
import { listInterns } from '../../../services/api/internApi.js';
import { listLeaves } from '../../../services/api/leaveApi.js';
import { getDashboardMetrics } from '../../../services/api/hrApi.js';

export default function HRReports() {
  const [selectedReport, setSelectedReport] = useState('headcount');
  const [toastMsg, setToastMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [metrics, setMetrics] = useState({
    totalEmployees: 0,
    totalInterns: 0,
    presentToday: 0,
    onLeaveToday: 0,
    pendingLeaves: 0
  });

  const [deptData, setDeptData] = useState([]);
  const [leaveSummary, setLeaveSummary] = useState([]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fetchReportsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashMetrics, employeesRes, internsRes, leavesRes] = await Promise.all([
        getDashboardMetrics().catch(() => ({})),
        listEmployees().catch(() => []),
        listInterns().catch(() => []),
        listLeaves().catch(() => [])
      ]);

      const empList = Array.isArray(employeesRes) ? employeesRes : (employeesRes?.data || []);
      const internList = Array.isArray(internsRes) ? internsRes : (internsRes?.data || []);
      const leaveList = Array.isArray(leavesRes) ? leavesRes : (leavesRes?.data || []);
      const m = dashMetrics?.data || dashMetrics || {};

      setMetrics({
        totalEmployees: empList.length || m.totalEmployees || 0,
        totalInterns: internList.length || m.totalInterns || 0,
        presentToday: m.presentToday || 0,
        onLeaveToday: m.onLeaveToday || 0,
        pendingLeaves: m.pendingLeaves || 0
      });

      // Calculate dynamic department distribution
      const deptMap = {};
      empList.forEach(e => {
        const dept = e.department || 'General';
        deptMap[dept] = (deptMap[dept] || 0) + 1;
      });

      const totalEmp = empList.length || 1;
      const computedDepts = Object.entries(deptMap).map(([name, count]) => ({
        name,
        count,
        pct: Math.round((count / totalEmp) * 100)
      }));

      setDeptData(computedDepts.length > 0 ? computedDepts : [
        { name: 'Engineering', count: empList.length, pct: 100 }
      ]);

      // Calculate dynamic leave utilization
      const cl = leaveList.filter(l => (l.leave_type || l.type) === 'CASUAL').length;
      const sl = leaveList.filter(l => (l.leave_type || l.type) === 'SICK').length;
      const el = leaveList.filter(l => (l.leave_type || l.type) === 'EARNED').length;

      setLeaveSummary([
        { type: 'Casual Leave (CL)', allocated: empList.length * 12, consumed: cl, balance: Math.max(0, empList.length * 12 - cl) },
        { type: 'Sick Leave (SL)', allocated: empList.length * 8, consumed: sl, balance: Math.max(0, empList.length * 8 - sl) },
        { type: 'Earned / Privilege (EL)', allocated: empList.length * 15, consumed: el, balance: Math.max(0, empList.length * 15 - el) }
      ]);
    } catch (err) {
      setError(err.message || 'Failed to load report analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReportsData();
  }, [fetchReportsData]);

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
      csvContent = 'Metric,Value\n' +
        `Total Employees,${metrics.totalEmployees}\n` +
        `Total Interns,${metrics.totalInterns}\n` +
        `Present Today,${metrics.presentToday}\n` +
        `On Leave Today,${metrics.onLeaveToday}`;
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

  const attendanceRate = metrics.totalEmployees > 0 
    ? Math.round((metrics.presentToday / metrics.totalEmployees) * 100) 
    : 0;

  return (
    <AdminPage
      title="HR Reports & Workforce Analytics"
      subtitle="Real-time metrics for workforce distribution, attendance trends, and leave utilization"
      loading={loading}
      error={error}
      onRetry={fetchReportsData}
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
              Workforce Attendance Trend
            </button>
          </div>

          <button
            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
            onClick={handleExportCSV}
            title="Download CSV report"
          >
            <i className="bi bi-download"></i> Export Report (CSV)
          </button>
        </div>

        {selectedReport === 'headcount' && (
          <div className="row g-3">
            <div className="col-12 col-md-8">
              <div className="card border shadow-sm rounded-3 h-100 bg-white p-3">
                <h6 className="mb-3 fw-bold text-dark">Department Headcount Distribution</h6>
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

            <div className="col-12 col-md-4">
              <div className="card border shadow-sm rounded-3 h-100 bg-white p-3">
                <h6 className="mb-3 fw-bold text-dark">Live Workforce Summary</h6>
                <div className="p-3 bg-light rounded-3 mb-2">
                  <span className="text-muted small">Total Employees</span>
                  <h3 className="fw-bold mb-0 text-dark">{metrics.totalEmployees}</h3>
                </div>
                <div className="p-3 bg-light rounded-3 mb-2">
                  <span className="text-muted small">Active Interns</span>
                  <h3 className="fw-bold mb-0 text-info">{metrics.totalInterns}</h3>
                </div>
                <div className="p-3 bg-light rounded-3">
                  <span className="text-muted small">Attendance Rate Today</span>
                  <h3 className="fw-bold mb-0 text-success">{attendanceRate}%</h3>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'leaves' && (
          <div className="card border shadow-sm rounded-3 bg-white">
            <div className="card-header bg-transparent border-0 pt-3">
              <h6 className="mb-0 fw-bold text-dark">Leave Utilization & Balances</h6>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0 small">
                  <thead className="table-light">
                    <tr>
                      <th>Leave Category</th>
                      <th>Total Allocated Quota</th>
                      <th>Consumed (Days)</th>
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
          <div className="card border shadow-sm rounded-3 bg-white p-3">
            <h6 className="mb-3 fw-bold text-dark">Workforce Attendance Pulse</h6>
            <div className="p-3 bg-light rounded-3 mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span className="fw-semibold">Today's Attendance Rate</span>
                <span className="fw-bold text-success">{attendanceRate}%</span>
              </div>
              <div className="progress" style={{ height: 10 }}>
                <div className="progress-bar bg-success" style={{ width: `${attendanceRate}%` }}></div>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-4">
                <div className="p-3 border rounded text-center bg-white">
                  <div className="text-muted small">Total Employees</div>
                  <h4 className="fw-bold mb-0">{metrics.totalEmployees}</h4>
                </div>
              </div>
              <div className="col-4">
                <div className="p-3 border rounded text-center bg-white">
                  <div className="text-muted small">Present Today</div>
                  <h4 className="fw-bold mb-0 text-primary">{metrics.presentToday}</h4>
                </div>
              </div>
              <div className="col-4">
                <div className="p-3 border rounded text-center bg-white">
                  <div className="text-muted small">On Approved Leave</div>
                  <h4 className="fw-bold mb-0 text-danger">{metrics.onLeaveToday}</h4>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPage>
  );
}
