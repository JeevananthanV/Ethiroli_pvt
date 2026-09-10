import React, { useState, useEffect, useCallback } from 'react'
import forumApi from '../../../../services/api/forumApi'

export default function ForumPostDetail({ postId }) {
  const [post, setPost] = useState(null)
  const [replies, setReplies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchPost = useCallback(async () => {
    try {
      const data = await forumApi.getPost(postId)
      setPost(data)
      setReplies(data.replies || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [postId])

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  const handleVote = async (replyId, value) => {
    try {
      await forumApi.vote(replyId, value)
      setReplies((prev) =>
        prev.map((r) =>
          r.id === replyId ? { ...r, votes: (r.votes || 0) + value } : r
        )
      )
    } catch (error) {
      console.error('Failed to vote:', error)
    }
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!replyText.trim()) return
    setSubmitting(true)
    try {
      const newReply = await forumApi.createReply(postId, { text: replyText })
      setReplies((prev) => [...prev, newReply])
      setReplyText('')
    } catch (error) {
      alert('Failed to post reply: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading post...</div>
  }

  if (error) {
    return <div className="emptyState textDanger">Error: {error}</div>
  }

  if (!post) {
    return <div className="emptyState">Post not found</div>
  }

  return (
    <div className="card">
      <div className="cardBody">
        <div className="mb4">
          <h2 className="textXl fontSemibold textPrimary mb3">{post.title}</h2>
          <div className="flex gap3 mb3">
            <span className="textMuted textSm">By {post.authorName}</span>
            <span className="textMuted textSm">{new Date(post.createdAt).toLocaleString()}</span>
          </div>
          <p className="textSecondary">{post.content}</p>
          <div className="flex gap3 mt3">
            <span className={`statusTag ${post.pinned ? 'active' : 'pending'}`}>
              {post.pinned ? 'Pinned' : 'Normal'}
            </span>
            <span className="textMuted textSm">{post.views || 0} views</span>
          </div>
        </div>

        <div className="border pt4" style={{ borderTop: '1px solid var(--admin-border)' }}>
          <h3 className="fontSemibold textPrimary mb3">{replies.length} Replies</h3>

          {replies.map((reply) => (
            <div key={reply.id} className="card mb3" style={{ border: '1px solid var(--admin-border)' }}>
              <div className="cardBody">
                <div className="flex justifyBetween itemsCenter mb2">
                  <span className="fontSemibold textPrimary">{reply.authorName}</span>
                  <span className="textMuted textSm">{new Date(reply.createdAt).toLocaleString()}</span>
                </div>
                <p className="textSecondary textSm">{reply.text}</p>
                <div className="flex gap3 mt2">
                  <button className="btn secondary small" onClick={() => handleVote(reply.id, 1)}>
                    ▲ {reply.votes || 0}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <form className="form mt4" onSubmit={handleReply}>
          <div className="formGroup">
            <label className="label">Reply</label>
            <textarea
              className="inputField"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={3}
              placeholder="Write your reply..."
            />
          </div>
          <button type="submit" className="btn primary" disabled={submitting || !replyText.trim()}>
            {submitting ? 'Posting...' : 'Post Reply'}
          </button>
        </form>
      </div>
    </div>
  )
}
