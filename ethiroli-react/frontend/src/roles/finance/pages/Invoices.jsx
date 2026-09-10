import React, { useEffect, useState, useCallback } from 'react';
import { listInvoices, updateInvoiceStatus, generateInvoice } from '../../../services/api/invoiceApi.js';
import { listClients } from '../../../services/api/clientApi.js';

export default function FinanceInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [genForm, setGenForm] = useState({ clientId: '', subscriptionId: '', amount: '', dueDate: '' });
  const [clients, setClients] = useState([]);

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listInvoices({});
      const list = Array.isArray(data) ? data : data.invoices || data.data || [];
      setInvoices(list);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
    (async () => {
      try {
        const data = await listClients({});
        const list = Array.isArray(data) ? data : data.clients || data.data || [];
        setClients(list);
      } catch (err) {
        console.error('Failed to load clients', err);
      }
    })();
  }, [fetchInvoices]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateInvoiceStatus(id, newStatus);
      setInvoices((prev) =>
        prev.map((inv) => ((inv.id || inv._id) === id ? { ...inv, status: newStatus } : inv))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update invoice status');
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await generateInvoice({
        clientId: genForm.clientId,
        subscriptionId: genForm.subscriptionId || undefined,
        amount: Number(genForm.amount),
        dueDate: genForm.dueDate || undefined,
      });
      setGenForm({ clientId: '', subscriptionId: '', amount: '', dueDate: '' });
      fetchInvoices();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate invoice');
    } finally {
      setGenerating(false);
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
          <h1 className="pageTitle">Invoices</h1>
          <p className="pageSubtitle">Billing invoices — manage, send reminders, and track payments</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="cardHeader">
          <h3 className="cardTitle">Generate New Invoice</h3>
        </div>
        <form onSubmit={handleGenerate} className="form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="formGroup">
              <label className="label">Client <span className="required">*</span></label>
              <select className="select" value={genForm.clientId} onChange={(e) => setGenForm({ ...genForm, clientId: e.target.value })} required>
                <option value="">Select client</option>
                {clients.map((c) => (
                  <option key={c.id || c._id} value={c.id || c._id}>{c.name} {c.company ? `(${c.company})` : ''}</option>
                ))}
              </select>
            </div>
            <div className="formGroup">
              <label className="label">Amount (₹) <span className="required">*</span></label>
              <input className="inputField" type="number" value={genForm.amount} onChange={(e) => setGenForm({ ...genForm, amount: e.target.value })} placeholder="0.00" min="0" step="0.01" required />
            </div>
            <div className="formGroup">
              <label className="label">Due Date</label>
              <input className="inputField" type="date" value={genForm.dueDate} onChange={(e) => setGenForm({ ...genForm, dueDate: e.target.value })} />
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <button type="submit" className="btn primary" disabled={generating}>
              {generating ? 'Generating...' : 'Generate Invoice'}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        {error && (
          <div style={{ marginBottom: 16, padding: 12, borderRadius: 10, background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.2)', color: 'var(--admin-danger)', fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{error}</span>
            <button className="btn secondary btnSm" onClick={fetchInvoices}>Retry</button>
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
        ) : invoices.length === 0 ? (
          <div className="emptyState">
            <h3>No Invoices</h3>
            <p>Generate your first invoice using the form above.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Client</th>
                <th>Value</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id || inv._id}>
                  <td><code>{inv.invoiceNumber || inv.id || inv._id}</code></td>
                  <td style={{ fontWeight: 600 }}>{inv.clientName || inv.client?.name || '—'}</td>
                  <td>{formatCurrency(inv.total || inv.amount)}</td>
                  <td>{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                  <td>
                    <span className={`statusTag ${inv.status || 'pending'}`}>
                      {inv.status || 'pending'}
                    </span>
                  </td>
                  <td>
                    <select
                      className="select"
                      value={inv.status || 'pending'}
                      onChange={(e) => handleStatusChange(inv.id || inv._id, e.target.value)}
                      style={{ width: 'auto', padding: '6px 30px 6px 10px', fontSize: 12 }}
                    >
                      <option value="pending">Pending</option>
                      <option value="sent">Sent</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
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
