import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import employeePortalApi from '../../../services/api/employeePortalApi.js';
import { EmptyState } from '../components/StatCard.jsx';

export default function Payslips() {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSlip, setSelectedSlip] = useState(null);

  const fetchPayslips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await employeePortalApi.getMyPayslips();
      const list = res?.data || (Array.isArray(res) ? res : []);
      setPayslips(list);
    } catch (err) {
      setError(err.message || 'Failed to load payslips');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayslips();
  }, [fetchPayslips]);

  /**
   * Format a payroll date for display. The API supplies `month_year_date` as a
   * plain `YYYY-MM-DD` string (selected with DATE_FORMAT server-side), which we
   * parse as a calendar date so it is never shifted by a timezone offset.
   */
  const formatPayDate = (value) => {
    if (!value) return '—';
    const text = String(value);
    const m = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
      return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).toLocaleDateString(undefined, {
        day: '2-digit', month: 'short', year: 'numeric',
      });
    }
    const d = new Date(text);
    return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString(undefined, {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    switch (String(status).toUpperCase()) {
      case 'PAID':
        return <span className="badge bg-success">Paid</span>;
      case 'PROCESSED':
        return <span className="badge bg-info text-dark">Processed</span>;
      default:
        return <span className="badge bg-secondary">Draft</span>;
    }
  };

  return (
    <AdminPage
      title="Salary & Payslips"
      subtitle="View your itemized compensation statements, tax withholdings, and salary credits"
      loading={loading}
      error={error}
      onRetry={fetchPayslips}
    >
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold">Issued Compensation Statements</h6>
          <span className="badge bg-light text-dark border">{payslips.length} Records</span>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-muted small text-uppercase">
              <tr>
                <th>Period</th>
                <th>Pay Date</th>
                <th>Basic Pay</th>
                <th>Gross Salary</th>
                <th>Deductions (PF/Tax)</th>
                <th>Net Salary Disbursed</th>
                <th>Status</th>
                <th className="text-end">Statement</th>
              </tr>
            </thead>
            <tbody>
              {payslips.length === 0 ? (
                <tr>
                  <td colSpan="8"><EmptyState icon="bi-receipt" text="No payslips available yet. Monthly payroll records will appear once processed by Finance." compact /></td>
                </tr>
              ) : (
                payslips.map((slip) => (
                  <tr key={slip.id}>
                    <td>
                      <div className="fw-semibold text-dark">{slip.month_year_label || 'Current Period'}</div>
                      {slip.month_year_date && (
                        <small className="text-muted">{formatPayDate(slip.month_year_date)}</small>
                      )}
                    </td>
                    <td className="text-muted small">{formatPayDate(slip.paid_at || slip.month_year_date)}</td>
                    <td>₹{Number(slip.basic || 0).toLocaleString()}</td>
                    <td>₹{Number(slip.gross_salary || 0).toLocaleString()}</td>
                    <td className="text-danger">-₹{Number(slip.total_deductions || 0).toLocaleString()}</td>
                    <td className="fw-bold text-success">₹{Number(slip.net_salary || 0).toLocaleString()}</td>
                    <td>{getStatusBadge(slip.status)}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                        onClick={() => setSelectedSlip(slip)}
                      >
                        <i className="bi bi-eye"></i>
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip Detail Modal */}
      {selectedSlip && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              {/* `emp-printable` marks the payslip itself. The print rules in
                  employee-portal.css hide everything else on the page, so
                  "Print Payslip" produces the payslip rather than the whole
                  portal shell. */}
              <div className="modal-header bg-light">
                <div className="emp-printable">
                  <h5 className="modal-title fw-bold">Payslip - {selectedSlip.month_year_label || 'Current Period'}</h5>
                  <small className="text-muted">Ethiroli Technologies Pvt Ltd</small>
                </div>
                <button type="button" className="btn-close emp-print-hide" onClick={() => setSelectedSlip(null)}></button>
              </div>
              <div className="modal-body p-3 emp-printable">
                <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                  <span className="text-muted">Employee Code:</span>
                  <span className="fw-semibold text-dark">{selectedSlip.employee_code || '—'}</span>
                </div>
                <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                  <span className="text-muted">Designation:</span>
                  <span className="fw-semibold text-dark">{selectedSlip.designation || '—'}</span>
                </div>
                <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                  <span className="text-muted">Pay Period:</span>
                  <span className="fw-semibold text-dark">
                    {selectedSlip.month_year_label || '—'}
                    {selectedSlip.month_year_date && (
                      <small className="text-muted ms-2">({formatPayDate(selectedSlip.month_year_date)})</small>
                    )}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                  <span className="text-muted">Paid On:</span>
                  <span className="fw-semibold text-dark">{formatPayDate(selectedSlip.paid_at)}</span>
                </div>

                <div className="row g-3 my-2">
                  <div className="col-6">
                    <div className="p-3 bg-light rounded-3">
                      <small className="text-muted d-block">Basic Salary</small>
                      <strong className="text-dark">₹{Number(selectedSlip.basic || 0).toLocaleString()}</strong>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 bg-light rounded-3">
                      <small className="text-muted d-block">HRA & Allowances</small>
                      <strong className="text-dark">₹{Number(selectedSlip.hra || 0).toLocaleString()}</strong>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 bg-light rounded-3">
                      <small className="text-muted d-block">PF Employee Deductions</small>
                      <strong className="text-danger">-₹{Number(selectedSlip.pf_employee || 0).toLocaleString()}</strong>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 bg-light rounded-3">
                      <small className="text-muted d-block">TDS / Income Tax</small>
                      <strong className="text-danger">-₹{Number(selectedSlip.tds || 0).toLocaleString()}</strong>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-primary bg-opacity-10 rounded-3 d-flex justify-content-between align-items-center mt-3">
                  <span className="fw-bold text-primary">Net Salary Paid</span>
                  <span className="fw-bold fs-4 text-primary">₹{Number(selectedSlip.net_salary || 0).toLocaleString()}</span>
                </div>
              </div>
              <div className="modal-footer emp-print-hide">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedSlip(null)}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={() => window.print()}>
                  <i className="bi bi-printer me-1"></i> Print Payslip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
