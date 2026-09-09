import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getTransactions } from '../../services/api/transactionApi.js';
import { listInvoices, batchGenerateInvoices } from '../../services/api/invoiceApi.js';

export default function RecurringSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    frequency: 'monthly',
    amount: '',
    start_date: '',
    end_date: '',
    category: '',
    client_id: '',
    description: '',
  });

  const loadSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      const [txRes, invRes] = await Promise.all([
        getTransactions().catch(() => []),
        listInvoices().catch(() => []),
      ]);
      const transactions = Array.isArray(txRes) ? txRes : [];
      const invoices = Array.isArray(invRes) ? invRes : [];
      const recurring = transactions
        .filter((t) => t.recurring || t.is_recurring)
        .map((t) => ({ ...t, _source: 'transaction' }));
      const invRecurring = invoices
        .filter((i) => i.recurring || i.is_recurring)
        .map((i) => ({ ...i, _source: 'invoice' }));
      setSchedules([...recurring, ...invRecurring]);
    } catch (err) {
      setError(err.message || 'Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.amount || !form.start_date) {
      alert('Name, amount, and start date are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        frequency: form.frequency,
        amount: Number(form.amount),
        start_date: form.start_date,
        end_date: form.end_date || undefined,
        category: form.category,
        client_id: form.client_id,
        description: form.description,
      };
      await batchGenerateInvoices(payload);
      setShowForm(false);
      setForm({
        name: '',
        frequency: 'monthly',
        amount: '',
        start_date: '',
        end_date: '',
        category: '',
        client_id: '',
        description: '',
      });
      loadSchedules();
    } catch (err) {
      alert(`Failed to create schedule: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSchedules((prev) =>
        prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
      );
    } catch (err) {
      alert(`Failed to toggle schedule: ${err.message}`);
    }
  };

  const getStatusClass = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'active':
        return 'active';
      case 'paused':
        return 'pending';
      case 'completed':
        return 'active';
      default:
        return 'pending';
    }
  };

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
      title="Recurring Schedules"
      subtitle="Manage recurring transactions and invoice schedules"
      loading={loading}
      error={error}
      onRetry={loadSchedules}
      actions={
        <button className="btn primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close Form' : 'New Schedule'}
        </button>
      }
    >
      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="cardHeader">
            <h3 className="cardTitle">Create Recurring Schedule</h3>
          </div>
          <div className="cardBody">
            <form onSubmit={handleSubmit} className="form">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div className="formGroup">
                  <label className="label required">Name</label>
                  <input className="inputField" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="formGroup">
                  <label className="label">Frequency</label>
                  <select className="select" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div className="formGroup">
                  <label className="label required">Amount</label>
                  <input className="inputField" type="number" step="0.01" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                </div>
                <div className="formGroup">
                  <label className="label required">Start Date</label>
                  <input className="inputField" type="date" required value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
                </div>
                <div className="formGroup">
                  <label className="label">End Date</label>
                  <input className="inputField" type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
                </div>
                <div className="formGroup">
                  <label className="label">Category</label>
                  <input className="inputField" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                </div>
              </div>
              <div className="formGroup">
                <label className="label">Description</label>
                <textarea className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
              </div>
              <button type="submit" className="btn primary" disabled={saving}>
                {saving ? 'Creating...' : 'Create Schedule'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Scheduled Items</h3>
        </div>
        <div className="cardBody" style={{ overflowX: 'auto' }}>
          {schedules.length === 0 ? (
            <div className="emptyState">No recurring schedules found.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Source</th>
                  <th>Frequency</th>
                  <th>Amount</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => (
                  <tr key={schedule.id}>
                    <td className="textPrimary" style={{ fontWeight: 500 }}>{schedule.name}</td>
                    <td className="textSecondary">{schedule._source}</td>
                    <td className="textSecondary">{schedule.frequency || '-'}</td>
                    <td className="textPrimary" style={{ fontWeight: 500 }}>{formatCurrency(schedule.amount)}</td>
                    <td className="textSecondary">{formatDate(schedule.start_date)}</td>
                    <td className="textSecondary">{formatDate(schedule.end_date)}</td>
                    <td>
                      <span className={`statusTag ${getStatusClass(schedule.status)}`}>
                        {schedule.status || 'active'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn secondary"
                        style={{ padding: '4px 10px', fontSize: 12 }}
                        onClick={() => handleToggle(schedule.id)}
                      >
                        {schedule.active === false ? 'Resume' : 'Pause'}
                      </button>
                    </td>
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
