import React, { useState } from 'react';

export default function ForumReplyForm({ postId, onSubmit }) {
  const [content, setContent] = useState('');

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ post_id: postId, content });
    setContent('');
  };

  return (
    <form onSubmit={submit} className="form" style={{ marginTop: 16 }}>
      <div className="formGroup">
        <label className="label">Reply</label>
        <textarea className="textarea" value={content} onChange={(e) => setContent(e.target.value)} rows={3} required />
      </div>
      <button type="submit" className="btn primary">Post Reply</button>
    </form>
  );
}
