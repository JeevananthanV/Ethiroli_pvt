import React, { useState, useEffect } from 'react'
import AdminPage from '../../common/components/AdminPage'
import Button from '../../common/components/Button'
import { transactionApi } from '../../services/api/transactionApi'
import { invoiceApi } from '../../services/api/invoiceApi'
import { paymentApi } from '../../services/api/paymentApi'

export default function FinanceDashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    expenses: 0,
    invoices: 0,
    payments: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const [transactions, invoices, payments] = await Promise.all([
        transactionApi.getAll(),
        invoiceApi.getAll(),
        paymentApi.getAll(),
      ])
      const revenue = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + (t.amount || 0), 0)
      const expenses = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + (t.amount || 0), 0)
      setStats({
        revenue,
        expenses,
        invoices: invoices.length,
        payments: payments.length,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminPage
      title="Finance Dashboard"
      subtitle="Overview of revenue, expenses, invoices, and payments"
      loading={loading}
      error={error}
      onRetry={loadStats}
    >
      <div className="grid gridCols4">
        <div className="statCard">
          <div className="statLabel">Total Revenue</div>
          <div className="statValue textSuccess">${stats.revenue.toLocaleString()}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Total Expenses</div>
          <div className="statValue textDanger">${stats.expenses.toLocaleString()}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Invoices</div>
          <div className="statValue">{stats.invoices}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Payments</div>
          <div className="statValue">{stats.payments}</div>
        </div>
      </div>
    </AdminPage>
  )
}
