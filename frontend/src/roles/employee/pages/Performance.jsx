import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listReviews } from '../../../services/api/performanceApi.js';

function getStatusBadge(status) {
  const s = String(status || '').toUpperCase();
  if (['ACKNOWLEDGED', 'ARCHIVED'].includes(s)) return 'bg-success';
  if (['SUBMITTED', 'DRAFT'].includes(s)) return 'bg-warning text-dark';
  return 'bg-secondary';
}

export default function EmployeePerformance() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load performance reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <AdminPage
      title="My Performance"
      subtitle="Review your performance scorecards and evaluations"
      loading={loading}
      error={error}
      onRetry={fetchReviews}
    >
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h6 className="mb-0 fw-bold">Performance Reviews</h6>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-muted small text-uppercase">
              <tr>
                <th>Review Period</th>
                <th>Reviewer</th>
                <th>Score</th>
                <th>Status</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    <i className="bi bi-clipboard2-data fs-2 d-block mb-2"></i>
                    No reviews found. Your performance reviews will appear here.
                  </td>
                </tr>
              ) : (
                reviews.map(review => (
                  <tr key={review.id}>
                    <td className="fw-medium text-dark">
                      {review.review_date ? new Date(review.review_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="text-muted">{review.reviewer_name || 'N/A'}</td>
                    <td className="fw-semibold text-dark">{review.rating != null ? `${review.rating} / 5` : 'N/A'}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(review.status)}`}>
                        {review.status || 'N/A'}
                      </span>
                    </td>
                    <td className="text-muted small" style={{ maxWidth: '320px' }}>
                      {review.overall_comment || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  );
}
