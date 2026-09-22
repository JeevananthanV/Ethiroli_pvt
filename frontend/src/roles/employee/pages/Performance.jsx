import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listReviews } from '../../../services/api/performanceApi.js';

function getStatusClass(status) {
  if (!status) return 'inactive';
  const s = String(status).toLowerCase();
  if (['approved', 'active', 'paid', 'completed', 'success'].includes(s)) return 'active';
  if (['pending', 'processing', 'awaiting', 'in_progress'].includes(s)) return 'pending';
  if (['rejected', 'cancelled', 'failed', 'error', 'declined'].includes(s)) return 'error';
  return 'inactive';
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
      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Performance Reviews</h3>
        </div>
        <div className="cardBody">
          {reviews.length === 0 ? (
            <div className="emptyState">
              <h3>No reviews found</h3>
              <p>Your performance reviews will appear here.</p>
            </div>
          ) : (
            <div className="overflowAuto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Review Period</th>
                    <th>Reviewer</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map(review => (
                    <tr key={review.id}>
                      <td>{review.period || review.reviewPeriod || 'N/A'}</td>
                      <td>{review.reviewer || review.reviewerName || 'N/A'}</td>
                      <td>{review.score ? `${review.score} / 5.0` : 'N/A'}</td>
                      <td>
                        <span className={`statusTag ${getStatusClass(review.status)}`}>
                          {review.status || 'N/A'}
                        </span>
                      </td>
                      <td>{review.comments || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
