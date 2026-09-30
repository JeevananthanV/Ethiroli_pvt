import React, { useState, useEffect, useCallback } from 'react';
import forumApi from '../../../../services/api/forumApi'
import ForumReplyForm from './ForumReplyForm'

export default function ForumThread({ threadId }) {
  const [thread, setThread] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchThread = useCallback(async () => {
    try {
      const data = await forumApi.getThread(threadId)
      setThread(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [threadId])

  useEffect(() => {
    fetchThread()
  }, [fetchThread])

  if (loading) return <div className="loading">Loading thread...</div>
  if (error) return <div className="emptyState textDanger">Error: {error}</div>
  if (!thread) return <div className="emptyState">Thread not found</div>

  return (
    <div className="card">
      <div className="cardBody">
        <div className="mb4">
          <div className="flex justifyBetween itemsCenter mb3">
            <h2 className="textXl fontSemibold textPrimary">{thread.title}</h2>
            <span className={`statusTag ${thread.pinned ? 'active' : 'pending'}`}>
              {thread.pinned ? 'Pinned' : 'Normal'}
            </span>
          </div>
          <div className="flex gap3 mb3">
            <span className="textMuted textSm">By {thread.authorName}</span>
            <span className="textMuted textSm">{new Date(thread.createdAt).toLocaleString()}</span>
          </div>
          <p className="textSecondary mb3">{thread.content}</p>
          <div className="flex gap3">
            <span className="textMuted textSm">{thread.views || 0} views</span>
            <span className="textMuted textSm">{thread.replies?.length || 0} replies</span>
          </div>
        </div>

        <div className="border pt4" style={{ borderTop: '1px solid var(--admin-border)' }}>
          <h3 className="fontSemibold textPrimary mb3">Replies</h3>
          {thread.replies?.length === 0 ? (
            <p className="textMuted">No replies yet. Be the first to reply!</p>
          ) : (
            <div className="flex flexCol gap3">
              {thread.replies?.map((reply) => (
                <div key={reply.id} className="card" style={{ border: '1px solid var(--admin-border)' }}>
                  <div className="cardBody">
                    <div className="flex justifyBetween itemsCenter mb2">
                      <span className="fontSemibold textPrimary">{reply.authorName}</span>
                      <span className="textMuted textSm">{new Date(reply.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="textSecondary textSm">{reply.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt4">
          <ForumReplyForm threadId={threadId} onReply={(reply) => setThread((prev) => ({
            ...prev,
            replies: [...(prev.replies || []), reply],
          }))} />
        </div>
      </div>
    </div>
  )
}
