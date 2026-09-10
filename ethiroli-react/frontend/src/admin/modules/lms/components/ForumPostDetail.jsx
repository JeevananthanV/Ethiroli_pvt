import React, { useEffect, useState } from 'react';
import { getPost, getForumPosts } from '../../../../services/api/forumApi.js';

export default function ForumPostDetail({ postId, onClose }) {
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (postId) {
          const data = await getPost(postId).catch(() => null);
          setPost(data);
        }
        const posts = await getForumPosts().catch(() => []);
        setReplies(Array.isArray(posts) ? posts : []);
      } catch (err) {
        console.error('Failed to load post:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [postId]);

  if (loading) return <div className="loading">Loading post...</div>;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h3>Post Details & Replies</h3>
        {post ? (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 8px' }}>{post.title}</h4>
            <p style={{ color: 'var(--admin-text-secondary)', fontSize: '13px', margin: '0 0 16px' }}>{post.content || post.body || 'No content'}</p>
            <div style={{ borderTop: '1px solid var(--admin-border-subtle)', paddingTop: '12px' }}>
              <h5 style={{ margin: '0 0 8px' }}>Replies ({replies.length})</h5>
              {replies.length === 0 ? (
                <p style={{ color: 'var(--admin-text-secondary)', fontSize: '13px' }}>No replies yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {replies.map((reply) => (
                    <div key={reply.id} style={{ padding: '8px', background: 'var(--admin-bg-input)', borderRadius: '6px' }}>
                      <p style={{ margin: 0, fontSize: '13px' }}>{reply.content || reply.body || 'Reply'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p style={{ color: 'var(--admin-text-secondary)' }}>No post selected.</p>
        )}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={onClose} className="btn">Close</button>
        </div>
      </div>
    </div>
  );
}
