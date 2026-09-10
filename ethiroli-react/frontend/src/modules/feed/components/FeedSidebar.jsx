import React, { useState, useEffect, useCallback } from 'react'
import { feedApi } from '../../../services/api/feedApi.js'
import FeedItem from './FeedItem.jsx'

export default function FeedSidebar() {
  const [feedItems, setFeedItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [commentingOn, setCommentingOn] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    loadFeed()
  }, [loadFeed])

  const loadFeed = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await feedApi.getAll()
      let items = Array.isArray(data) ? data : []
      if (filter) {
        items = items.filter((item) => item.type === filter || item.category === filter)
      }
      setFeedItems(items)
    } catch (err) {
      setError(err.message || 'Failed to load feed')
    } finally {
      setLoading(false)
    }
  }, [filter])

  const handleLike = async (id) => {
    try {
      await feedApi.like(id)
      setFeedItems(feedItems.map((item) => (item.id === id ? { ...item, likes: (item.likes || 0) + 1, likedByUser: true } : item)))
    } catch (err) {
      console.error('Failed to like:', err)
    }
  }

  const handleComment = async (item) => {
    if (!commentText.trim()) return
    setCommentingOn(item.id)
    try {
      await feedApi.comment(item.id, commentText)
      setFeedItems(
        feedItems.map((f) =>
          f.id === item.id
            ? { ...f, comments: [...(f.comments || []), { text: commentText, createdAt: new Date().toISOString() }] }
            : f
        )
      )
      setCommentText('')
      setCommentingOn(null)
    } catch (err) {
      console.error('Failed to comment:', err)
      setCommentingOn(null)
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="cardBody">
          <div className="loading">
            <div className="skeleton" style={{ width: '100%', height: '200px' }} />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="cardBody">
          <div className="emptyState">
            <h3 className="textDanger">Error Loading Feed</h3>
            <p className="textSecondary">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="cardHeader">
        <h3 className="cardTitle">Activity Feed</h3>
        <select className="select" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: '130px', fontSize: '12px' }}>
          <option value="">All</option>
          <option value="announcement">Announcements</option>
          <option value="update">Updates</option>
          <option value="event">Events</option>
        </select>
      </div>
      <div className="cardBody" style={{ padding: '12px', maxHeight: '600px', overflowY: 'auto' }}>
        {feedItems.length === 0 ? (
          <div className="emptyState">
            <p className="textMuted">No activity yet</p>
          </div>
        ) : (
          feedItems.map((item) => (
            <div key={item.id}>
              <FeedItem item={item} onLike={handleLike} onComment={setCommentingOn} />
              {commentingOn === item.id && (
                <div style={{ marginLeft: '20px', marginBottom: '12px' }}>
                  <div className="formGroup" style={{ marginBottom: '8px' }}>
                    <textarea
                      className="inputField"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      rows={2}
                      style={{ resize: 'vertical', fontSize: '13px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <Button size="small" variant="secondary" onClick={() => { setCommentingOn(null); setCommentText('') }}>
                      Cancel
                    </Button>
                    <Button size="small" variant="primary" onClick={() => handleComment(item)} disabled={!commentText.trim()}>
                      Comment
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
