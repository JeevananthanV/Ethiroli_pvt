import React, { useEffect, useState } from 'react';
import { listBadges, getEarnedBadges } from '../../../services/api/badgeApi.js';

export default function BadgeDisplay({ userId }) {
  const [badges, setBadges] = useState([]);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchBadges = async () => {
      setLoading(true);
      setError(null);
      try {
        const [allBadges, earned] = await Promise.all([
          listBadges(),
          getEarnedBadges(userId)
        ]);
        setBadges(Array.isArray(allBadges) ? allBadges : []);
        setEarnedBadges(Array.isArray(earned) ? earned : []);
      } catch (err) {
        setError(err.message || 'Failed to load badges');
      } finally {
        setLoading(false);
      }
    };
    fetchBadges();
  }, [userId]);

  const earnedIds = new Set(earnedBadges.map(b => b.id || b.badgeId));
  const filteredBadges = filter === 'earned'
    ? badges.filter(b => earnedIds.has(b.id))
    : filter === 'locked'
      ? badges.filter(b => !earnedIds.has(b.id))
      : badges;

  const getBadgeIcon = (type) => {
    const icons = {
      achievement: '🏆',
      milestone: '🎯',
      skill: '⭐',
      participation: '🤝',
      excellence: '👑'
    };
    return icons[type] || '🏅';
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">Loading badges...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{borderColor: 'rgba(244, 63, 94, 0.3)', background: 'rgba(244, 63, 94, 0.05)'}}>
        <p style={{color: 'var(--admin-danger)', margin: 0}}>{error}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12}}>
        <div>
          <h3 style={{margin: '0 0 4px', fontSize: 18, fontWeight: 700}}>Badges & Achievements</h3>
          <p style={{margin: 0, color: 'var(--admin-text-muted)', fontSize: 13.5}}>
            {earnedBadges.length} of {badges.length} badges earned
          </p>
        </div>
        <div style={{display: 'flex', gap: 6}}>
          {['all', 'earned', 'locked'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn ${filter === f ? 'primary' : 'secondary'} btnSm`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredBadges.length === 0 ? (
        <div className="emptyState">
          <h3>No badges to display</h3>
          <p>Complete courses and activities to earn badges</p>
        </div>
      ) : (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16}}>
          {filteredBadges.map(badge => {
            const isEarned = earnedIds.has(badge.id);
            return (
              <div
                key={badge.id}
                className="card"
                style={{
                  textAlign: 'center',
                  padding: '20px 16px',
                  opacity: isEarned ? 1 : 0.5,
                  borderColor: isEarned ? 'rgba(168, 85, 247, 0.3)' : undefined,
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{fontSize: 36, marginBottom: 10}}>{getBadgeIcon(badge.type)}</div>
                <h4 style={{margin: '0 0 6px', fontSize: 14, fontWeight: 600}}>{badge.name}</h4>
                <p style={{margin: 0, fontSize: 12, color: 'var(--admin-text-muted)'}}>{badge.description}</p>
                <div style={{marginTop: 10}}>
                  <span className={`statusTag ${isEarned ? 'active' : 'inactive'}`}>
                    {isEarned ? 'Earned' : 'Locked'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
