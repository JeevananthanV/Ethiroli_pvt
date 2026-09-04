import React, { useEffect, useState, useRef } from 'react';
import { listClients } from '../../../services/api/clientApi.js';
import { createSubscription, updateSubscription, listSubscriptions } from '../../../services/api/subscriptionApi.js';

const emptyForm = {
  clientId: '',
  planName: 'Standard',
  amount: '',
  billingCycle: 'monthly',
  startDate: new Date().toISOString().split('T')[0],
  renewalDate: '',
  status: 'active',
};

export default function SubscriptionForm({ editingId, onClose, onSaved }) {
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    (async () => {
      try {
        setClientsLoading(true);
        const data = await listClients({ per_page: 100 });
        const list = Array.isArray(data) ? data : data.clients || data.data || [];
        setClients(list);
      } catch (err) {
        setFormError('Failed to load client list. Please try again.');
      } finally {
        setClientsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!editingId) {
      setForm(emptyForm);
      return;
    }
    (async () => {
      try {
        const [allSubsResponse] = await Promise.all([
          listSubscriptions({}),
        ]);
        const all = Array.isArray(allSubsResponse) ? allSubsResponse : allSubsResponse.subscriptions || allSubsResponse.data || [];
        const found = all.find((s) => (s.id || s._id) === editingId);
        if (found) {
          setForm({
            clientId: found.clientId || found.client?.id || found.client?._id || '',
            planName: found.planName || found.plan || 'Standard',
            amount: found.amount ?? '',
            billingCycle: found.billingCycle || 'monthly',
            startDate: found.startDate ? new Date(found.startDate).toISOString().split('T')[0] : '',
            renewalDate: found.renewalDate || found.endDate ? new Date(found.renewalDate || found.endDate).toISOString().split('T')[0] : '',
            status: found.status || 'active',
          });
        }
      } catch (err) {
        setFormError('Failed to load subscription details.');
      }
    })();
  }, [editingId]);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setFormError(null);
  };

  const validate = () => {
    if (!form.clientId) return 'Please select a client.';
    if (!form.amount || Number(form.amount) <= 0) return 'Amount must be a positive number.';
    if (!form.startDate) return 'Start date is required.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      const payload = {
        clientId: form.clientId,
        planName: form.planName,
        amount: Number(form.amount),
        billingCycle: form.billingCycle,
        startDate: form.startDate,
        renewalDate: form.renewalDate || undefined,
        status: form.status,
      };
      if (editingId) {
        await updateSubscription(editingId, payload);
      } else {
        await createSubscription(payload);
      }
      onSaved?.();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save subscription');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="cardHeader">
        <h3 className="cardTitle">{editingId ? 'Edit Subscription' : 'New Subscription'}</h3>
        <button type="button" className="btn secondary btnSm" onClick={onClose}>Close</button>
      </div>

      {formError && (
        <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 8, background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.2)', color: 'var(--admin-danger)', fontSize: 13 }}>
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="formGroup">
            <label className="label">Client <span className="required">*</span></label>
            {clientsLoading ? (
              <div className="loading" style={{ padding: '8px 0', justifyContent: 'flex-start' }}>
                <div className="skeleton" style={{ width: '100%', height: 40, borderRadius: 8 }}></div>
              </div>
            ) : (
              <select className="select" value={form.clientId} onChange={handleChange('clientId')} required>
                <option value="">Select client</option>
                {clients.map((c) => (
                  <option key={c.id || c._id} value={c.id || c._id}>{c.name} {c.company ? `(${c.company})` : ''}</option>
                ))}
              </select>
            )}
          </div>
          <div className="formGroup">
            <label className="label">Plan Name</label>
            <input className="inputField" value={form.planName} onChange={handleChange('planName')} placeholder="e.g. Premium" />
          </div>
          <div className="formGroup">
            <label className="label">Amount (₹) <span className="required">*</span></label>
            <input className="inputField" type="number" value={form.amount} onChange={handleChange('amount')} placeholder="0.00" min="0" step="0.01" required />
          </div>
          <div className="formGroup">
            <label className="label">Billing Cycle</label>
            <select className="select" value={form.billingCycle} onChange={handleChange('billingCycle')}>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="half-yearly">Half-Yearly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="formGroup">
            <label className="label">Start Date <span className="required">*</span></label>
            <input className="inputField" type="date" value={form.startDate} onChange={handleChange('startDate')} required />
          </div>
          <div className="formGroup">
            <label className="label">Renewal / End Date</label>
            <input className="inputField" type="date" value={form.renewalDate} onChange={handleChange('renewalDate')} />
          </div>
          <div className="formGroup">
            <label className="label">Status</label>
            <select className="select" value={form.status} onChange={handleChange('status')}>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" className="btn primary" disabled={submitting || clientsLoading}>
            {submitting ? 'Saving...' : editingId ? 'Update Subscription' : 'Create Subscription'}
          </button>
          <button type="button" className="btn secondary" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
