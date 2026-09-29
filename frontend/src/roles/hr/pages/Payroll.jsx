import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import { useHrData } from '../../../hooks/useHrData';
import { listPayrollHistory, runPayrollForAll } from '../../../../services/api/hrApi.standardized.js';

/**
 * HRPayroll - Dynamic Payroll Processing with Proper Data Flow
 * 
 * Uses useHrData hook for consistent state management,
 * hrApi.standardized.js for consistent API calls,
 * and AdminPage for unified loading/error/empty states.
 * Maintains all unique payroll processing functionality.
 */
export default function HRPayroll() {
  // --- Data Hook with Proper Flow ---
  const {
    data: payroll,
    loading,
    error,
    refresh,
  } = useHrData(
    () => listPayrollHistory(),
    undefined,
    undefined,
    undefined,
    undefined
  );

  // --- Cycle Data State ---
  const [cycleData, setCycleData] = useState({
    month_year: '2026-09-01',
    notes: 'Regular Monthly Payroll Cycle'
  });

  // --- Toast Helper ---
  const [toastMsg, setToastMsg] = useState('');
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // --- Handle Run Payroll ---
  const handleRunPayroll = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await runPayrollForAll({ month_year: cycleData.month_year, notes: cycleData.notes });
      await refresh();
      setShowRunModal(false);
      const count = res?.data?.processed ?? res?.processed ?? 0;
      showToast(`Payroll for ${cycleData.month_year.slice(0, 7)} processed successfully (${count} staff records updated)!`);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to process payroll';
      setError(message);
      showToast(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminPage
      title="Payroll Processing"
      subtitle="Review salary ledgers, allowances, statutory deductions, and generate payslips"
      loading={loading}
      error={error}
      onRetry={refresh}
      actions={
        <Button variant="primary" onClick={() => setShowRunModal(true)}>
          <i className="bi bi-cash-stack me-1" /> Run Monthly Payroll
        </Button>
      }
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

        {payroll.length === 0 ? (
          <div className="emptyState">
            <h3>No payroll records</h3>
            <p>Click "Run Monthly Payroll" above to generate this cycle's compensation register.</p>
          </div>
        ) : (
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Compensation & Salary Register ({payroll.length})</h3>
            </div>
            <div className="cardBody" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Pay Cycle</th>
                    <th>Basic Salary</th>
                    <th>Allowances</th>
                    <th>Deductions</th>
                    <th>Net Pay</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payroll.map((pay) => {
                    const basic = Number(pay.basic || pay.basicSalary || pay.basic_salary || 0);
                    const allowances = Number(pay.allowances || pay.hra || 0);
                    const deductions = Number(pay.deductions || pay.total_deductions || 0);
                    const net = Number(pay.net_pay || pay.netPay || pay.net_salary || basic + allowances - deductions);
                    return (
                      <tr key={pay.id}>
                        <td style={{ fontWeight: 600 }}>{pay.employee_name || pay.user_name || 'Staff Member'}</td>
                        <td style={{ fontSize: '0.85rem', color: '#64748b' }}>{String(pay.month_year || '2026-08').slice(0, 7)}</td>
                        <td>₹{basic.toLocaleString()}</td>
                        <td>₹{allowances.toLocaleString()}</td>
                        <td style={{ color: '#dc2626' }}>-₹{deductions.toLocaleString()}</td>
                        <td style={{ fontWeight: 600, color: 'var(--admin-success, #16a34a)' }}>
                          ₹{net.toLocaleString()}
                        </td>
                        <td>
                          <span className={`statusTag ${String(pay.status).toUpperCase() === 'PAID' ? 'active' : 'pending'}`}>
                            {pay.status || 'Processed'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setSelectedSlip({ ...pay, basic, allowances, deductions, net })}
                            title="View full payslip breakdown"
                          >
                            <i className="bi bi-file-earmark-text me-1" /> View Slip
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Run Payroll Modal */}
        <Modal isOpen={showRunModal} onClose={() => setShowRunModal(false)} title="Execute Monthly Payroll Cycle">
          <form onSubmit={handleRunPayroll}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Pay Period Month *</label>
                <input
                  type="month"
                  required
                  value={cycleData.month_year.slice(0, 7)}
                  onChange={(e) => setCycleData({ ...cycleData, month_year: `${e.target.value}-01` })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Disbursement Notes</label>
                <input
                  type="text"
                  value={cycleData.notes}
                  onChange={(e) => setCycleData({ ...cycleData, notes: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>Automatic Calculations:</div>
                <div>&bull; Basic + HRA + Special Allowances computed per employee salary tier</div>
                <div>&bull; PF (12%) and Tax Deductions (TDS) calculated automatically</div>
                <div>&bull; Generates encrypted PDF payslips for download</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowRunModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Calculating...' : 'Run & Finalize Payroll'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Payslip View Modal */}
        <Modal isOpen={Boolean(selectedSlip)} onClose={() => setSelectedSlip(null)} title={`Salary Slip - ${selectedSlip?.employee_name || 'Staff'}`}>
          {selectedSlip && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '2px solid #e2e8f0',
                paddingBottom: '12px',
                marginBottom: '16px'
              }}>
                <div>
                  <h4 style={{ margin: 0, fontWeight: 700 }}>ETHIROLI PRIVATE LIMITED</h4>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>People Operations & Payroll Division</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600 }}>Period: {String(selectedSlip.month_year).slice(0, 7)}</div>
                  <span className="badge bg-success">Status: {selectedSlip.status}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>EMPLOYEE NAME</div>
                  <div style={{ fontWeight: 600 }}>{selectedSlip.employee_name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>DEPARTMENT</div>
                  <div style={{ fontWeight: 500 }}>{selectedSlip.department || 'Operations'}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>EMPLOYEE CODE</div>
                  <div style={{ fontWeight: 600 }}>{selectedSlip.employee_code || 'EMP-101'}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>PAY METHOD</div>
                  <div style={{ fontWeight: 500 }}>Direct Bank Transfer</div>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Earnings Component</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9' }}>Basic Salary</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', borderBottom: '1px solid #f1f5f9' }}>₹{Number(selectedSlip.basic).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9' }}>House Rent Allowance (HRA) & Allowances</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', borderBottom: '1px solid #f1f5f9' }}>₹{Number(selectedSlip.allowances).toLocaleString()}</td>
                  </tr>
                  <tr style={{ color: '#dc2626' }}>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9' }}>Statutory Deductions (PF & Tax)</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', borderBottom: '1px solid #f1f5f9' }}>-₹{Number(selectedSlip.deductions).toLocaleString()}</td>
                  </tr>
                  <tr style={{ fontWeight: 700, background: '#f8fafc', fontSize: '1rem', borderTop: '2px solid #cbd5e1' }}>
                    <td style={{ padding: '10px 12px' }}>Net Take-Home Pay</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#16a34a' }}>₹{Number(selectedSlip.net).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" onClick={() => setSelectedSlip(null)}>Close</button>
                <button className="btn btn-outline-primary" onClick={() => window.print()}>
                  <i className="bi bi-printer me-1" /> Print Slip
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminPage>
  );
}