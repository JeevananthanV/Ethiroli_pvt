import React, { useEffect, useState } from 'react';
import { getForumPosts } from '../../../../services/api/forumApi.js';

export default function ForumThread() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getForumPosts().catch(() => []);
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load posts:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading forum posts...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Forum Threads</h2>
          <p className="pageSubtitle">Community discussions and Q&A</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {posts.length === 0 ? (
            <div className="emptyState"><h3>No Posts</h3><p>No forum posts yet.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Title</th><th>Author</th><th>Replies</th><th>Date</th></tr></thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td>{post.title}</td>
                    <td>{post.author_name || post.author_id}</td>
                    <td>{post.reply_count || 0}</td>
                    <td>{post.created_at ? new Date(post.created_at).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
