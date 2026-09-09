import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getTransactions } from '../../services/api/transactionApi.js';
import { listInvoices } from '../../services/api/invoiceApi.js';
import { listPayments } from '../../services/api/paymentApi.js';

export default function FinanceDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [txRes, invRes, payRes] = await Promise.all([
        getTransactions().catch(() => []),
        listInvoices().catch(() => []),
        listPayments().catch(() => []),
      ]);
      setTransactions(Array.isArray(txRes) ? txRes : []);
      setInvoices(Array.isArray(invRes) ? invRes : []);
      setPayments(Array.isArray(payRes) ? payRes : []);
    } catch (err) {
      setError(err.message || 'Failed to load finance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalRevenue = transactions
    .filter((t) => t.type === 'income' || t.amount > 0)
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense' || t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter((i) => i.status === 'paid').length;
  const pendingInvoices = invoices.filter((i) => i.status === 'pending' || i.status === 'sent').length;

  const totalPayments = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const formatCurrency = (amount) => {
    const val = Number(amount) || 0;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <AdminPage
      title="Finance Dashboard"
      subtitle="Revenue, expenses, invoices, and payment overview"
      loading={loading}
      error={error}
      onRetry={fetchData}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="statCard">
          <div className="statLabel">Total Revenue</div>
          <div className="statValue textSuccess">{formatCurrency(totalRevenue)}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Total Expenses</div>
          <div className="statValue textDanger">{formatCurrency(totalExpenses)}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Net Profit</div>
          <div className="statValue">{formatCurrency(totalRevenue - totalExpenses)}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Total Payments</div>
          <div className="statValue textInfo">{formatCurrency(totalPayments)}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Invoice Summary</h3></div>
          <div className="cardBody">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div style={{ textAlign: 'center', padding: 16, background: 'var(--admin-bg-dark)', borderRadius: 8 }}>
                <div className="statValue">{totalInvoices}</div>
                <div className="statLabel">Total</div>
              </div>
              <div style={{ textAlign: 'center', padding: 16, background: 'var(--admin-bg-dark)', borderRadius: 8 }}>
                <div className="statValue textSuccess">{paidInvoices}</div>
                <div className="statLabel">Paid</div>
              </div>
              <div style={{ textAlign: 'center', padding: 16, background: 'var(--admin-bg-dark)', borderRadius: 8 }}>
                <div className="statValue textWarning">{pendingInvoices}</div>
                <div className="statLabel">Pending</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Recent Payments</h3></div>
          <div className="cardBody" style={{ overflowX: 'auto' }}>
            {payments.length === 0 ? (
              <div className="emptyState">No payments recorded.</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.slice(0, 10).map((payment) => (
                    <tr key={payment.id}>
                      <td className="textSecondary"><code>{payment.id}</code></td>
                      <td className="textPrimary" style={{ fontWeight: 500 }}>{formatCurrency(payment.amount)}</td>
                      <td className="textSecondary">{payment.method || '-'}</td>
                      <td className="textSecondary">{formatDate(payment.created_at || payment.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader"><h3 className="cardTitle">Recent Transactions</h3></div>
        <div className="cardBody" style={{ overflowX: 'auto' }}>
          {transactions.length === 0 ? (
            <div className="emptyState">No transactions found.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 20).map((tx) => (
                  <tr key={tx.id}>
                    <td className="textSecondary"><code>{tx.id}</code></td>
                    <td>
                      <span className={`statusTag ${tx.type === 'income' || tx.amount > 0 ? 'active' : 'error'}`}>
                        {tx.type || (tx.amount > 0 ? 'income' : 'expense')}
                      </span>
                    </td>
                    <td className="textSecondary">{tx.category || '-'}</td>
                    <td className="textPrimary" style={{ fontWeight: 500 }}>
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="textSecondary">{formatDate(tx.created_at || tx.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
