import React, { useEffect, useState } from 'react';
import { listJobBoardPosts, createJobBoardPost } from '../../../services/api/jobBoardApi.js';

export default function JobsBoard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', department: '', description: '', status: 'open' });

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listJobBoardPosts();
      setPosts(data?.data || data || []);
    } catch (err) {
      console.error('Failed to load job posts', err);
      setError('Failed to load job board posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await createJobBoardPost(form);
      setPosts(prev => [...prev, data?.data || data]);
      setShowForm(false);
      setForm({ title: '', department: '', description: '', status: 'open' });
    } catch (err) {
      console.error('Failed to create job post', err);
      alert('Failed to create job post.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading job board...</div>;
  if (error) return <div className="emptyState">{error}</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Platform Recruitment Operations</h1>
          <p className="pageSubtitle">Manage job placements, vacancy postings, and applicant tracking status.</p>
        </div>
        <div className="pageActions">
          <button className="btn btnPrimary" onClick={() => setShowForm(!showForm)}>{showForm ? 'Close Form' : 'New Job Post'}</button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="cardHeader">
            <h3 className="cardTitle">Create Job Post</h3>
          </div>
          <div className="cardBody">
            <form onSubmit={handleCreate} style={{ display: 'grid', gap: '16px', maxWidth: '600px' }}>
              <div className="formGroup">
                <label className="label">Role Title</label>
                <input className="input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="formGroup">
                <label className="label">Department</label>
                <input className="input" required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
              </div>
              <div className="formGroup">
                <label className="label">Description</label>
                <textarea className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="formGroup">
                <label className="label">Status</label>
                <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="open">Open</option>
                  <option value="draft">Draft</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <button type="submit" className="btn btnPrimary" disabled={saving}>{saving ? 'Creating...' : 'Create Post'}</button>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Job Posts ({posts.length})</h3>
        </div>
        <div className="cardBody" style={{ overflowX: 'auto' }}>
          {posts.length === 0 && <div className="emptyState">No job posts found.</div>}
          <table className="table">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Role</th>
                <th>Department</th>
                <th>Candidates</th>
                <th>Listing Status</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id}>
                  <td><code>{post.id}</code></td>
                  <td style={{ fontWeight: '600' }}>{post.title || post.role}</td>
                  <td>{post.department}</td>
                  <td>{post.candidates ?? post.applicantCount ?? '-'}</td>
                  <td><span className={`statusTag ${post.status === 'open' ? 'active' : post.status === 'draft' ? 'pending' : 'inactive'}`}>{post.status ? post.status.toUpperCase() : '-'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
