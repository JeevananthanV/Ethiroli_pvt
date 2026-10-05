import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import employeePortalApi from '../../../services/api/employeePortalApi.js';
import { EmptyState } from '../components/StatCard.jsx';
import DetailModal, { DetailRow, DetailSection, DetailBadge } from '../components/DetailModal.jsx';

/**
 * My Course Assignments.
 *
 * Real data from `GET /v1/employee/assignments`. The query joins assignments ->
 * courses -> the caller's OWN enrolments, so an employee only ever sees
 * assignments belonging to courses they are enrolled in (this was an IDOR hole
 * previously: the enrolment was a LEFT JOIN, so every employee saw every
 * assignment in the system).
 *
 * The table is a summary; clicking a row opens the full brief, including the
 * submission record and instructor feedback.
 */

const humanise = (value) =>
  String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

const formatDate = (value) => {
  if (!value) return null;
  const raw = String(value);
  // Pin date-only values to local midnight; `new Date('2026-10-12')` is parsed as
  // UTC and renders as the 11th west of Greenwich.
  const d = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    ? new Date(Number(raw.slice(0, 4)), Number(raw.slice(5, 7)) - 1, Number(raw.slice(8, 10)))
    : new Date(raw);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString();
};

const formatDateTime = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString();
};

/**
 * Grade can arrive as a number or a DECIMAL string. Returns null when there is
 * no grade so the dialog can say "not graded yet" instead of rendering 0.
 */
const gradeOf = (item) => {
  if (item?.grade === null || item?.grade === undefined || item?.grade === '') return null;
  const n = Number(item.grade);
  return Number.isFinite(n) ? n : null;
};

/**
 * `submission_status` is built from a CASE on the presence of a submission row,
 * so it is only ever 'SUBMITTED' or 'NOT_STARTED'. The old 'GRADED' case could
 * never fire, which is why a fully graded submission still rendered as
 * "Pending Submission". The grade is what actually distinguishes graded work.
 */
const statusOf = (item) => {
  const grade = gradeOf(item);
  if (grade !== null) return { key: 'GRADED', label: 'Graded', tone: 'success' };
  if (item?.submission_status === 'SUBMITTED') return { key: 'SUBMITTED', label: 'Submitted', tone: 'info' };
  return { key: 'NOT_STARTED', label: 'Pending Submission', tone: 'warning' };
};

