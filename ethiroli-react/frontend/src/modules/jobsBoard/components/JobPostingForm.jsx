import React, { useEffect, useState } from 'react';
import { getJobBoardPosts, createJobBoardPost } from '../../../services/api/jobBoardApi.js';

export default function JobPostingForm() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', description: '', location: '', type: 'full-time' });

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await getJobBoardPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load job posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createJobBoardPost(newPost);
      setShowCreate(false);
      setNewPost({ title: '', description: '', location: '', type: 'full-time' });
      loadPosts();
    } catch (err) {
      console.error('Failed to create job post:', err);
    }
  };

  if (loading) return <div className="loading">Loading job board...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Jobs Board</h2>
          <p className="pageSubtitle">Manage job postings and opportunities</p>
        </div>
        <div className="pageActions">
          <button onClick={() => setShowCreate(true)} className="btn btnPrimary">+ Post Job</button>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {posts.length === 0 ? (
            <p style={{ color: 'var(--admin-text-secondary)' }}>No job postings found.</p>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {posts.map((post) => (
                <div key={post.id} style={{ padding: '16px', border: '1px solid var(--admin-border-subtle)', borderRadius: '8px', background: 'var(--admin-bg-elevated)' }}>
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
      {showCreate && (
        <div className="modalOverlay" onClick={() => setShowCreate(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3>Post New Job</h3>
            <form onSubmit={handleCreate}>
              <div className="formGroup">
                <label className="label">Job Title</label>
                <input className="input" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} required />
              </div>
              <div className="formGroup">
                <label className="label">Description</label>
                <textarea className="textarea" value={newPost.description} onChange={(e) => setNewPost({ ...newPost, description: e.target.value })} required />
              </div>
              <div className="formGroup">
                <label className="label">Location</label>
                <input className="input" value={newPost.location} onChange={(e) => setNewPost({ ...newPost, location: e.target.value })} required />
              </div>
              <div className="formGroup">
                <label className="label">Type</label>
                <select className="select" value={newPost.type} onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowCreate(false)} className="btn">Cancel</button>
                <button type="submit" className="btn btnPrimary">Post Job</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
