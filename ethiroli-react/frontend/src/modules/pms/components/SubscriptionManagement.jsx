import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listSubscriptions, updateSubscription, deleteSubscription } from '../../services/api/subscriptionApi.js';

export default function SubscriptionManagement() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ status: '', plan: '' });

  const loadSubscriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = filterStatus ? { status: filterStatus } : {};
      const data = await listSubscriptions(params);
      setSubscriptions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, [filterStatus]);

  const handleEdit = (sub) => {
    setEditingId(sub.id);
    setEditForm({ status: sub.status || 'active', plan: sub.plan || 'basic' });
  };

  const handleSaveEdit = async (id) => {
    setSaving(true);
    try {
      await updateSubscription(id, editForm);
      setEditingId(null);
      loadSubscriptions();
    } catch (err) {
      alert(`Failed to update: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subscription?')) return;
    try {
      await deleteSubscription(id);
      loadSubscriptions();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const getStatusClass = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'active':
        return 'active';
      case 'expired':
      case 'cancelled':
        return 'error';
      case 'pending':
        return 'pending';
      default:
        return 'pending';
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const activeCount = subscriptions.filter((s) => s.status === 'active').length;
  const expiredCount = subscriptions.filter((s) => s.status === 'expired' || s.status === 'cancelled').length;

  return (
    <AdminPage
      title="Subscription Management"
      subtitle="Manage tenant subscriptions and billing plans"
      loading={loading}
      error={error}
      onRetry={loadSubscriptions}
      actions={
        <select className="select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="statCard">
          <div className="statLabel">Total Subscriptions</div>
          <div className="statValue">{subscriptions.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Active</div>
          <div className="statValue textSuccess">{activeCount}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Expired / Cancelled</div>
          <div className="statValue textDanger">{expiredCount}</div>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Subscriptions</h3>
        </div>
        <div className="cardBody" style={{ overflowX: 'auto' }}>
          {subscriptions.length === 0 ? (
            <div className="emptyState">No subscriptions found.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tenant</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Started</th>
                  <th>Expires</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub.id}>
                    <td className="textSecondary"><code>{sub.id}</code></td>
                    <td className="textPrimary" style={{ fontWeight: 500 }}>{sub.tenant_name || sub.tenant_id || '-'}</td>
                    <td className="textSecondary">{sub.plan || 'basic'}</td>
                    <td>
                      {editingId === sub.id ? (
                        <select
                          className="select"
                          value={editForm.status}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                          style={{ minWidth: 120 }}
                        >
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="expired">Expired</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <span className={`statusTag ${getStatusClass(sub.status)}`}>
                          {sub.status || 'active'}
                        </span>
                      )}
                    </td>
                    <td className="textSecondary">{formatDate(sub.start_date || sub.created_at)}</td>
                    <td className="textSecondary">{formatDate(sub.end_date || sub.expires_at)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {editingId === sub.id ? (
                          <>
                            <button className="btn primary" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => handleSaveEdit(sub.id)} disabled={saving}>
                              {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button className="btn secondary" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => setEditingId(null)}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button className="btn secondary" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => handleEdit(sub)}>Edit</button>
                            <button className="btn danger" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => handleDelete(sub.id)}>Delete</button>
                          </>
                        )}
                      </div>
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
