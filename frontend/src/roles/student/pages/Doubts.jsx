import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import lmsApi from '../../../services/api/lmsApi.js';
import courseApi from '../../../services/api/courseApi.js';

export default function Doubts() {
  const [doubts, setDoubts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    description: '',
    code_snippet: '',
    screenshot_url: '',
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [doubtsRes, coursesRes] = await Promise.all([
        lmsApi.getDoubts(),
        courseApi.getAll()
      ]);
      const doubtList = doubtsRes?.data || (Array.isArray(doubtsRes) ? doubtsRes : []);
      const courseList = coursesRes?.data || (Array.isArray(coursesRes) ? coursesRes : []);
      setDoubts(doubtList);
      setCourses(courseList);
      if (courseList.length > 0 && !formData.course_id) {
        setFormData(prev => ({ ...prev, course_id: courseList[0].id }));
      }
    } catch (err) {
      setError(err.message || 'Failed to load doubts');
    } finally {
      setLoading(false);
    }
  }, [formData.course_id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMsg('');
    try {
      await lmsApi.submitDoubt(formData);
      setSuccessMsg('Your technical doubt has been submitted! An instructor has been notified.');
      setShowModal(false);
      setFormData({
        course_id: courses[0]?.id || '',
        title: '',
        description: '',
        code_snippet: '',
        screenshot_url: '',
      });
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to submit doubt');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RESOLVED':
        return <span className="badge bg-success">Resolved</span>;
      case 'IN_REVIEW':
        return <span className="badge bg-info text-dark">In Review</span>;
      default:
        return <span className="badge bg-warning text-dark">Open</span>;
    }
  };

  return (
    <AdminPage
      title="Technical Doubts & Mentor Q&A"
      subtitle="Ask technical questions, share code snippets, and receive personalized tutor guidance"
      loading={loading}
      error={error}
      onRetry={loadData}
    >
      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center mb-2" role="alert">
          <i className="bi bi-check-circle-fill me-2 fs-5"></i>
          <div>{successMsg}</div>
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h5 className="mb-0 fw-bold">My Submitted Doubts</h5>
          <small className="text-muted">Track tutor answers and code reviews</small>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <i className="bi bi-question-circle"></i>
          <span>Ask a New Doubt</span>
        </button>
      </div>

      <div className="row g-4">
        {doubts.length === 0 ? (
          <div className="col-12 text-center py-5 text-muted">
            <i className="bi bi-chat-square-quote fs-1 d-block mb-2 text-muted"></i>
            <p>No doubts submitted yet. If you have questions about code or concepts, ask here!</p>
          </div>
        ) : (
          doubts.map((item) => (
            <div key={item.id} className="col-12">
              <div className="card shadow-sm border-0 border-start border-4 border-primary">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-light text-dark border">{item.course_name || 'Course'}</span>
                      {getStatusBadge(item.status)}
                    </div>
                    <small className="text-muted">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                    </small>
                  </div>

                  <h5 className="card-title fw-bold text-dark mt-2 mb-2">{item.title}</h5>
                  <p className="card-text text-secondary mb-3" style={{ whiteSpace: 'pre-wrap' }}>
                    {item.description}
                  </p>

                  {item.code_snippet && (
                    <div className="mb-3">
                      <small className="text-muted fw-bold d-block mb-1">Code Snippet:</small>
                      <pre className="bg-dark text-light p-3 rounded-3 small overflow-auto" style={{ maxHeight: '200px' }}>
                        <code>{item.code_snippet}</code>
                      </pre>
                    </div>
                  )}

                  {item.status === 'RESOLVED' && item.resolution_notes && (
                    <div className="p-3 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-3 mt-3">
                      <div className="d-flex align-items-center gap-2 mb-1 text-success fw-bold">
                        <i className="bi bi-check-circle-fill"></i>
                        <span>Tutor Resolution ({item.tutor_name || 'Instructor'}):</span>
                      </div>
                      <p className="mb-0 text-dark small" style={{ whiteSpace: 'pre-wrap' }}>
                        {item.resolution_notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Ask Doubt Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Ask a Technical Question</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Related Course</label>
                    <select
                      className="form-select"
                      required
                      value={formData.course_id}
                      onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.code ? `[${c.code}] ` : ''}{c.name || c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Doubt Title / Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. TypeError in Redux Toolkit async thunk action"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Detailed Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Explain what you are trying to accomplish and what unexpected behavior or error message occurs..."
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Code Snippet (Optional)</label>
                    <textarea
                      className="form-control font-monospace"
                      rows="4"
                      placeholder="Paste your relevant function, JSX, or SQL query here..."
                      value={formData.code_snippet}
                      onChange={(e) => setFormData({ ...formData, code_snippet: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Screenshot URL (Optional)</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://..."
                      value={formData.screenshot_url}
                      onChange={(e) => setFormData({ ...formData, screenshot_url: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Question'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