const FILTERS = [
  { key: 'ALL', label: 'All' },
  { key: 'NOT_STARTED', label: 'Pending' },
  { key: 'SUBMITTED', label: 'Submitted' },
  { key: 'GRADED', label: 'Graded' }
];

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const loadAssignments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await employeePortalApi.getAssignments();
      const list = res?.data || (Array.isArray(res) ? res : []);
      setAssignments(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  const counts = useMemo(() => {
    const c = { ALL: assignments.length, NOT_STARTED: 0, SUBMITTED: 0, GRADED: 0 };
    assignments.forEach((a) => { c[statusOf(a).key] += 1; });
    return c;
  }, [assignments]);

  const visible = useMemo(
    () => (filter === 'ALL' ? assignments : assignments.filter((a) => statusOf(a).key === filter)),
    [assignments, filter]
  );

  const graded = counts.GRADED;
  const averageGrade = useMemo(() => {
    const grades = assignments.map(gradeOf).filter((g) => g !== null);
    if (grades.length === 0) return null;
    return Math.round((grades.reduce((s, g) => s + g, 0) / grades.length) * 10) / 10;
  }, [assignments]);

  const isOverdue = (item) =>
    item?.due_date &&
    statusOf(item).key === 'NOT_STARTED' &&
    new Date(`${String(item.due_date).slice(0, 10)}T23:59:59`) < new Date();

  return (
    <AdminPage
      title="Assignments & Evaluations"
      subtitle="Complete project assignments, technical assessments, and review mentor evaluations"
      loading={loading}
      error={error}
      onRetry={loadAssignments}
    >
      {assignments.length === 0 ? (
        <div className="card shadow-sm border-0">
          <EmptyState
            icon="bi-journal-text"
            title="No assignments yet"
            text="You have no course assignments at the moment. Assignments for the courses you are enrolled in will appear here."
          />
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div className="btn-group flex-wrap" role="group">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={`btn btn-sm ${filter === f.key ? 'btn-dark' : 'btn-outline-secondary'}`}
                  onClick={() => setFilter(f.key)}
                  aria-pressed={filter === f.key}
                >
                  {f.label} ({counts[f.key]})
                </button>
              ))}
            </div>

            <div className="d-flex gap-3 small text-muted">
              {graded > 0 && <span><strong className="text-dark">{graded}</strong> graded</span>}
              {averageGrade !== null && (
                <span>Average grade <strong className="text-dark">{averageGrade}</strong> / 100</span>
              )}
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-muted small text-uppercase">
                  <tr>
                    <th>Assignment Title</th>
                    <th>Associated Course</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Score / Grade</th>
                    <th className="text-end">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.length === 0 ? (
                    <tr>
                      <td colSpan="6">
                        <EmptyState icon="bi-funnel" text="No assignments match this filter." compact />
                      </td>
                    </tr>
                  ) : (
                    visible.map((item) => {
                      const status = statusOf(item);
                      const grade = gradeOf(item);
                      return (
                        <tr
                          key={item.id}
                          className="emp-row-clickable"
                          onClick={() => setSelected(item)}
                          tabIndex={0}
                          role="button"
                          aria-label={`View details for assignment: ${item.title}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelected(item);
                            }
                          }}
                        >
                          <td>
                            <div className="fw-semibold text-dark">{item.title}</div>
                            {isOverdue(item) && (
                              <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 mt-1">
                                Overdue
                              </span>
                            )}
                          </td>
                          <td className="text-muted small">{item.course_title || 'General Training'}</td>
                          <td className="text-muted small">
                            {item.due_date ? formatDate(item.due_date) : 'No deadline'}
                          </td>
                          <td>
                            <DetailBadge tone={status.tone}>{status.label}</DetailBadge>
                          </td>
                          <td>
                            {grade !== null ? (
                              <span className="badge bg-info text-dark fw-bold">{grade} / 100</span>
                            ) : (
                              <span className="text-muted small">-</span>
                            )}
                          </td>
                          <td className="text-end">
                            <i className="bi bi-chevron-right text-muted" aria-hidden="true"></i>
                            <span className="visually-hidden">View details</span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <DetailModal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        icon="bi-journal-text"
        accent={selected ? statusOf(selected).tone : 'primary'}
        title={selected?.title || 'Assignment'}
        subtitle={selected?.course_title || 'General Training'}
        badge={selected && <DetailBadge tone={statusOf(selected).tone}>{statusOf(selected).label}</DetailBadge>}
        footer={
          selected && (
            <button type="button" className="btn btn-light" onClick={() => setSelected(null)}>
              Close
            </button>
          )
        }
      >
        {selected && (
          <>
            <DetailSection title="Assignment brief">
              <p className="emp-detail__prose mb-0">
                {selected.description || selected.brief || selected.instructions
                  || 'No detailed brief was recorded for this assignment.'}
              </p>
            </DetailSection>

            <DetailSection title="Details" icon="bi-info-circle">
              <dl className="emp-detail__row-list mb-0">
                <DetailRow label="Course" value={selected.course_title} />
                <DetailRow label="Due date" value={formatDate(selected.due_date)} />
                <DetailRow label="Status" value={statusOf(selected).label} />
                <DetailRow label="Max score" value={selected.max_score != null ? `${selected.max_score} points` : null} />
                <DetailRow label="Assignment ID" value={selected.id} mono />
              </dl>
            </DetailSection>

            <DetailSection title="Your submission" icon="bi-send-check">
              {selected.submission_id ? (
                <dl className="emp-detail__row-list mb-0">
                  <DetailRow label="Submitted on" value={formatDateTime(selected.submitted_at)} />
                  <DetailRow label="Submission ID" value={selected.submission_id} mono />
                  <DetailRow
                    label="Grade"
                    value={gradeOf(selected) !== null ? `${gradeOf(selected)} / 100` : 'Not graded yet'}
                  />
                  <DetailRow
                    label="Instructor feedback"
                    value={selected.feedback || 'No feedback has been recorded yet.'}
                  />
                </dl>
              ) : (
                <p className="text-muted small mb-0">
                  <i className="bi bi-info-circle me-1" aria-hidden="true"></i>
                  You have not submitted this assignment yet.
                </p>
              )}
            </DetailSection>
          </>
        )}
      </DetailModal>
    </AdminPage>
  );
}
