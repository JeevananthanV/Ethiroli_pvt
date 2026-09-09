import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listInvoices, updateInvoiceStatus } from '../services/api/invoiceApi.js';

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listInvoices({ status: filterStatus === 'all' ? undefined : filterStatus });
      setInvoices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateInvoiceStatus(id, status);
      setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status } : inv)));
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const getStatusTag = (status) => {
    const map = {
      PENDING: 'pending',
      SENT: 'info',
      PAID: 'active',
      OVERDUE: 'error',
      CANCELLED: 'error',
    };
    const cls = map[status] || 'pending';
    return <span className={`statusTag ${cls}`}>{status || 'DRAFT'}</span>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(amount) || 0);
  };

  return (
    <AdminPage
      title="Invoices"
      subtitle="Pending, sent, paid, and overdue invoices"
      loading={loading}
      error={error}
      onRetry={fetchInvoices}
      actions={
        <select className="select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ width: 150 }}>
          <option value="all">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="SENT">Sent</option>
          <option value="PAID">Paid</option>
          <option value="OVERDUE">Overdue</option>
        </select>
      }
    >
      <div className="card">
        {invoices.length === 0 ? (
          <div className="emptyState">
            <h3>No invoices found</h3>
            <p>Invoices will appear here once generated.</p>
          </div>
        ) : (
          <div className="overflowAuto">
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Tax</th>
                  <th>Total</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="textPrimary" style={{ fontWeight: 500 }}>{inv.invoice_number || inv.id}</td>
                    <td className="textSecondary">{inv.client_name || inv.client?.name || inv.client_id || '-'}</td>
                    <td className="textSecondary">{formatCurrency(inv.subtotal || inv.amount)}</td>
                    <td className="textSecondary">{formatCurrency(inv.tax_amount || (Number(inv.subtotal || inv.amount) * Number(inv.tax_rate || 0)) / 100)}</td>
                    <td className="textPrimary" style={{ fontWeight: 600 }}>{formatCurrency(inv.total_amount || inv.total)}</td>
                    <td className="textSecondary">{inv.due_date || '-'}</td>
                    <td>{getStatusTag(inv.status)}</td>
                    <td>
                      <select
                        className="select"
                        value={inv.status}
                        onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                        style={{ width: 120, fontSize: 12 }}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="SENT">Sent</option>
                        <option value="PAID">Paid</option>
                        <option value="OVERDUE">Overdue</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
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
