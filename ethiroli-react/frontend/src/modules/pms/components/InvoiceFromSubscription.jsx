import React, { useEffect, useState } from 'react';
import { getSubscription } from '../../../services/api/subscriptionApi.js';
import { generateInvoice, batchGenerateInvoices } from '../../../services/api/invoiceApi.js';

export default function InvoiceFromSubscription({ subscriptionId, onClose, onSaved }) {
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setFormError(null);
        setSuccess(false);
        const data = await getSubscription(subscriptionId);
        if (!cancelled) {
          setSub(data);
          const renewal = data.renewalDate || data.endDate;
          if (renewal) setDueDate(new Date(renewal).toISOString().split('T')[0]);
        }
      } catch (err) {
        if (!cancelled) setFormError('Failed to load subscription details');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [subscriptionId]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setSuccess(false);
    try {
      await generateInvoice({
        subscriptionId,
        dueDate: dueDate || undefined,
        notes: notes || undefined,
      });
      setSuccess(true);
      setTimeout(() => {
        onSaved?.();
      }, 800);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to generate invoice');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (val) => {
    if (val === null || val === undefined || val === '') return '₹0.00';
    return '₹' + Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }}></div>
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ width: '60%', height: 16, marginBottom: 8 }}></div>
            <div className="skeleton" style={{ width: '40%', height: 12 }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!sub) {
    return (
      <div className="card">
        <p style={{ color: 'var(--admin-text-muted)' }}>Subscription not found.</p>
        <button className="btn secondary" onClick={onClose} style={{ marginTop: 12 }}>Close</button>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="cardHeader">
        <h3 className="cardTitle">Generate Invoice from Subscription</h3>
        <button type="button" className="btn secondary btnSm" onClick={onClose}>Close</button>
      </div>

      {formError && (
        <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 8, background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.2)', color: 'var(--admin-danger)', fontSize: 13 }}>
          {formError}
        </div>
      )}

      {success && (
        <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 8, background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', color: 'var(--admin-success)', fontSize: 13 }}>
          Invoice generated successfully!
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        <div className="statCard">
          <p className="statLabel">Client</p>
          <p className="statValue" style={{ fontSize: 16 }}>{sub.clientName || sub.client?.name || '—'}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Plan</p>
          <p className="statValue" style={{ fontSize: 16 }}>{sub.planName || sub.plan || 'Standard'}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Amount</p>
          <p className="statValue" style={{ fontSize: 16 }}>{formatCurrency(sub.amount)}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Billing Cycle</p>
          <p className="statValue" style={{ fontSize: 16, textTransform: 'capitalize' }}>{sub.billingCycle || 'monthly'}</p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="formGroup">
            <label className="label">Due Date</label>
            <input
              className="inputField"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="formGroup">
            <label className="label">Notes</label>
            <input
              className="inputField"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional invoice notes"
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button type="submit" className="btn primary" disabled={submitting || success}>
            {submitting ? 'Generating...' : success ? '✓ Generated' : `Generate Invoice for ${formatCurrency(sub.amount)}`}
          </button>
          <button type="button" className="btn secondary" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
