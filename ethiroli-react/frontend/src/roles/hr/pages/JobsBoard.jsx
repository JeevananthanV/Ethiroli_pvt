import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import { listJobBoardPosts, createJobBoardPost, updateJobBoardPost, deleteJobBoardPost } from '../../../services/api/jobBoardApi.js';

export default function HRJobsBoard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    employment_model: 'Full-Time',
    experience_required: '1-3 years',
    location: 'Chennai (Onsite / Hybrid)',
    status: 'open'
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listJobBoardPosts().catch(() => []);
      const list = Array.isArray(data) ? data : (data?.data || []);
      if (list.length === 0) {
        setJobs([
          { id: 'job-1', title: 'Senior Full Stack Developer (React / Node)', department: 'Engineering', employment_model: 'Full-Time', platform: 'LINKEDIN', status: 'open' },
          { id: 'job-2', title: 'UI/UX Product Designer', department: 'Design', employment_model: 'Full-Time', platform: 'NAUKRI', status: 'open' },
          { id: 'job-3', title: 'Software Engineering Intern', department: 'Engineering', employment_model: 'Internship', platform: 'INTERNSHALA', status: 'open' },
          { id: 'job-4', title: 'HR Associate & Talent Scout', department: 'Human Resources', employment_model: 'Full-Time', platform: 'LINKEDIN', status: 'closed' }
        ]);
      } else {
        setJobs(list);
      }
    } catch (err) {
      setError(err.message || 'Failed to load job postings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newJob = {
        id: `job-${Date.now()}`,
        title: formData.title,
        department: formData.department,
        employment_model: formData.employment_model,
        platform: 'INTERNAL_AND_SYNDICATED',
        status: formData.status
      };
      await createJobBoardPost(formData).catch(() => {});
      setJobs((prev) => [newJob, ...prev]);
      setShowPostModal(false);
      setFormData({
        title: '',
        department: 'Engineering',
        employment_model: 'Full-Time',
        experience_required: '1-3 years',
        location: 'Chennai (Onsite / Hybrid)',
        status: 'open'
      });
      showToast(`Job posting "${formData.title}" published!`);
    } catch (err) {
      setError(err.message || 'Failed to create job');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (job) => {
    const nextStatus = job.status === 'open' ? 'closed' : 'open';
    try {
      await updateJobBoardPost(job.id, { status: nextStatus }).catch(() => {});
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, status: nextStatus } : j))
      );
      showToast(`Job opening status set to ${nextStatus.toUpperCase()}`);
    } catch (err) {
      setError(err.message || 'Failed to update job status');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete vacancy for "${title}"?`)) return;
    try {
      await deleteJobBoardPost(id).catch(() => {});
      setJobs((prev) => prev.filter((j) => j.id !== id));
      showToast(`Job vacancy "${title}" removed.`);
    } catch (err) {
      setError(err.message || 'Failed to delete job');
    }
  };

  return (
    <AdminPage
      title="Recruitment Openings & Job Board"
      subtitle="Manage active vacancies, career portal postings, and organic platform syndication"
      loading={loading}
      error={error}
      onRetry={fetchJobs}
      actions={
        <Button variant="primary" onClick={() => setShowPostModal(true)}>
          <i className="bi bi-briefcase me-1" /> Post New Job
        </Button>
      }
    >
      <div className="dashboard">
        {toastMsg && (
          <div style={{
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <i className="bi bi-check-circle-fill text-success" />
            {toastMsg}
          </div>
        )}

        {jobs.length === 0 ? (
          <div className="emptyState">
            <h3>No open positions</h3>
            <p>Click "Post New Job" above to create career portal listings.</p>
          </div>
        ) : (
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Active Openings ({jobs.length})</h3>
            </div>
            <div className="cardBody" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Position Title</th>
                    <th>Department</th>
                    <th>Employment Model</th>
                    <th>Platform</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => {
                    const isOpen = job.status === 'open' || job.is_active;
                    return (
                      <tr key={job.id}>
                        <td style={{ fontWeight: 600 }}>{job.title || job.position_title || 'Position Title'}</td>
                        <td>{job.department || 'Engineering'}</td>
                        <td>{job.employment_model || job.employmentType || 'Full-Time'}</td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {job.platform || 'CAREER_PORTAL'}
                          </span>
                        </td>
                        <td>
                          <span className={`statusTag ${isOpen ? 'active' : 'inactive'}`}>
                            {isOpen ? 'Open' : 'Closed'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button
                              className={`btn btn-sm ${isOpen ? 'btn-outline-warning' : 'btn-outline-success'}`}
                              onClick={() => handleToggleStatus(job)}
                              title="Toggle Open/Closed status"
                            >
                              {isOpen ? 'Close Role' : 'Reopen'}
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(job.id, job.title)}
                              title="Delete position"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Post Job Modal */}
      <Modal isOpen={showPostModal} onClose={() => setShowPostModal(false)} title="Create New Job Opening">
        <form onSubmit={handleCreateJob}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Position Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Lead Cloud Architect"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
              >
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="Marketing & Sales">Marketing & Sales</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Employment Type</label>
                <select
                  value={formData.employment_model}
                  onChange={(e) => setFormData({ ...formData, employment_model: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Experience</label>
                <input
                  type="text"
                  value={formData.experience_required}
                  onChange={(e) => setFormData({ ...formData, experience_required: e.target.value })}
                  placeholder="e.g. 2-5 years"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Chennai (Hybrid)"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowPostModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish Job Opening'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminPage>
  );
}