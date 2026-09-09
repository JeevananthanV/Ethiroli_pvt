import React from 'react';

export default function FeedItem({ item }) {
  const getActionIcon = (type) => {
    const icons = {
      lead_created: '👤',
      lead_updated: '✏️',
      payment_received: '💰',
      expense_logged: '📉',
      employee_added: '👥',
      leave_applied: '📅',
      invoice_generated: '📄',
    };
    return icons[type] || '📢';
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="card" style={{ padding: 14, marginBottom: 10, cursor: 'pointer' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ fontSize: 20, lineHeight: 1 }}>{getActionIcon(item.type)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: 'var(--admin-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.title || item.message || 'Activity'}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--admin-text-muted)' }}>
            {formatTime(item.created_at || item.timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
}
