import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import employeePortalApi from '../../../services/api/employeePortalApi.js';
import { EmptyState } from '../components/StatCard.jsx';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAssignments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await employeePortalApi.getAssignments();
      const list = res?.data || (Array.isArray(res) ? res : []);
      setAssignments(list);
    } catch (err) {
      setError(err.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  /**
   * `submission_status` is only ever 'SUBMITTED' or 'NOT_STARTED' - the query
   * builds it from a CASE on the presence of an assignment_submissions row, so
   * the old `case 'GRADED'` could never fire and a fully graded submission
   * still rendered "Pending Submission". The grade column is what actually
   * distinguishes graded work, so key off that.
   */
  const getStatusBadge = (item) => {
    if (item?.grade !== null && item?.grade !== undefined) {
      return <span className="badge bg-success">Graded &middot; {item.grade}</span>;
    }
    if (item?.submission_status === 'SUBMITTED') {
      return <span className="badge bg-primary">Submitted &middot; awaiting grade</span>;
    }
    return <span className="badge bg-warning text-dark">Pending Submission</span>;
  };

  return (
    <AdminPage
      title="Assignments & Evaluations"
      subtitle="Complete project assignments, technical assessments, and review mentor evaluations"
      loading={loading}
      error={error}
      onRetry={loadAssignments}
    >
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold">My Course Assignments</h6>
          <span className="badge bg-light text-dark border">{assignments.length} Total</span>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-muted small text-uppercase">
              <tr>
                <th>Assignment Title</th>
                <th>Associated Course</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Score / Grade</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length === 0 ? (
                <tr>
                  <td colSpan="6"><EmptyState icon="bi-journal-text" text="No assignments found at this time." compact /></td>
                </tr>
              ) : (
                assignments.map((item) => (
                  <tr key={item.id}>
                    <td className="fw-semibold text-dark">{item.title}</td>
                    <td className="text-muted small">{item.course_title || 'General Training'}</td>
                    <td>
                      {item.due_date ? new Date(item.due_date).toLocaleDateString() : 'No deadline'}
                    </td>
                    <td>{getStatusBadge(item)}</td>
                    <td>
                      {item.grade ? (
                        <span className="badge bg-info text-dark fw-bold">{item.grade} / 100</span>
                      ) : (
                        <span className="text-muted small">-</span>
                      )}
                    </td>
                    <td className="text-muted small">
                      {item.feedback || (item.submission_status === 'SUBMITTED' ? 'Under review by instructor' : 'Pending submission')}
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
