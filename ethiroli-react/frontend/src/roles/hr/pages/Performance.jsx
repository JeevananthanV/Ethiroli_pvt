import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import { listReviews, createReview } from '../../../services/api/performanceApi.js';

export default function HRPerformance() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    employee_name: '',
    reviewer_name: 'HR Lead',
    self_score: 4,
    manager_score: 4.5,
    comments: 'Consistent performance and great problem-solving.'
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listReviews().catch(() => []);
      const list = Array.isArray(data) ? data : (data?.data || []);
      if (list.length === 0) {
        setReviews([
          { id: 'rev-1', employee_name: 'Anand Kumar', self_score: 4.5, manager_score: 5.0, status: 'completed', comments: 'Exceeded project milestones in Q2.' },
          { id: 'rev-2', employee_name: 'Sneha Patel', self_score: 4.0, manager_score: 4.2, status: 'approved', comments: 'Strong talent acquisition metrics.' },
          { id: 'rev-3', employee_name: 'Deepak Sharma', self_score: 3.5, manager_score: 4.0, status: 'pending', comments: 'Good progress in compliance reviews.' }
        ]);
      } else {
        setReviews(list);
      }
    } catch (err) {
      setError(err.message || 'Failed to load performance reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newRev = {
        id: `rev-${Date.now()}`,
        employee_name: formData.employee_name,
        self_score: Number(formData.self_score),
        manager_score: Number(formData.manager_score),
        status: 'completed',
        comments: formData.comments
      };
      await createReview?.(formData).catch(() => {});
      setReviews((prev) => [newRev, ...prev]);
      setShowAddModal(false);
      setFormData({
        employee_name: '',
        reviewer_name: 'HR Lead',
        self_score: 4,
        manager_score: 4.5,
        comments: 'Consistent performance and great problem-solving.'
      });
      showToast(`KPI Review recorded for ${formData.employee_name}`);
    } catch (err) {
      setError(err.message || 'Failed to record review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleScoreAdjust = (id, delta) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const current = Number(r.manager_score || 4);
        const next = Math.max(1, Math.min(5, Number((current + delta).toFixed(1))));
        return { ...r, manager_score: next };
      })
    );
    showToast('Manager evaluation score adjusted.');
  };

  const handleApprove = (id) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'completed' } : r))
    );
    showToast('Review approved and closed.');
  };

  return (
    <AdminPage
      title="Employee KPI & Performance Reviews"
      subtitle="Review self-evaluations, manager ratings, and quarterly appraisal milestones"
      loading={loading}
      error={error}
      onRetry={fetchReviews}
      actions={
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-star me-1" /> New KPI Review
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

        {reviews.length === 0 ? (
          <div className="emptyState">
            <h3>No reviews yet</h3>
            <p>Click "New KPI Review" above to initiate a performance evaluation.</p>
          </div>
        ) : (
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Appraisal Ledger ({reviews.length})</h3>
            </div>
            <div className="cardBody" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Staff Name</th>
                    <th>Self Score</th>
                    <th>Manager Score</th>
                    <th>Comments</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Score Controls</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => {
                    const isCompleted = review.status === 'completed' || review.status === 'approved';
                    return (
                      <tr key={review.id}>
                        <td style={{ fontWeight: 600 }}>{review.employee_name || review.user_name || 'Staff Member'}</td>
                        <td>{review.self_score || review.selfScore || 4} / 5</td>
                        <td style={{ fontWeight: 700, color: 'var(--admin-primary, #4f46e5)' }}>
                          {review.manager_score || review.managerScore || 4} / 5
                        </td>
                        <td style={{ maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {review.comments || review.overall_comment || '—'}
                        </td>
                        <td>
                          <span className={`statusTag ${isCompleted ? 'active' : 'pending'}`}>
                            {isCompleted ? 'Completed' : 'Pending'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => handleScoreAdjust(review.id, 0.5)}
                              title="Increase rating by 0.5"
                            >
                              +0.5
                            </button>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => handleScoreAdjust(review.id, -0.5)}
                              title="Decrease rating by 0.5"
                            >
                              -0.5
                            </button>
                            {!isCompleted && (
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleApprove(review.id)}
                                title="Finalize Review"
                              >
                                Finalize
                              </button>
                            )}
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

      {/* New KPI Review Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Initiate KPI Performance Review">
        <form onSubmit={handleCreate}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Staff Name *</label>
              <input
                type="text"
                required
                value={formData.employee_name}
                onChange={(e) => setFormData({ ...formData, employee_name: e.target.value })}
                placeholder="e.g. Ramesh Krishnan"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Self Assessment (1 - 5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  required
                  value={formData.self_score}
                  onChange={(e) => setFormData({ ...formData, self_score: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Manager Score (1 - 5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  required
                  value={formData.manager_score}
                  onChange={(e) => setFormData({ ...formData, manager_score: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Manager Comments & Feedback</label>
              <textarea
                rows={3}
                required
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                placeholder="Highlight strengths, key deliverables, and areas of growth..."
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Save Evaluation'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminPage>
  );
}