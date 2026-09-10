import React, { useEffect, useState } from 'react';
import { getBadges, getUserBadges } from '../../../services/api/badgeApi.js';

export default function Gamification() {
  const [badges, setBadges] = useState([]);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [badgesRes, earnedRes] = await Promise.all([
        getBadges().catch(() => []),
        getUserBadges().catch(() => []),
      ]);
      setBadges(Array.isArray(badgesRes) ? badgesRes : []);
      setEarnedBadges(Array.isArray(earnedRes) ? earnedRes : []);
    } catch (err) {
      console.error('Failed to load gamification data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <div className="loading">Loading badges...</div>;

  const earnedIds = new Set(earnedBadges.map((b) => b.id || b.badge_id));

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Gamification</h2>
          <p className="pageSubtitle">Badges and achievements</p>
        </div>
      </div>
      <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Badge Catalog ({badges.length})</h3></div>
          <div className="cardBody">
            {badges.length === 0 ? (
              <p style={{ color: 'var(--admin-text-secondary)' }}>No badges configured.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                {badges.map((badge) => (
                  <div key={badge.id} className="statCard" style={{ textAlign: 'center', padding: '24px', opacity: earnedIds.has(badge.id) ? 1 : 0.7 }}>
                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>{badge.icon || '🏆'}</div>
                    <h4 style={{ margin: '0 0 8px' }}>{badge.name}</h4>
                    <p style={{ color: 'var(--admin-text-secondary)', fontSize: '13px' }}>{badge.description}</p>
                    {earnedIds.has(badge.id) && <span className="statusTag active" style={{ marginTop: '8px', display: 'inline-block' }}>Earned</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
