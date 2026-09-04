import React, { useEffect, useState } from 'react';
import { listBadges, getEarnedBadges } from '../../../services/api/badgeApi.js';

export default function Gamification() {
  const [badges, setBadges] = useState([]);
  const [earned, setEarned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [bRes, eRes] = await Promise.all([listBadges(), getEarnedBadges()]);
      setBadges(bRes?.data || bRes || []);
      setEarned(eRes?.data || eRes || []);
    } catch (err) {
      console.error('Failed to load gamification data', err);
      setError('Failed to load badges and achievements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="loading">Loading gamification data...</div>;
  if (error) return <div className="emptyState">{error}</div>;

  const earnedIds = new Set((earned || []).map(e => e.badgeId || e.id));

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Gamification Engine Settings (Super Admin)</h1>
          <p className="pageSubtitle">Configure achievement badges, XP rules, and earned rewards.</p>
        </div>
        <div className="pageActions">
          <button className="btn btnSecondary" onClick={fetchData}>Refresh</button>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <p>Badge catalog and earned badges overview.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {badges.length === 0 && <div className="emptyState">No badges defined.</div>}
        {badges.map(badge => {
          const isEarned = earnedIds.has(badge.id);
          return (
            <div key={badge.id} className="card" style={{ padding: '16px', background: isEarned ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
              <h4 style={{ margin: 0 }}>{badge.name || badge.title}</h4>
              <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', margin: '8px 0' }}>{badge.description || '-'}</p>
              <span className={`statusTag ${isEarned ? 'active' : 'pending'}`}>{isEarned ? 'Earned' : 'Locked'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
