import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listPayrollHistory } from '../../../services/api/payrollApi.js';

function getStatusClass(status) {
  if (!status) return 'inactive';
  const s = String(status).toLowerCase();
  if (['approved', 'active', 'paid', 'completed', 'success'].includes(s)) return 'active';
  if (['pending', 'processing', 'awaiting', 'in_progress'].includes(s)) return 'pending';
  if (['rejected', 'cancelled', 'failed', 'error', 'declined'].includes(s)) return 'error';
  return 'inactive';
}

export default function EmployeePayslips() {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayslips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPayrollHistory();
      setPayslips(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load payslips');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayslips();
  }, [fetchPayslips]);

  const handleDownload = (payslip) => {
    alert(`Downloading payslip for ${payslip.month || payslip.period || 'N/A'}`);
  };

  return (
    <AdminPage
      title="My Payslips"
      subtitle="View and download your monthly payroll history"
      loading={loading}
      error={error}
      onRetry={fetchPayslips}
    >
      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Payroll History</h3>
        </div>
        <div className="cardBody">
          {payslips.length === 0 ? (
            <div className="emptyState">
              <h3>No payslips found</h3>
              <p>Your payroll history will appear here once processed.</p>
            </div>
          ) : (
            <div className="overflowAuto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Gross Pay</th>
                    <th>Deductions</th>
                    <th>Net Pay</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payslips.map(pay => (
                    <tr key={pay.id}>
                      <td>{pay.month || pay.period || 'N/A'}</td>
                      <td>₹{Number(pay.grossPay || pay.gross_pay || 0).toLocaleString()}</td>
                      <td>₹{Number(pay.deductions || 0).toLocaleString()}</td>
                      <td>₹{Number(pay.netPay || pay.net_pay || 0).toLocaleString()}</td>
                      <td>
                        <span className={`statusTag ${getStatusClass(pay.status)}`}>
                          {pay.status || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <button className="btn secondary btnSm" onClick={() => handleDownload(pay)}>
                          Download PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
