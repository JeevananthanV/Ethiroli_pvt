import React, { useEffect, useState } from 'react';
import { getJobBoardPosts } from '../../../../services/api/jobBoardApi.js';

export default function JobBoardList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getJobBoardPosts().catch(() => []);
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load job posts:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading job board...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Job Board</h2>
          <p className="pageSubtitle">Posted job opportunities</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {posts.length === 0 ? (
            <div className="emptyState"><h3>No Jobs</h3><p>No job postings found.</p></div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {posts.map((post) => (
                <div key={post.id} style={{ padding: '16px', border: '1px solid var(--admin-border-subtle)', borderRadius: '10px' }}>
                  <h4 style={{ margin: '0 0 8px' }}>{post.title}</h4>
                  <p style={{ color: 'var(--admin-text-secondary)', fontSize: '13px', margin: '0 0 8px' }}>{post.description}</p>
                  <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: 'var(--admin-text-secondary)' }}>
                    <span className="statusTag active">{post.type || 'Full-time'}</span>
                    <span>{post.location || 'Remote'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
