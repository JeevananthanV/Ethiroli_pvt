import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listReviews, createReview } from '../../services/api/performanceApi.js';

export default function PerformanceReviewForm() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    employee_id: '',
    rating: '',
    feedback: '',
    overall_comment: '',
    review_date: '',
  });

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listReviews();
      setReviews(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch performance reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employee_id || !form.rating) {
      alert('Employee ID and Rating are required');
      return;
    }
    setSubmitting(true);
    try {
      await createReview({
        employee_id: form.employee_id,
        rating: Number(form.rating),
        feedback: form.feedback,
        overall_comment: form.overall_comment,
        review_date: form.review_date,
      });
      setForm({ employee_id: '', rating: '', feedback: '', overall_comment: '', review_date: '' });
      fetchReviews();
    } catch (err) {
      alert(`Failed to create review: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'active';
    if (rating >= 3) return 'pending';
    return 'error';
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <AdminPage
      title="Performance Reviews"
      subtitle="Track and manage employee performance evaluations"
      loading={loading}
      error={error}
      onRetry={fetchReviews}
    >
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 className="cardTitle" style={{ marginBottom: 16 }}>New Review</h3>
        <form onSubmit={handleSubmit} className="form">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            <div className="formGroup">
              <label className="label">Employee ID <span className="required">*</span></label>
              <input
                type="text"
                name="employee_id"
                value={form.employee_id}
                onChange={handleChange}
                className="inputField"
                placeholder="Enter employee ID"
              />
            </div>
            <div className="formGroup">
              <label className="label">Rating (1-5) <span className="required">*</span></label>
              <input
                type="number"
                name="rating"
                min="1"
                max="5"
                value={form.rating}
                onChange={handleChange}
                className="inputField"
                placeholder="1 - 5"
              />
            </div>
            <div className="formGroup">
              <label className="label">Review Date</label>
              <input
                type="date"
                name="review_date"
                value={form.review_date}
                onChange={handleChange}
                className="inputField"
              />
            </div>
          </div>
          <div className="formGroup">
            <label className="label">Feedback</label>
            <textarea
              name="feedback"
              value={form.feedback}
              onChange={handleChange}
              className="textarea"
              placeholder="Enter detailed feedback..."
            />
          </div>
          <div className="formGroup">
            <label className="label">Overall Comment</label>
            <textarea
              name="overall_comment"
              value={form.overall_comment}
              onChange={handleChange}
              className="textarea"
              placeholder="Enter overall comment..."
            />
          </div>
          <button type="submit" className="btn primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>

      <div className="card">
        {reviews.length === 0 ? (
          <div className="emptyState">
            <h3>No reviews found</h3>
            <p>Performance reviews will appear here once created.</p>
          </div>
        ) : (
          <div className="overflowAuto">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Reviewer ID</th>
                  <th>Date</th>
                  <th>Rating</th>
                  <th>Feedback</th>
                  <th>Overall Comment</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id}>
                    <td className="textSecondary">{review.employee_id}</td>
                    <td className="textSecondary">{review.reviewer_id}</td>
                    <td className="textSecondary">{formatDate(review.review_date)}</td>
                    <td>
                      <span className={`statusTag ${getRatingColor(review.rating)}`}>
                        {review.rating}/5
                      </span>
                    </td>
                    <td className="textSecondary">{review.feedback || '-'}</td>
                    <td className="textSecondary">{review.overall_comment || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminPage>
  );
}
