import React, { useEffect, useState } from 'react';
import { getPerformanceReviews, createPerformanceReview } from '../../../../services/api/performanceApi.js';

export default function PerformanceReviewForm() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ employee_id: '', rating: '', comments: '' });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getPerformanceReviews().catch(() => []);
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPerformanceReview({ ...form, rating: Number(form.rating) });
      setShowForm(false);
      setForm({ employee_id: '', rating: '', comments: '' });
    } catch (err) {
      console.error('Failed to create review:', err);
    }
  };

  if (loading) return <div className="loading">Loading performance reviews...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Performance Reviews</h2>
          <p className="pageSubtitle">Employee performance evaluations</p>
        </div>
        <div className="pageActions">
          <button onClick={() => setShowForm(true)} className="btn btnPrimary">+ New Review</button>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {reviews.length === 0 ? (
            <div className="emptyState"><h3>No Reviews</h3><p>No performance reviews found.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Employee</th><th>Rating</th><th>Comments</th><th>Date</th></tr></thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id}>
                    <td>{review.employee_name || review.employee_id}</td>
                    <td><span className="statusTag active">{review.rating}/5</span></td>
                    <td>{review.comments || '—'}</td>
                    <td>{review.created_at ? new Date(review.created_at).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {showForm && (
        <div className="modalOverlay" onClick={() => setShowForm(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3>New Performance Review</h3>
            <form onSubmit={handleSubmit}>
              <div className="formGroup">
                <label className="label">Employee ID</label>
                <input className="input" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} required />
              </div>
              <div className="formGroup">
                <label className="label">Rating (1-5)</label>
                <input className="input" type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} required />
              </div>
              <div className="formGroup">
                <label className="label">Comments</label>
                <textarea className="textarea" value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} required />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn">Cancel</button>
                <button type="submit" className="btn btnPrimary">Save Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
