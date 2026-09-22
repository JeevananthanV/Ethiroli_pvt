import React from 'react'

export default function FeedItem({ item, onLike, onComment }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const now = new Date()
    const diff = (now - date) / 1000
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return date.toLocaleDateString()
  }

  const handleLike = async () => {
    try {
      await onLike?.(item.id)
    } catch (err) {
      console.error('Failed to like:', err)
    }
  }

  const getAuthorColor = (author) => {
    if (!author) return 'var(--admin-text-muted)'
    const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6']
    const index = (author?.charCodeAt?.(0) || 0) % colors.length
    return colors[index]
  }

  return (
    <div className="card" style={{ marginBottom: '12px' }}>
      <div className="cardBody" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: getAuthorColor(item.author),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 600,
              fontSize: '14px',
              flexShrink: 0,
            }}
          >
            {(item.author || 'U').charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--admin-text-primary)' }}>{item.author || 'Unknown User'}</div>
            <div className="textMuted" style={{ fontSize: '12px' }}>{formatDate(item.createdAt || item.date)}</div>
          </div>
          {item.type && (
            <span className={`statusTag ${item.type === 'announcement' ? 'active' : 'pending'}`} style={{ fontSize: '11px' }}>
              {item.type}
            </span>
          )}
        </div>

        {item.title && (
          <h4 style={{ margin: '0 0 6px', fontSize: '15px', color: 'var(--admin-text-primary)', fontWeight: 600 }}>{item.title}</h4>
        )}

        {item.content && (
          <p style={{ margin: '0 0 10px', color: 'var(--admin-text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>{item.content}</p>
        )}

        {item.mediaUrl && (
          <img
            src={item.mediaUrl}
            alt="Feed media"
            style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }}
          />
        )}

        <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--admin-border)', paddingTop: '10px' }}>
          <button
            onClick={handleLike}
            style={{
              background: 'none',
              border: 'none',
              color: item.likedByUser ? 'var(--admin-danger)' : 'var(--admin-text-muted)',
              cursor: 'pointer',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 0',
            }}
          >
            {item.likedByUser ? '❤️' : '🤍'} {item.likes || 0}
          </button>
          <button
            onClick={() => onComment?.(item)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--admin-text-muted)',
              cursor: 'pointer',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 0',
            }}
          >
            💬 {item.comments?.length || 0}
          </button>
          {item.category && (
            <span className="textMuted" style={{ fontSize: '12px', alignSelf: 'center' }}>
              #{item.category}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
