import React, { useEffect, useState } from 'react';
import { getTransactions } from '../../services/api/transactionApi.js';
import { getInvoices } from '../../services/api/invoiceApi.js';
import { getPayments } from '../../services/api/paymentApi.js';

export default function Finance() {
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [transRes, invRes, payRes] = await Promise.all([
        getTransactions().catch(() => []),
        getInvoices().catch(() => []),
        getPayments().catch(() => []),
      ]);
      setTransactions(Array.isArray(transRes) ? transRes : []);
      setInvoices(Array.isArray(invRes) ? invRes : []);
      setPayments(Array.isArray(payRes) ? payRes : []);
    } catch (err) {
      console.error('Failed to load finance data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <div className="loading">Loading finance data...</div>;

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Finance Overview</h2>
          <p className="pageSubtitle">Transactions, invoices, and payments</p>
        </div>
        <div className="pageActions">
          <button onClick={loadData} className="btn">Refresh</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '20px', marginBottom: '24px' }}>
        <div className="statCard">
          <p className="statLabel">Total Income</p>
          <p className="statValue" style={{ color: 'var(--admin-success)' }}>${totalIncome.toLocaleString()}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Total Expenses</p>
          <p className="statValue" style={{ color: 'var(--admin-danger)' }}>${totalExpense.toLocaleString()}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Net Profit</p>
          <p className="statValue" style={{ color: totalIncome - totalExpense >= 0 ? 'var(--admin-success)' : 'var(--admin-danger)' }}>
            ${(totalIncome - totalExpense).toLocaleString()}
          </p>
        </div>
        <div className="statCard">
          <p className="statLabel">Pending Invoices</p>
          <p className="statValue">{invoices.filter((i) => i.status === 'pending').length}</p>
        </div>
      </div>
      <div style={{ display: 'grid', gap: '20px' }}>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Recent Transactions ({transactions.length})</h3></div>
          <div className="cardBody">
            {transactions.length === 0 ? (
              <p style={{ color: 'var(--admin-text-secondary)' }}>No transactions found.</p>
            ) : (
              <table className="table">
                <thead><tr><th>ID</th><th>Type</th><th>Amount</th><th>Date</th></tr></thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id}>
                      <td><code>{t.id}</code></td>
                      <td><span className={`statusTag ${t.type === 'income' ? 'active' : 'pending'}`}>{t.type}</span></td>
                      <td>${(t.amount || 0).toLocaleString()}</td>
                      <td style={{ color: 'var(--admin-text-secondary)' }}>{t.created_at ? new Date(t.created_at).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Recent Payments ({payments.length})</h3></div>
          <div className="cardBody">
            {payments.length === 0 ? (
              <p style={{ color: 'var(--admin-text-secondary)' }}>No payments recorded.</p>
            ) : (
              <table className="table">
                <thead><tr><th>ID</th><th>Amount</th><th>Method</th><th>Date</th></tr></thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td><code>{p.id}</code></td>
                      <td>${(p.amount || 0).toLocaleString()}</td>
                      <td>{p.method || 'N/A'}</td>
                      <td style={{ color: 'var(--admin-text-secondary)' }}>{p.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
