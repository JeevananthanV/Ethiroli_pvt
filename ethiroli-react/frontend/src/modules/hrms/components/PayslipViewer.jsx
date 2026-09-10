import React, { useState, useEffect, useCallback } from 'react'
import Modal from '../../../common/components/Modal/Modal.jsx'
import Button from '../../../common/components/Button/Button.jsx'
import { payrollApi } from '../../../services/api/payrollApi.js'

export default function PayslipViewer({ isOpen, onClose, payrollRecord }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen && payrollRecord?.id) {
      loadPayslip()
    }
  }, [isOpen, payrollRecord?.id, loadPayslip])

  const loadPayslip = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await payrollApi.getPayslip(payrollRecord.id)
    } catch (err) {
      setError(err.message || 'Failed to load payslip')
    } finally {
      setLoading(false)
    }
  }, [payrollRecord?.id])

  const formatCurrency = (val) => {
    if (!val && val !== 0) return '$0.00'
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0)
  }

  const handlePrint = () => {
    window.print()
  }

  if (!payrollRecord) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Payslip - ${payrollRecord.employeeName || 'Employee'}`} style={{ maxWidth: '600px' }}>
      {loading ? (
        <div className="loading">
          <div className="skeleton" style={{ width: '100%', height: '400px' }} />
        </div>
      ) : error ? (
        <div className="emptyState">
          <h3 className="textDanger">Error Loading Payslip</h3>
          <p className="textSecondary">{error}</p>
        </div>
      ) : (
        <div id="payslip-content">
          <div style={{ textAlign: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid var(--admin-border)' }}>
            <h2 style={{ margin: '0 0 4px', color: 'var(--admin-text-primary)' }}>PAYSLIP</h2>
            <p className="textSecondary" style={{ margin: 0 }}>{payrollRecord.month || '-'}</p>
          </div>

          <div className="card" style={{ marginBottom: '16px', background: 'var(--admin-bg-light)' }}>
            <div className="cardBody" style={{ padding: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                <div>
                  <span className="textMuted" style={{ fontSize: '12px' }}>Employee Name</span>
                  <div style={{ color: 'var(--admin-text-primary)', fontWeight: 500 }}>{payrollRecord.employeeName || '-'}</div>
                </div>
                <div>
                  <span className="textMuted" style={{ fontSize: '12px' }}>Employee ID</span>
                  <div style={{ color: 'var(--admin-text-primary)', fontWeight: 500 }}>{payrollRecord.employeeId || '-'}</div>
                </div>
                <div>
                  <span className="textMuted" style={{ fontSize: '12px' }}>Pay Period</span>
                  <div style={{ color: 'var(--admin-text-primary)', fontWeight: 500 }}>{payrollRecord.month || '-'}</div>
                </div>
                <div>
                  <span className="textMuted" style={{ fontSize: '12px' }}>Processed On</span>
                  <div style={{ color: 'var(--admin-text-primary)', fontWeight: 500 }}>
                    {payrollRecord.processedAt || payrollRecord.createdAt ? new Date(payrollRecord.processedAt || payrollRecord.createdAt).toLocaleDateString() : '-'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '16px' }}>
            <div className="cardHeader">
              <h3 className="cardTitle">Earnings</h3>
            </div>
            <div className="cardBody" style={{ padding: 0 }}>
              <table className="table" style={{ marginBottom: 0 }}>
                <tbody>
                  <tr>
                    <td>Basic Salary</td>
                    <td style={{ textAlign: 'right', fontWeight: 500 }}>{formatCurrency(payrollRecord.basicSalary)}</td>
                  </tr>
                  <tr>
                    <td>Allowances</td>
                    <td style={{ textAlign: 'right', fontWeight: 500, color: 'var(--admin-success)' }}>+{formatCurrency(payrollRecord.allowances)}</td>
                  </tr>
                  <tr>
                    <td>Bonus</td>
                    <td style={{ textAlign: 'right', fontWeight: 500, color: 'var(--admin-success)' }}>+{formatCurrency(payrollRecord.bonus)}</td>
                  </tr>
                  <tr style={{ background: 'var(--admin-bg-light)' }}>
                    <td style={{ fontWeight: 600 }}>Gross Earnings</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>
                      {formatCurrency((payrollRecord.basicSalary || 0) + (payrollRecord.allowances || 0) + (payrollRecord.bonus || 0))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '16px' }}>
            <div className="cardHeader">
              <h3 className="cardTitle">Deductions</h3>
            </div>
            <div className="cardBody" style={{ padding: 0 }}>
              <table className="table" style={{ marginBottom: 0 }}>
                <tbody>
                  <tr>
                    <td>Total Deductions</td>
                    <td style={{ textAlign: 'right', fontWeight: 500, color: 'var(--admin-danger)' }}>-{formatCurrency(payrollRecord.deductions)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card" style={{ border: '2px solid var(--admin-primary)' }}>
            <div className="cardBody" style={{ padding: '20px', background: 'rgba(99, 102, 241, 0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="textSecondary" style={{ fontSize: '13px', marginBottom: '4px' }}>Net Salary</div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--admin-primary)' }}>{formatCurrency(payrollRecord.netSalary)}</div>
                </div>
                <Button variant="primary" onClick={handlePrint}>
                  Print Payslip
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
