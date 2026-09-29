import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listMyAssignments, submitAssignment } from '../../../services/api/assignmentApi.js';

const formatDate = (value) => {
  if (!value) return 'No due date';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatDateTime = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const isOverdue = (assignment) =>
  !!assignment.due_date && !assignment.submission_id && new Date(assignment.due_date) < new Date();

/**
 * Derived status for one assignment from the learner's perspective:
 * Not submitted / Submitted / Graded / Overdue / Due soon.
 */
const getStatus = (assignment) => {
  if (assignment.grade !== null && assignment.grade !== undefined && assignment.grade !== '') {
    return { label: 'Graded', background: 'rgba(16,185,129,0.15)', color: '#059669' };
  }
  if (assignment.submission_id) {
    return { label: 'Submitted', background: 'rgba(59,130,246,0.15)', color: '#2563eb' };
  }
  if (isOverdue(assignment)) {
    return { label: 'Overdue', background: 'rgba(239,68,68,0.15)', color: '#dc2626' };
  }
  if (assignment.due_date && new Date(assignment.due_date) - new Date() < 3 * 24 * 60 * 60 * 1000) {
    return { label: 'Due soon', background: 'rgba(245,158,11,0.15)', color: '#d97706' };
  }
  return { label: 'Not submitted', background: 'rgba(148,163,184,0.15)', color: '#64748b' };
};

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 6,
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--admin-border-subtle)',
  color: 'white'
};

/**
 * Learner assignment workspace: every assignment across enrolled courses with
 * its own submission, grade and feedback attached, plus the submit dialog.
 */
