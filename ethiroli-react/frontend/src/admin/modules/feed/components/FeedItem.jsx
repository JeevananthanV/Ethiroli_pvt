import React from 'react';

export default function FeedItem({ item }) {
  return (
    <div style={{ padding: '12px', borderBottom: '1px solid var(--admin-border-subtle)' }}>
      <p style={{ margin: '0 0 4px', fontSize: '13px' }}>{item.message || item.description || 'Activity'}</p>
      <p style={{ margin: 0, fontSize: '11px', color: 'var(--admin-text-muted)' }}>{item.created_at ? new Date(item.created_at).toLocaleString() : 'Just now'}</p>
    </div>
  );
}
