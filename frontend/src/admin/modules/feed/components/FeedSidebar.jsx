import React, { useEffect, useState } from 'react';
import { getFeed } from '../../../../services/api/feedApi.js';

export default function FeedSidebar() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getFeed().catch(() => []);
        setFeed(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load feed:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading feed...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Activity Feed</h2>
          <p className="pageSubtitle">Recent platform activities</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {feed.length === 0 ? (
            <div className="emptyState"><h3>No Activity</h3><p>No recent activity.</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {feed.map((item) => (
                <div key={item.id} style={{ padding: '12px', borderBottom: '1px solid var(--admin-border-subtle)' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '13px' }}>{item.message || item.description || 'Activity'}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--admin-text-muted)' }}>{item.created_at ? new Date(item.created_at).toLocaleString() : 'Just now'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