export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState('all');
  const [active, setActive] = useState(null);
  const [form, setForm] = useState({ text_content: '', file_url: '' });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listMyAssignments().catch(() => []);
      setAssignments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const counts = useMemo(() => {
    const total = assignments.length;
    const submitted = assignments.filter((a) => a.submission_id).length;
    const graded = assignments.filter((a) => a.grade !== null && a.grade !== undefined && a.grade !== '').length;
    const overdue = assignments.filter(isOverdue).length;
    return { total, submitted, graded, overdue };
  }, [assignments]);

  const visible = useMemo(() => {
    switch (filter) {
      case 'todo':
        return assignments.filter((a) => !a.submission_id);
      case 'submitted':
        return assignments.filter((a) => a.submission_id && (a.grade === null || a.grade === undefined || a.grade === ''));
      case 'graded':
        return assignments.filter((a) => a.grade !== null && a.grade !== undefined && a.grade !== '');
      default:
        return assignments;
    }
  }, [assignments, filter]);

  const openSubmit = useCallback((assignment) => {
    setActive(assignment);
    setForm({
      text_content: assignment.submission_text_content || '',
      file_url: assignment.submission_file_url || ''
    });
    setNotice(null);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!active) return;
    if (!form.text_content.trim() && !form.file_url.trim()) {
      setNotice('Add your answer text or a link to your work before submitting.');
      return;
    }
    setSaving(true);
    setNotice(null);
    try {
      await submitAssignment(active.id, {
        text_content: form.text_content.trim() || null,
        file_url: form.file_url.trim() || null
      });
      setActive(null);
      setForm({ text_content: '', file_url: '' });
      fetchAssignments();
    } catch (err) {
      setNotice(err.response?.data?.message || err.message || 'Could not submit the assignment.');
    } finally {
      setSaving(false);
    }
  }, [active, form, fetchAssignments]);

  const stat = (label, value) => (
    <div
      key={label}
      className="card"
      style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--admin-text-muted)' }}>
        {label}
      </span>
      <span style={{ fontSize: 22, fontWeight: 700 }}>{value}</span>
    </div>
  );

  return (
    <AdminPage
      title="My Assignments"
      subtitle="Track due dates, submit your work and review tutor feedback"
      loading={loading}
      error={error}
      onRetry={fetchAssignments}
    >
      <div className="dashboard">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 18 }}>
          {stat('Total', counts.total)}
          {stat('Submitted', counts.submitted)}
          {stat('Graded', counts.graded)}
          {stat('Overdue', counts.overdue)}
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {[
            ['all', 'All'],
            ['todo', 'To do'],
            ['submitted', 'Awaiting grade'],
            ['graded', 'Graded']
          ].map(([key, label]) => (
            <button
              key={key}
              className={filter === key ? 'btn primary' : 'btn secondary'}
              style={{ fontSize: 12, padding: '6px 14px' }}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="emptyState">
            <h3>No assignments here</h3>
            <p>Assignments posted by your tutor for enrolled courses will appear on this page.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {visible.map((assignment) => {
              const status = getStatus(assignment);
              const score =
                assignment.grade !== null && assignment.grade !== undefined && assignment.grade !== ''
                  ? `${assignment.grade}${assignment.max_score ? ` / ${assignment.max_score}` : ''}`
                  : null;

              return (
                <div key={assignment.id} className="card" style={{ padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 240 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <h3 style={{ margin: 0, fontSize: 16 }}>{assignment.title}</h3>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 20,
                            background: status.background,
                            color: status.color
                          }}
                        >
                          {status.label}
                        </span>
                      </div>

                      {(assignment.course_name || assignment.course_code) && (
                        <div style={{ fontSize: 12, color: 'var(--admin-primary)', marginTop: 4 }}>
                          {assignment.course_code ? `${assignment.course_code} · ` : ''}
                          {assignment.course_name}
                        </div>
                      )}

                      {assignment.description && (
                        <p style={{ fontSize: 13, color: 'var(--admin-text-secondary)', margin: '8px 0 0 0', whiteSpace: 'pre-wrap' }}>
                          {assignment.description}
                        </p>
                      )}

                      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--admin-text-muted)', marginTop: 10, flexWrap: 'wrap' }}>
                        <span>📅 Due: {formatDate(assignment.due_date)}</span>
                        {assignment.max_score ? <span>🎯 Max score: {assignment.max_score}</span> : null}
                        {assignment.submitted_at ? <span>✅ Submitted: {formatDateTime(assignment.submitted_at)}</span> : null}
                        {score ? <span>🏆 Grade: {score}</span> : null}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 150 }}>
                      <button className="btn primary" style={{ fontSize: 13 }} onClick={() => openSubmit(assignment)}>
                        {assignment.submission_id ? 'Update submission' : 'Submit work'}
                      </button>
                    </div>
                  </div>

                  {assignment.feedback && (
                    <div
                      style={{
                        marginTop: 14,
                        padding: '10px 14px',
                        borderRadius: 8,
                        background: 'rgba(129,158,53,0.08)',
                        border: '1px solid rgba(129,158,53,0.35)',
                        fontSize: 13
                      }}
                    >
                      <strong style={{ display: 'block', marginBottom: 4, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--admin-primary)' }}>
                        Tutor feedback{assignment.graded_at ? ` · ${formatDateTime(assignment.graded_at)}` : ''}
                      </strong>
                      <span style={{ whiteSpace: 'pre-wrap' }}>{assignment.feedback}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submit / resubmit dialog */}
      {active && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(4px)'
          }}
        >
          <div className="card" style={{ width: '92%', maxWidth: 540, padding: 24 }}>
            <h3 style={{ marginTop: 0 }}>{active.submission_id ? 'Update Submission' : 'Submit Assignment'}</h3>
            <p style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginTop: -6 }}>
              {active.title}
              {active.due_date ? ` · due ${formatDate(active.due_date)}` : ''}
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Your answer / work</label>
                <textarea
                  rows={7}
                  value={form.text_content}
                  onChange={(e) => setForm({ ...form, text_content: e.target.value })}
                  placeholder="Write your response, paste your code, or describe what you built..."
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Link to your work (optional)</label>
                <input
                  type="url"
                  value={form.file_url}
                  onChange={(e) => setForm({ ...form, file_url: e.target.value })}
                  placeholder="https://github.com/you/repo or a shared document link"
                  style={inputStyle}
                />
              </div>

              {notice && (
                <p style={{ fontSize: 13, color: '#ff5252', marginTop: 0 }}>{notice}</p>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="btn secondary" onClick={() => setActive(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn primary" disabled={saving}>
                  {saving ? 'Submitting…' : active.submission_id ? 'Resubmit' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
