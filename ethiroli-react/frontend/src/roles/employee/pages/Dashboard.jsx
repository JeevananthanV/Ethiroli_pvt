import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listLeaves } from '../../../services/api/leaveApi.js';
import { listPayrollHistory } from '../../../services/api/payrollApi.js';

function getStatusClass(status) {
  if (!status) return 'inactive';
  const s = String(status).toLowerCase();
  if (['approved', 'active', 'paid', 'completed', 'success'].includes(s)) return 'active';
  if (['pending', 'processing', 'awaiting', 'in_progress'].includes(s)) return 'pending';
  if (['rejected', 'cancelled', 'failed', 'error', 'declined'].includes(s)) return 'error';
  return 'inactive';
}

export default function EmployeeDashboard() {
  const [leaves, setLeaves] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [leavesData, payrollData] = await Promise.all([
        listLeaves(),
        listPayrollHistory()
      ]);
      setLeaves(Array.isArray(leavesData) ? leavesData : []);
      setPayroll(Array.isArray(payrollData) ? payrollData : []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const pendingLeaves = leaves.filter(l => String(l.status || '').toLowerCase() === 'pending').length;

  return (
    <AdminPage
      title="Employee Dashboard"
      subtitle="Overview of your leave balance, payroll, and performance"
      loading={loading}
      error={error}
      onRetry={fetchData}
    >
      <div className="dashboard">
        <div className="dashboardGrid">
          <div className="statCard">
            <p className="statLabel">Pending Leaves</p>
            <p className="statValue">{pendingLeaves}</p>
          </div>
          <div className="statCard">
            <p className="statLabel">Recent Payslips</p>
            <p className="statValue">{payroll.length}</p>
          </div>
          <div className="statCard">
            <p className="statLabel">Total Leave Requests</p>
            <p className="statValue">{leaves.length}</p>
          </div>
        </div>

        <div className="card" style={{ marginTop: 24 }}>
          <div className="cardHeader">
            <h3 className="cardTitle">Recent Activity</h3>
          </div>
          <div className="cardBody">
            {leaves.length === 0 && payroll.length === 0 ? (
              <div className="emptyState">
                <h3>No activity yet</h3>
                <p>Your recent leaves and payslips will appear here.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {leaves.slice(0, 3).map(leave => (
                  <div key={leave.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--admin-border-subtle)' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 500 }}>Leave Request</p>
                      <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--admin-text-muted)' }}>
                        {leave.startDate} - {leave.endDate}
                      </p>
                    </div>
                    <span className={`statusTag ${getStatusClass(leave.status)}`}>{leave.status || 'N/A'}</span>
                  </div>
                ))}
                {payroll.slice(0, 3).map(pay => (
                  <div key={pay.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--admin-border-subtle)' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 500 }}>Payslip - {pay.month || pay.period || 'N/A'}</p>
                      <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--admin-text-muted)' }}>
                        Net: ₹{Number(pay.netPay || pay.net_pay || 0).toLocaleString()}
                      </p>
                    </div>
                    <span className={`statusTag ${getStatusClass(pay.status)}`}>{pay.status || 'N/A'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
