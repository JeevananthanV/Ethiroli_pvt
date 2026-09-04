import React, { useEffect, useState } from 'react';
import { getBadges, createBadge, getUserBadges } from '../../../services/api/badgeApi.js';

export default function BadgeList() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newBadge, setNewBadge] = useState({ name: '', description: '', criteria: '' });

  const loadBadges = async () => {
    setLoading(true);
    try {
      const data = await getBadges();
      setBadges(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load badges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBadges();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createBadge({ name: newBadge.name, description: newBadge.description, criteria: newBadge.criteria });
      setShowCreate(false);
      setNewBadge({ name: '', description: '', criteria: '' });
      loadBadges();
    } catch (err) {
      console.error('Failed to create badge:', err);
    }
  };

  if (loading) return <div className="loading">Loading badges...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Achievements & Badges</h2>
          <p className="pageSubtitle">Configure badge parameters and award criteria</p>
        </div>
        <div className="pageActions">
          <button onClick={() => setShowCreate(true)} className="btn btnPrimary">+ Create Badge</button>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {badges.length === 0 ? (
            <p style={{ color: 'var(--admin-text-secondary)' }}>No badges configured.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              {badges.map((badge) => (
                <div key={badge.id} className="statCard" style={{ textAlign: 'center', padding: '24px' }}>
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>{badge.icon || '🏆'}</div>
                  <h4 style={{ margin: '0 0 8px' }}>{badge.name}</h4>
                  <p style={{ color: 'var(--admin-text-secondary)', fontSize: '13px' }}>{badge.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showCreate && (
        <div className="modalOverlay" onClick={() => setShowCreate(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3>Create Badge</h3>
            <form onSubmit={handleCreate}>
              <div className="formGroup">
                <label className="label">Badge Name</label>
                <input className="input" value={newBadge.name} onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })} required />
              </div>
              <div className="formGroup">
                <label className="label">Description</label>
                <textarea className="textarea" value={newBadge.description} onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })} required />
              </div>
              <div className="formGroup">
                <label className="label">Criteria</label>
                <input className="input" value={newBadge.criteria} onChange={(e) => setNewBadge({ ...newBadge, criteria: e.target.value })} required />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowCreate(false)} className="btn">Cancel</button>
                <button type="submit" className="btn btnPrimary">Create Badge</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
