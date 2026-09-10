import React, { useState } from 'react'
import forumApi from '../../../../services/api/forumApi'

export default function ForumReplyForm({ threadId, onReply }) {
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setSubmitting(true)
    try {
      const reply = await forumApi.createReply(threadId, { text })
      onReply?.(reply)
      setText('')
    } catch (error) {
      alert('Failed to post reply: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="formGroup">
        <label className="label required">Your Reply</label>
        <textarea
          className="inputField"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Write your reply..."
          required
        />
      </div>
      <button type="submit" className="btn primary" disabled={submitting || !text.trim()}>
        {submitting ? 'Posting...' : 'Post Reply'}
      </button>
    </form>
  )
}
