import React, { useEffect, useState, useCallback } from 'react';
import { listPayments, recordPayment } from '../../../services/api/paymentApi.js';
import { listInvoices } from '../../../services/api/invoiceApi.js';

export default function FinancePayments() {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ invoiceId: '', amount: '', method: 'bank_transfer', date: new Date().toISOString().split('T')[0], reference: '', notes: '' });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [payData, invData] = await Promise.all([
        listPayments({}).catch(() => []),
        listInvoices({}).catch(() => []),
      ]);
      setPayments(Array.isArray(payData) ? payData : payData.payments || payData.data || []);
      setInvoices(Array.isArray(invData) ? invData : invData.invoices || invData.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load payment data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await recordPayment({
        invoiceId: form.invoiceId,
        amount: Number(form.amount),
        method: form.method,
        date: form.date,
        reference: form.reference || undefined,
        notes: form.notes || undefined,
      });
      setForm({ invoiceId: '', amount: '', method: 'bank_transfer', date: new Date().toISOString().split('T')[0], reference: '', notes: '' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to record payment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (val) => {
    if (val === null || val === undefined) return '₹0';
    return '₹' + Number(val).toLocaleString('en-IN');
  };

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Payments</h1>
          <p className="pageSubtitle">Track payment transactions and gateway logs</p>
        </div>
        <div className="pageActions">
          <button className="btn primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Close Form' : '+ Record Payment'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 className="cardTitle" style={{ marginBottom: 16 }}>Record New Payment</h3>
          <form onSubmit={handleSubmit} className="form">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="formGroup">
                <label className="label">Invoice <span className="required">*</span></label>
                <select className="select" value={form.invoiceId} onChange={(e) => setForm({ ...form, invoiceId: e.target.value })} required>
                  <option value="">Select invoice</option>
                  {invoices.map((inv) => (
                    <option key={inv.id || inv._id} value={inv.id || inv._id}>
                      {inv.invoiceNumber || inv.id || inv._id} — {inv.clientName || inv.client?.name || '—'} ({formatCurrency(inv.total || inv.amount)})
                    </option>
                  ))}
                </select>
              </div>
              <div className="formGroup">
                <label className="label">Amount (₹) <span className="required">*</span></label>
                <input className="inputField" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" min="0" step="0.01" required />
              </div>
              <div className="formGroup">
                <label className="label">Payment Method</label>
                <select className="select" value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="upi">UPI</option>
                  <option value="card">Credit / Debit Card</option>
                  <option value="cheque">Cheque</option>
                  <option value="cash">Cash</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="formGroup">
                <label className="label">Date</label>
                <input className="inputField" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="formGroup">
                <label className="label">Reference / Txn ID</label>
                <input className="inputField" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} placeholder="Transaction reference" />
              </div>
              <div className="formGroup">
                <label className="label">Notes</label>
                <input className="inputField" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button type="submit" className="btn primary" disabled={submitting}>
                {submitting ? 'Recording...' : 'Record Payment'}
              </button>
              <button type="button" className="btn secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        {error && (
          <div style={{ marginBottom: 16, padding: 12, borderRadius: 10, background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.2)', color: 'var(--admin-danger)', fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{error}</span>
            <button className="btn secondary btnSm" onClick={fetchData}>Retry</button>
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }}></div>
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ width: '60%', height: 16, marginBottom: 8 }}></div>
              <div className="skeleton" style={{ width: '40%', height: 12 }}></div>
            </div>
          </div>
        ) : payments.length === 0 ? (
          <div className="emptyState">
            <h3>No Payments Recorded</h3>
            <p>Record a payment to start tracking transaction history.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Invoice</th>
                <th>Client</th>
                <th>Method</th>
                <th>Reference</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((pay) => (
                <tr key={pay.id || pay._id}>
                  <td>{pay.date ? new Date(pay.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                  <td><code>{pay.invoiceNumber || pay.invoiceId || pay.id || pay._id}</code></td>
                  <td style={{ fontWeight: 600 }}>{pay.clientName || pay.client?.name || '—'}</td>
                  <td style={{ textTransform: 'capitalize' }}>{pay.method || '—'}</td>
                  <td>{pay.reference || '—'}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--admin-success)' }}>
                    +₹{Number(pay.amount).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
