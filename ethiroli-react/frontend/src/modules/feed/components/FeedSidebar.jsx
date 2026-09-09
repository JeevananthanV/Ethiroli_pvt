import React, { useEffect, useState } from 'react';
import { getFeed } from '../services/api/feedApi.js';
import FeedItem from './FeedItem.jsx';

export default function FeedSidebar() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchFeed = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFeed({ limit: 50 });
      setActivities(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load activity feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const filtered = filter === 'all' ? activities : activities.filter((a) => a.type === filter);

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="cardHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="cardTitle">Activity Feed</h3>
        <button className="btn secondary" onClick={fetchFeed} style={{ padding: '4px 10px', fontSize: 12 }}>Refresh</button>
      </div>
      <div style={{ padding: '0 16px 8px', display: 'flex', gap: 8 }}>
        {['all', 'lead_created', 'payment_received', 'leave_applied', 'expense_logged'].map((f) => (
          <button
            key={f}
            className={`btn ${filter === f ? 'primary' : ''}`}
            onClick={() => setFilter(f)}
            style={{ padding: '4px 10px', fontSize: 11, textTransform: 'capitalize' }}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>
      <div className="cardBody" style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div className="loading">Loading feed...</div>
        ) : error ? (
          <p style={{ color: 'var(--admin-danger)' }}>{error}</p>
        ) : filtered.length === 0 ? (
          <div className="emptyState">
            <h4>No activities</h4>
            <p>Recent actions will appear here.</p>
          </div>
        ) : (
          filtered.map((activity) => (
            <FeedItem key={activity.id} item={activity} />
          ))
        )}
      </div>
    </div>
  );
}
