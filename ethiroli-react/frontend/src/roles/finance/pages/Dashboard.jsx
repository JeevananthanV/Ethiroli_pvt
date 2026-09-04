import React, { useEffect, useState, useCallback } from 'react';
import { listInvoices } from '../../../services/api/invoiceApi.js';
import { listPayments } from '../../../services/api/paymentApi.js';
import { getTransactions } from '../../../services/api/transactionApi.js';
import { listSubscriptions } from '../../../services/api/subscriptionApi.js';

export default function FinanceDashboard() {
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [invData, payData, txData, subData] = await Promise.all([
        listInvoices({}).catch(() => []),
        listPayments({}).catch(() => []),
        getTransactions({}).catch(() => []),
        listSubscriptions({}).catch(() => []),
      ]);
      setInvoices(Array.isArray(invData) ? invData : invData.invoices || invData.data || []);
      setPayments(Array.isArray(payData) ? payData : payData.payments || payData.data || []);
      setTransactions(Array.isArray(txData) ? txData : txData.transactions || txData.data || []);
      setSubscriptions(Array.isArray(subData) ? subData : subData.subscriptions || subData.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const formatCurrency = (val) => {
    if (val === null || val === undefined) return '₹0';
    return '₹' + Number(val).toLocaleString('en-IN');
  };

  const totalRevenue = transactions
    .filter((t) => t.type === 'income' || t.category === 'income')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense' || t.category === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const pendingInvoices = invoices.filter((inv) => ['pending', 'sent', 'overdue'].includes(inv.status)).length;
  const paidInvoices = invoices.filter((inv) => inv.status === 'paid').length;
  const activeSubs = subscriptions.filter((s) => s.status === 'active').length;

  const recentTx = [...transactions]
    .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
    .slice(0, 5);

  if (loading) {
    return (
      <div>
        <div className="pageHeader">
          <div>
            <h1 className="pageTitle">Finance Dashboard</h1>
            <p className="pageSubtitle">Financial overview and key metrics</p>
          </div>
        </div>
        <div className="card">
          <div className="loading">
            <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }}></div>
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ width: '60%', height: 16, marginBottom: 8 }}></div>
              <div className="skeleton" style={{ width: '40%', height: 12 }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="pageHeader">
          <div>
            <h1 className="pageTitle">Finance Dashboard</h1>
            <p className="pageSubtitle">Financial overview and key metrics</p>
          </div>
        </div>
        <div className="card" style={{ borderColor: 'rgba(244, 63, 94, 0.3)', background: 'rgba(244, 63, 94, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--admin-danger)', fontSize: 13 }}>{error}</span>
            <button className="btn secondary btnSm" onClick={fetchAll}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Finance Dashboard</h1>
          <p className="pageSubtitle">Financial overview and key metrics</p>
        </div>
      </div>

      <div className="dashboardGrid">
        <div className="statCard">
          <p className="statLabel">Total Revenue</p>
          <p className="statValue">{formatCurrency(totalRevenue)}</p>
          <span className="statTrend up">Income</span>
        </div>
        <div className="statCard">
          <p className="statLabel">Total Expenses</p>
          <p className="statValue">{formatCurrency(totalExpenses)}</p>
          <span className="statTrend down">Outgoing</span>
        </div>
        <div className="statCard">
          <p className="statLabel">Net Profit</p>
          <p className="statValue">{formatCurrency(totalRevenue - totalExpenses)}</p>
          <span className={`statTrend ${totalRevenue - totalExpenses >= 0 ? 'up' : 'down'}`}>
            {totalRevenue - totalExpenses >= 0 ? 'Profitable' : 'Loss'}
          </span>
        </div>
        <div className="statCard">
          <p className="statLabel">Active Subscriptions</p>
          <p className="statValue">{activeSubs}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Invoices Paid</p>
          <p className="statValue">{paidInvoices}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Pending Invoices</p>
          <p className="statValue">{pendingInvoices}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Recent Transactions</h3>
          </div>
          <div className="cardBody" style={{ padding: 0 }}>
            {recentTx.length === 0 ? (
              <div className="emptyState" style={{ padding: '24px 16px' }}>
                <p style={{ fontSize: 13 }}>No transactions yet.</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTx.map((tx) => (
                    <tr key={tx.id || tx._id}>
                      <td>{tx.date ? new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}</td>
                      <td>
                        <span className={`statusTag ${tx.type === 'income' ? 'active' : tx.type === 'expense' ? 'error' : 'pending'}`}>
                          {tx.type || tx.category || '—'}
                        </span>
                      </td>
                      <td>{tx.description || tx.category || '—'}</td>
                      <td style={{ fontWeight: 600, color: tx.type === 'income' ? 'var(--admin-success)' : tx.type === 'expense' ? 'var(--admin-danger)' : 'var(--admin-text-primary)' }}>
                        {tx.type === 'expense' ? '-' : '+'}{formatCurrency(tx.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Invoice Summary</h3>
          </div>
          <div className="cardBody">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--admin-border-subtle)' }}>
                <span style={{ color: 'var(--admin-text-secondary)', fontSize: 13 }}>Total Invoices</span>
                <span style={{ fontWeight: 700, color: 'var(--admin-text-primary)' }}>{invoices.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--admin-border-subtle)' }}>
                <span style={{ color: 'var(--admin-text-secondary)', fontSize: 13 }}>Paid</span>
                <span style={{ fontWeight: 700, color: 'var(--admin-success)' }}>{paidInvoices}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--admin-border-subtle)' }}>
                <span style={{ color: 'var(--admin-text-secondary)', fontSize: 13 }}>Pending / Overdue</span>
                <span style={{ fontWeight: 700, color: 'var(--admin-warning)' }}>{pendingInvoices}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                <span style={{ color: 'var(--admin-text-secondary)', fontSize: 13 }}>Payments Received</span>
                <span style={{ fontWeight: 700, color: 'var(--admin-text-primary)' }}>{payments.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
