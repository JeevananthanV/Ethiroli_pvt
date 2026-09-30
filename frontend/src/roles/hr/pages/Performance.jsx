import React, { useEffect, useState, useCallback, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import { useHrData } from '../../../hooks/useHrData';
import { listPerformance, updatePerformance } from '../../../../services/api/hrApi.standardized.js';

/**
 * HRPerformance - Dynamic Performance Reviews with Proper Data Flow
 * 
 * Uses useHrData hook for consistent state management,
 * hrApi.standardized.js for consistent API calls,
 * and AdminPage for unified loading/error/empty states.
 * Maintains all unique performance review functionality.
 */
export default function HRPerformance() {
  // --- Data Hook with Proper Flow ---
  const {
    data: reviews,
    loading,
    error,
    refresh,
    search,
    setSearch,
  } = useHrData(
    () => listPerformance(),
    undefined,
    // updatePerformance is handled via form in modal
    async (id, formData) => {
      // Update performance review - using standardized API
      await updatePerformance(id, formData);
      await refresh();
    },
    // No generic delete for performance reviews in this version
    undefined,
    // No generic toggle for performance reviews
    undefined
  );

  // --- Additional State ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // --- Show Toast Helper ---
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // --- handleCreate ---
  const handleCreate = async (e, formData) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await handleCreate(formData); // From useHrData
      await refresh();
      setShowAddModal(false);
      showToast('Performance review added successfully!');
      setSubmitting(false);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to create performance review';
      setError(message);
      showToast(message);
      setSubmitting(false);
    }
  };

  // --- handleEditOpen ---
  const handleEditOpen = (review) => {
    setSelectedReview(review);
  };

  // --- handleUpdate ---
  const handleUpdate = async (e, formData) => {
    e.preventDefault();
    if (!selectedReview) return;
    setSubmitting(true);
    try {
      await handleUpdate(selectedReview.id, formData); // From useHrData
      await refresh();
      setShowEditModal(false);
      showToast(`Performance review updated successfully.`);
      setSubmitting(false);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update performance review';
      setError(message);
      showToast(message);
      setSubmitting(false);
    }
  };

  // --- handleDelete ---
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name}?`)) return;
    try {
      // Performance reviews may not have delete, but hook provides structure
      showToast('Performance review removal not configured');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to delete performance review';
      setError(message);
      showToast(message);
    }
  };

  // --- Filtered Reviews ---
  const filteredReviews = useMemo(() => {
    // Performance page can have its own filtering logic
    // For now, return all reviews
    return reviews;
  }, [reviews]);

  return (
    <AdminPage
      title="Performance Reviews"
      subtitle="Manage employee performance reviews and ratings"
      loading={loading}
      error={error}
      onRetry={refresh}
      actions={
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-person-up me-1" /> Add Review
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

        {filteredReviews.length === 0 ? (
          <div className="emptyState">
            <h3>No performance reviews found</h3>
            <p>Click "Add Review" above to add your first performance review.</p>
          </div>
        ) : (
          <div className="card">
            <div className="cardHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="cardTitle">Performance Reviews ({filteredReviews.length})</h3>
            </div>
            <div className="cardBody" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Reviewer</th>
                    <th>Rating</th>
                    <th>Review Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews.map((review) => (
                    <tr key={review.id}>
                      <td style={{ fontWeight: 600 }}>{review.employee_name || review.name}</td>
                      <td>{review.reviewer_name || 'HR'}</td>
                      <td>
                        <span className={`statusTag ${review.rating >= 4 ? 'active' : review.rating >= 3 ? 'pending' : 'error'}`}>
                          {review.rating}/5
                        </span>
                      </td>
                      <td>{review.review_date || '—'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleEditOpen(review)}
                            title="Edit review"
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(review.id, review.employee_name || review.name)}
                            title="Delete review"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Performance Review Modal */}
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Performance Review">
          <form onSubmit={(e) => handleCreate(e, formData)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Employee Name *</label>
                <input
                  type="text"
                  required
                  value={formData.employee_name}
                  onChange={(e) => setFormData({ ...formData, employee_name: e.target.value })}
                  placeholder="e.g. Anand Kumar"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Reviewer *</label>
                <input
                  type="text"
                  required
                  value={formData.reviewer_name}
                  onChange={(e) => setFormData({ ...formData, reviewer_name: e.target.value })}
                  placeholder="e.g. HR Manager"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Rating *</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
                >
                  <option value="1">1 - Needs Improvement</option>
                  <option value="2">2 - Below Expectations</option>
                  <option value="3">3 - Meets Expectations</option>
                  <option value="4">4 - Exceeds Expectations</option>
                  <option value="5">5 - Outstanding</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Review Comments</label>
                <textarea
                  rows={3}
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  placeholder="Enter performance review comments..."
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Adding...' : 'Save Review'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Edit Performance Review Modal */}
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Performance Review">
          <form onSubmit={(e) => handleUpdate(e, formData)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Employee Name</label>
                <input
                  type="text"
                  value={formData.employee_name}
                  onChange={(e) => setFormData({ ...formData, employee_name: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Reviewer</label>
                <input
                  type="text"
                  value={formData.reviewer_name}
                  onChange={(e) => setFormData({ ...formData, reviewer_name: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Rating</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
                >
                  <option value="1">1 - Needs Improvement</option>
                  <option value="2">2 - Below Expectations</option>
                  <option value="3">3 - Meets Expectations</option>
                  <option value="4">4 - Exceeds Expectations</option>
                  <option value="5">5 - Outstanding</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Review Comments</label>
                <textarea
                  rows={3}
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  placeholder="Enter performance review comments..."
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Update Review'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminPage>
  );
}