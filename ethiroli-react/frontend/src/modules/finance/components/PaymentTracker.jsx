import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listPayments, recordPayment } from '../services/api/paymentApi.js';

export default function PaymentTracker() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPayments({ status: filterStatus === 'all' ? undefined : filterStatus });
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleRecordPayment = async (paymentId) => {
    try {
      await recordPayment({ payment_id: paymentId, method: 'online', amount: 0 });
      alert('Payment recorded successfully');
      fetchPayments();
    } catch (err) {
      alert(err.message || 'Failed to record payment');
    }
  };

  const getStatusTag = (status) => {
    const map = {
      PENDING: 'pending',
      PAID: 'active',
      PARTIAL: 'info',
      OVERDUE: 'error',
      REFUNDED: 'error',
    };
    const cls = map[status] || 'pending';
    return <span className={`statusTag ${cls}`}>{status || 'PENDING'}</span>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(amount) || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const stats = {
    total: payments.length,
    paid: payments.filter((p) => p.status === 'PAID').length,
    pending: payments.filter((p) => p.status === 'PENDING').length,
    overdue: payments.filter((p) => p.status === 'OVERDUE').length,
  };

  return (
    <AdminPage
      title="Payments"
      subtitle="Track payments, due dates, and payment status"
      loading={loading}
      error={error}
      onRetry={fetchPayments}
      actions={
        <select className="select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ width: 150 }}>
          <option value="all">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="OVERDUE">Overdue</option>
        </select>
      }
    >
      <div className="dashboardGrid" style={{ marginBottom: 24 }}>
        <div className="statCard">
          <p className="statLabel">Total Payments</p>
          <p className="statValue">{stats.total}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Paid</p>
          <p className="statValue" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', WebkitBackgroundClip: 'text' }}>{stats.paid}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Pending</p>
          <p className="statValue" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', WebkitBackgroundClip: 'text' }}>{stats.pending}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Overdue</p>
          <p className="statValue" style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)', WebkitBackgroundClip: 'text' }}>{stats.overdue}</p>
        </div>
      </div>

      <div className="card">
        {payments.length === 0 ? (
          <div className="emptyState">
            <h3>No payment records</h3>
            <p>Payment data will appear here once available.</p>
          </div>
        ) : (
          <div className="overflowAuto">
            <table className="table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Invoice</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Paid Date</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="textPrimary" style={{ fontWeight: 500 }}>{p.id}</td>
                    <td className="textSecondary">{p.invoice_id || p.invoice_number || '-'}</td>
                    <td className="textPrimary" style={{ fontWeight: 600 }}>{formatCurrency(p.amount)}</td>
                    <td className="textSecondary">{formatDate(p.due_date)}</td>
                    <td className="textSecondary">{formatDate(p.paid_date)}</td>
                    <td className="textSecondary">{p.method || '-'}</td>
                    <td>{getStatusTag(p.status)}</td>
                    <td>
                      {p.status !== 'PAID' && (
                        <button className="btn primary" onClick={() => handleRecordPayment(p.id)} style={{ padding: '4px 12px', fontSize: 12 }}>
                          Record Payment
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminPage>
  );
}
