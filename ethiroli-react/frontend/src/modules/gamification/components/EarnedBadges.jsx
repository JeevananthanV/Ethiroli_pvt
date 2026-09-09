import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getEarnedBadges } from '../../services/api/badgeApi.js';

export default function EarnedBadges() {
  const [earned, setEarned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEarned = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEarnedBadges();
      setEarned(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load earned badges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEarned();
  }, []);

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <AdminPage
      title="Earned Badges"
      subtitle="Track badge awards across users"
      loading={loading}
      error={error}
      onRetry={loadEarned}
    >
      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Badge Registry</h3>
        </div>
        <div className="cardBody" style={{ overflowX: 'auto' }}>
          {earned.length === 0 ? (
            <div className="emptyState">
              <h3>No badges earned yet</h3>
              <p>Awarded badges will appear here once users earn them.</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Badge</th>
                  <th>User ID</th>
                  <th>Badge Name</th>
                  <th>Earned At</th>
                  <th>Criteria</th>
                </tr>
              </thead>
              <tbody>
                {earned.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontSize: 24 }}>{item.badge?.icon || item.icon || '🏅'}</td>
                    <td className="textSecondary"><code>{item.user_id}</code></td>
                    <td className="textPrimary" style={{ fontWeight: 500 }}>{item.badge?.name || item.badge_name || 'Unknown'}</td>
                    <td className="textSecondary">{formatDate(item.earned_at || item.created_at)}</td>
                    <td className="textSecondary">{item.badge?.criteria_type || item.criteria_type || '-'}</td>
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
