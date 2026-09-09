import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { getForumThread } from '../../services/api/forumApi.js';
import ForumReplyForm from './ForumReplyForm.jsx';

export default function ForumThread({ threadId }) {
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { setThread((await getForumThread(threadId).catch(() => null)) || null); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [threadId]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="loading">Loading thread...</div>;
  if (!thread) return <p className="textSecondary">Thread not found.</p>;

  return (
    <AdminPage title={thread.title} subtitle="Forum thread">
      <div style={{ display: 'grid', gap: 16 }}>
        {(thread.posts || []).map((post) => (
          <div className="card" key={post.id}>
            <div className="cardHeader"><h3 className="cardTitle">{post.title || 'Post'}</h3></div>
            <div className="cardBody">
              <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
              <p className="textSecondary" style={{ marginTop: 8 }}>By {post.author_name || post.author_id} on {post.created_at ? new Date(post.created_at).toLocaleString() : '-'}</p>
            </div>
          </div>
        ))}
        <ForumReplyForm postId={threadId} onSubmit={() => { /* append reply locally */ }} />
      </div>
    </AdminPage>
  );
}
