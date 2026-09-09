import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { getForumPost } from '../../services/api/forumApi.js';

export default function ForumPostDetail({ postId }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { setPost((await getForumPost(postId).catch(() => null)) || null); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [postId]);

  if (loading) return <div className="loading">Loading post...</div>;
  if (!post) return <p className="textSecondary">Post not found.</p>;

  return (
    <AdminPage title={post.title} subtitle="Forum post detail">
      <div className="card">
        <div className="cardHeader"><h3 className="cardTitle">{post.title}</h3></div>
        <div className="cardBody">
          <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
          <p className="textSecondary" style={{ marginTop: 12 }}>By {post.author_name || post.author_id} on {post.created_at ? new Date(post.created_at).toLocaleString() : '-'}</p>
        </div>
      </div>
    </AdminPage>
  );
}
