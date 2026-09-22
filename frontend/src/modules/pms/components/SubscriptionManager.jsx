import React, { useEffect, useState, useCallback, useRef } from 'react';
import { listSubscriptions, deleteSubscription } from '../../../services/api/subscriptionApi.js';
import SubscriptionForm from './SubscriptionForm.jsx';
import InvoiceFromSubscription from './InvoiceFromSubscription.jsx';

const STATUS_FILTERS = ['all', 'active', 'pending', 'inactive', 'expired'];

export default function SubscriptionManager() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [invoiceSubId, setInvoiceSubId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const searchTimerRef = useRef(null);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'all') params.status = statusFilter;
      const data = await listSubscriptions(params);
      setSubscriptions(Array.isArray(data) ? data : data.subscriptions || data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      fetchSubscriptions();
    }, 400);
    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
  }, [fetchSubscriptions]);

  const handleEdit = (sub) => {
    setEditingId(sub.id || sub._id);
    setShowForm(true);
  };

  const handleGenerateInvoice = (sub) => {
    setInvoiceSubId(sub.id || sub._id);
    setShowInvoiceForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subscription? This action cannot be undone.')) return;
    try {
      await deleteSubscription(id);
      setSubscriptions((prev) => prev.filter((s) => (s.id || s._id) !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete subscription');
    }
  };

  const formatCurrency = (val) => {
    if (val === null || val === undefined || val === '') return '—';
    return '₹' + Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const retryFetch = () => fetchSubscriptions();

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Subscriptions</h1>
          <p className="pageSubtitle">Manage recurring client subscriptions and billing cycles</p>
        </div>
        <div className="pageActions">
          <input
            type="text"
            className="inputField"
            placeholder="Search subscriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 220 }}
          />
          <select
            className="select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: 140 }}
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <button className="btn primary" onClick={() => { setEditingId(null); setShowForm(true); }}>
            + New Subscription
          </button>
        </div>
      </div>

      {showForm && (
        <div style={{ marginBottom: 24 }}>
          <SubscriptionForm
            editingId={editingId}
            onClose={() => { setShowForm(false); setEditingId(null); }}
            onSaved={() => { setShowForm(false); setEditingId(null); fetchSubscriptions(); }}
          />
        </div>
      )}

      {showInvoiceForm && (
        <div style={{ marginBottom: 24 }}>
          <InvoiceFromSubscription
            subscriptionId={invoiceSubId}
            onClose={() => { setShowInvoiceForm(false); setInvoiceSubId(null); }}
            onSaved={() => { setShowInvoiceForm(false); setInvoiceSubId(null); fetchSubscriptions(); }}
          />
        </div>
      )}

      <div className="card">
        {error && (
          <div style={{ marginBottom: 16, padding: 12, borderRadius: 10, background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.2)', color: 'var(--admin-danger)', fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{error}</span>
            <button className="btn secondary btnSm" onClick={retryFetch}>Retry</button>
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
        ) : subscriptions.length === 0 ? (
          <div className="emptyState">
            <h3>No Subscriptions Found</h3>
            <p>{search || statusFilter !== 'all' ? 'No subscriptions match your filters. Try adjusting your search or filter.' : 'Create a subscription to start billing clients on a recurring schedule.'}</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Billing Cycle</th>
                <th>Start Date</th>
                <th>Renewal Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id || sub._id}>
                  <td style={{ fontWeight: 600 }}>{sub.clientName || sub.client?.name || '—'}</td>
                  <td>{sub.planName || sub.plan || 'Standard'}</td>
                  <td>{formatCurrency(sub.amount)}</td>
                  <td style={{ textTransform: 'capitalize' }}>{sub.billingCycle || 'monthly'}</td>
                  <td>{formatDate(sub.startDate)}</td>
                  <td>{formatDate(sub.renewalDate || sub.endDate)}</td>
                  <td>
                    <span className={`statusTag ${sub.status || 'active'}`}>
                      {sub.status || 'active'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button className="btn secondary btnSm" onClick={() => handleEdit(sub)}>Edit</button>
                      <button className="btn primary btnSm" onClick={() => handleGenerateInvoice(sub)}>Invoice</button>
                      <button className="btn danger btnSm" onClick={() => handleDelete(sub.id || sub._id)}>Delete</button>
                    </div>
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
