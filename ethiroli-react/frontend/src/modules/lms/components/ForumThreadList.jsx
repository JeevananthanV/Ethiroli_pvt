import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getForumPosts } from '../../../services/api/forumApi.js';

export default function ForumThreadList({ category }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getForumPosts({ category });
        setThreads(data);
      } catch (err) {
        setError(err.message || 'Failed to load forum threads');
      } finally {
        setLoading(false);
      }
    };
    fetchThreads();
  }, [category]);

  const filtered = threads.filter(t =>
    t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.author?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <AdminPage
      title="Discussion Forum"
      subtitle="Ask questions and interact with tutors and students"
      loading={loading}
      error={error}
      onRetry={() => window.location.reload()}
      actions={
        <div style={{display: 'flex', gap: 8}}>
          <input
            type="text"
            placeholder="Search threads..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="inputField"
            style={{width: 240}}
          />
          <button className="btn primary">+ New Thread</button>
        </div>
      }
    >
      {filtered.length === 0 ? (
        <div className="emptyState">
          <h3>No threads found</h3>
          <p>{searchTerm ? 'Try adjusting your search' : 'Be the first to start a discussion!'}</p>
        </div>
      ) : (
        <div className="card" style={{padding: 0, overflow: 'hidden'}}>
          <table className="table">
            <thead>
              <tr>
                <th>Thread</th>
                <th>Author</th>
                <th>Replies</th>
                <th>Last Active</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(thread => (
                <tr key={thread.id} style={{cursor: 'pointer'}}>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                      {thread.pinned && <span style={{fontSize: 14}}>📌</span>}
                      <div>
                        <div style={{fontWeight: 600, fontSize: 14}}>{thread.title}</div>
                        <div style={{fontSize: 12, color: 'var(--admin-text-muted)', marginTop: 2}}>
                          {thread.excerpt?.slice(0, 80) || ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                      <div className="avatar" style={{width: 28, height: 28, fontSize: 12}}>
                        {(thread.author?.name || thread.author || 'U')[0].toUpperCase()}
                      </div>
                      <span style={{fontSize: 13.5}}>{thread.author?.name || thread.author}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      background: 'rgba(99, 102, 241, 0.1)',
                      color: '#818cf8',
                      padding: '2px 8px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600
                    }}>
                      {thread.replies ?? thread.replyCount ?? 0}
                    </span>
                  </td>
                  <td style={{fontSize: 13.5, color: 'var(--admin-text-secondary)'}}>
                    {formatDate(thread.updatedAt || thread.lastActive)}
                  </td>
                  <td>
                    <span className={`statusTag ${thread.pinned ? 'active' : 'inactive'}`}>
                      {thread.pinned ? 'Pinned' : 'Open'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminPage>
  );
}
