import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listReviews } from '../../../services/api/performanceApi.js';

export default function HRPerformance() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listReviews().catch(() => []);
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
      title="Employee KPI Reviews"
      subtitle="Review self-assessments and manager scores"
      loading={loading}
      error={error}
      onRetry={fetchReviews}
    >
      <div className="dashboard">
        {reviews.length === 0 ? (
          <div className="emptyState">
            <h3>No reviews yet</h3>
            <p>Performance reviews will appear here once submitted.</p>
          </div>
        ) : (
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">KPI Reviews</h3>
            </div>
            <div className="cardBody" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Staff Name</th>
                    <th>Self Score</th>
                    <th>Manager Score</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review.id}>
                      <td style={{ fontWeight: 600 }}>{review.employee_name || review.user_name || '—'}</td>
                      <td>{review.self_score || review.selfScore || '—'} / 5</td>
                      <td>{review.manager_score || review.managerScore || '—'} / 5</td>
                      <td>
                        <span className={`statusTag ${review.status === 'completed' || review.status === 'approved' ? 'active' : 'pending'}`}>
                          {review.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminPage>
  );
}