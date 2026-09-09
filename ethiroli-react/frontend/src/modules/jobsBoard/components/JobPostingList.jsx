import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listJobBoardPosts, createJobBoardPost, deleteJobBoardPost } from '../../services/api/jobBoardApi.js';

export default function JobPostingList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    type: 'full_time',
    status: 'active',
  });

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listJobBoardPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load job postings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) {
      alert('Job title is required');
      return;
    }
    setSaving(true);
    try {
      await createJobBoardPost(form);
      setShowForm(false);
      setForm({ title: '', description: '', location: '', type: 'full_time', status: 'active' });
      loadPosts();
    } catch (err) {
      alert(`Failed to create job posting: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job posting?')) return;
    try {
      await deleteJobBoardPost(id);
      loadPosts();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <AdminPage
      title="Job Board Postings"
      subtitle="Manage job board listings and analytics"
      loading={loading}
      error={error}
      onRetry={loadPosts}
      actions={
        <button className="btn primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close Form' : 'New Posting'}
        </button>
      }
    >
      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="cardHeader">
            <h3 className="cardTitle">Create Job Posting</h3>
          </div>
          <div className="cardBody">
            <form onSubmit={handleSubmit} className="form">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <div className="formGroup">
                  <label className="label required">Title</label>
                  <input className="inputField" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="formGroup">
                  <label className="label">Location</label>
                  <input className="inputField" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
                <div className="formGroup">
                  <label className="label">Type</label>
                  <select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>
                <div className="formGroup">
                  <label className="label">Status</label>
                  <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
              <div className="formGroup">
                <label className="label">Description</label>
                <textarea className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
              <button type="submit" className="btn primary" disabled={saving}>
                {saving ? 'Creating...' : 'Create Posting'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Job Board Listings</h3>
        </div>
        <div className="cardBody" style={{ overflowX: 'auto' }}>
          {posts.length === 0 ? (
            <div className="emptyState">No job postings found.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Posted</th>
                  <th>Views</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="textPrimary" style={{ fontWeight: 500 }}>{post.title}</td>
                    <td className="textSecondary">{post.location || '-'}</td>
                    <td className="textSecondary">{post.type || '-'}</td>
                    <td>
                      <span className={`statusTag ${post.status === 'active' ? 'active' : post.status === 'closed' ? 'error' : 'pending'}`}>
                        {post.status || 'draft'}
                      </span>
                    </td>
                    <td className="textSecondary">{formatDate(post.created_at || post.posted_at)}</td>
                    <td className="textSecondary">{post.views || post.view_count || 0}</td>
                    <td>
                      <button className="btn danger" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => handleDelete(post.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
