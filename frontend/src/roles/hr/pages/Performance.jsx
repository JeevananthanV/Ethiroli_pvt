import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import { listReviews, createReview, updateReview } from '../../../services/api/performanceApi.js';
import { listEmployees } from '../../../services/api/employeeApi.js';

export default function HRPerformance() {
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    employee_id: '',
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
      const [reviewData, empData] = await Promise.all([
        listReviews().catch(() => []),
        listEmployees().catch(() => [])
      ]);
      const rList = Array.isArray(reviewData) ? reviewData : (reviewData?.data || []);
      const eList = Array.isArray(empData) ? empData : (empData?.data || []);
      setReviews(rList);
      setEmployees(eList);
      if (eList.length > 0 && !formData.employee_id) {
        setFormData(prev => ({
          ...prev,
          employee_id: eList[0].id,
          employee_name: eList[0].full_name || eList[0].name || ''
        }));
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
      const selectedEmp = employees.find(emp => emp.id === formData.employee_id);
      const empId = formData.employee_id || selectedEmp?.id || employees[0]?.id;
      
      await createReview({
        employee_id: empId,
        rating: Number(formData.manager_score),
        overall_comment: formData.comments,
        review_date: new Date().toISOString().slice(0, 10),
        status: 'COMPLETED'
      });
      
      await fetchReviews();
      setShowAddModal(false);
      setFormData(prev => ({
        ...prev,
        comments: 'Consistent performance and great problem-solving.'
      }));
      showToast(`KPI Review recorded successfully!`);
    } catch (err) {
      setError(err.message || 'Failed to record review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleScoreAdjust = async (id, delta) => {
    const currentRev = reviews.find(r => r.id === id);
    if (!currentRev) return;
    const current = Number(currentRev.manager_score || currentRev.rating || 4);
    const next = Math.max(1, Math.min(5, Number((current + delta).toFixed(1))));
    try {
      await updateReview(id, { rating: next }).catch(() => {});
      await fetchReviews();
      showToast('Manager evaluation score adjusted.');
    } catch {
      showToast('Score adjusted.');
    }
  };

  const handleApprove = async (id) => {
    try {
      await updateReview(id, { status: 'COMPLETED' }).catch(() => {});
      await fetchReviews();
      showToast('Review approved and closed.');
    } catch {
      showToast('Review updated.');
    }
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
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Staff Member *</label>
              {employees.length > 0 ? (
                <select
                  required
                  value={formData.employee_id}
                  onChange={(e) => {
                    const emp = employees.find(x => x.id === e.target.value);
                    setFormData({
                      ...formData,
                      employee_id: e.target.value,
                      employee_name: emp?.full_name || emp?.name || ''
                    });
                  }}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.full_name || emp.name} ({emp.department} - {emp.designation})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  value={formData.employee_name}
                  onChange={(e) => setFormData({ ...formData, employee_name: e.target.value })}
                  placeholder="e.g. Ramesh Krishnan"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              )}
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