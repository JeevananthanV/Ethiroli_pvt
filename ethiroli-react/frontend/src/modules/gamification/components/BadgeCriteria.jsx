import React, { useEffect, useState } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { getBadges, createBadge } from '../../services/api/badgeApi.js';

export default function BadgeCriteria() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    icon: '',
    criteria_type: 'points',
    threshold: '',
    reward_points: '',
    conditions: {},
  });

  const loadBadges = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBadges();
      setBadges(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load badges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBadges();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.threshold) {
      alert('Name and threshold are required');
      return;
    }
    setSaving(true);
    try {
      await createBadge({
        name: form.name,
        description: form.description,
        icon: form.icon,
        criteria_type: form.criteria_type,
        threshold: Number(form.threshold),
        reward_points: Number(form.reward_points) || 0,
        conditions: form.conditions,
      });
      setShowForm(false);
      setForm({
        name: '',
        description: '',
        icon: '',
        criteria_type: 'points',
        threshold: '',
        reward_points: '',
        conditions: {},
      });
      loadBadges();
    } catch (err) {
      alert(`Failed to create badge: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPage
      title="Badge Criteria"
      subtitle="Define conditions, thresholds, and rewards for badges"
      loading={loading}
      error={error}
      onRetry={loadBadges}
      actions={
        <button className="btn primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close Form' : 'New Badge'}
        </button>
      }
    >
      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="cardHeader">
            <h3 className="cardTitle">Define Badge Criteria</h3>
          </div>
          <div className="cardBody">
            <form onSubmit={handleSubmit} className="form">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div className="formGroup">
                  <label className="label required">Badge Name</label>
                  <input className="inputField" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="formGroup">
                  <label className="label">Icon</label>
                  <input className="inputField" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="e.g. 🏆" />
                </div>
                <div className="formGroup">
                  <label className="label">Criteria Type</label>
                  <select className="select" value={form.criteria_type} onChange={(e) => setForm({ ...form, criteria_type: e.target.value })}>
                    <option value="points">Points</option>
                    <option value="streak">Streak</option>
                    <option value="completion">Completion</option>
                    <option value="referral">Referral</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div className="formGroup">
                  <label className="label required">Threshold</label>
                  <input className="inputField" type="number" required value={form.threshold} onChange={(e) => setForm({ ...form, threshold: e.target.value })} />
                </div>
                <div className="formGroup">
                  <label className="label">Reward Points</label>
                  <input className="inputField" type="number" value={form.reward_points} onChange={(e) => setForm({ ...form, reward_points: e.target.value })} />
                </div>
              </div>
              <div className="formGroup">
                <label className="label">Description</label>
                <textarea
                  className="textarea"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="formGroup">
                <label className="label">Conditions (JSON)</label>
                <textarea
                  className="textarea"
                  value={JSON.stringify(form.conditions, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setForm({ ...form, conditions: parsed });
                    } catch {
                      // ignore invalid JSON
                    }
                  }}
                  rows={3}
                />
              </div>
              <button type="submit" className="btn primary" disabled={saving}>
                {saving ? 'Creating...' : 'Create Badge'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Badge Definitions</h3>
        </div>
        <div className="cardBody" style={{ overflowX: 'auto' }}>
          {badges.length === 0 ? (
            <div className="emptyState">No badges defined.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Icon</th>
                  <th>Name</th>
                  <th>Criteria</th>
                  <th>Threshold</th>
                  <th>Reward</th>
                </tr>
              </thead>
              <tbody>
                {badges.map((badge) => (
                  <tr key={badge.id}>
                    <td style={{ fontSize: 24 }}>{badge.icon || '🏅'}</td>
                    <td className="textPrimary" style={{ fontWeight: 500 }}>{badge.name}</td>
                    <td className="textSecondary">{badge.criteria_type}</td>
                    <td className="textSecondary">{badge.threshold}</td>
                    <td className="textSecondary">{badge.reward_points || 0} pts</td>
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
