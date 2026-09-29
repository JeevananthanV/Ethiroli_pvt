import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listCourses } from '../../../services/api/courseApi.js';
import {
  getAssignments,
  createAssignment,
  deleteAssignment,
  getSubmissions,
  gradeSubmission
} from '../../../services/api/assignmentApi.js';

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 6,
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--admin-border-subtle)',
  color: 'white'
};

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
    : date.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

/**
 * Tutor / admin assignment studio: author assignments for a course and work
 * through the grading queue (submission -> score + feedback).
 */
export default function TutorAssignments() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const emptyForm = useMemo(() => ({ title: '', description: '', due_date: '', max_score: 100 }), []);
  const [form, setForm] = useState(emptyForm);

  // Grading panel
  const [selected, setSelected] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [gradeForm, setGradeForm] = useState({});
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState(null);

  // 1. Courses the tutor can author against
  const fetchCourses = useCallback(async () => {
    try {
      const data = await listCourses().catch(() => []);
      const list = Array.isArray(data) ? data : (data?.data || []);
      setCourses(list);
      setSelectedCourseId((current) => current || (list.length > 0 ? list[0].id : ''));
    } catch (err) {
      setError(err.message || 'Failed to load courses');
    }
  }, []);

  // 2. Assignments for the selected course
  const fetchAssignments = useCallback(async (courseId) => {
    if (!courseId) {
      setAssignments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getAssignments({ course_id: courseId }).catch(() => []);
      setAssignments(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) {
      setError(err.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    fetchAssignments(selectedCourseId);
  }, [selectedCourseId, fetchAssignments]);

  // 3. Authoring
  const handleCreate = useCallback(async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !selectedCourseId) return;
    setSaving(true);
    setNotice(null);
    try {
      await createAssignment({
        course_id: selectedCourseId,
        title: form.title.trim(),
        description: form.description.trim() || null,
        due_date: form.due_date || null,
        max_score: form.max_score === '' ? 100 : Number(form.max_score)
      });
      setShowCreate(false);
      setForm(emptyForm);
      fetchAssignments(selectedCourseId);
    } catch (err) {
      setNotice(err.response?.data?.message || err.message || 'Could not create the assignment.');
    } finally {
      setSaving(false);
    }
  }, [form, selectedCourseId, fetchAssignments, emptyForm]);

  const closeSubmissions = useCallback(() => {
    setSelected(null);
    setSubmissions([]);
    setGradeForm({});
  }, []);

  const handleDelete = useCallback(async (assignment) => {
    if (!window.confirm(`Delete "${assignment.title}" and all of its submissions?`)) return;
    try {
      await deleteAssignment(assignment.id);
      if (selected?.id === assignment.id) closeSubmissions();
      fetchAssignments(selectedCourseId);
    } catch (err) {
      setNotice(err.response?.data?.message || err.message || 'Could not delete the assignment.');
    }
  }, [selected, selectedCourseId, fetchAssignments, closeSubmissions]);

  // 4. Grading queue
  const openSubmissions = useCallback(async (assignment) => {
    setSelected(assignment);
    setLoadingSubmissions(true);
    setNotice(null);
    try {
      const data = await getSubmissions(assignment.id).catch(() => []);
      const list = Array.isArray(data) ? data : [];
      setSubmissions(list);
      const seed = {};
      list.forEach((sub) => {
        seed[sub.id] = {
          grade: sub.grade ?? '',
          feedback: sub.feedback ?? ''
        };
      });
      setGradeForm(seed);
    } catch (err) {
      setNotice(err.response?.data?.message || err.message || 'Could not load submissions.');
    } finally {
      setLoadingSubmissions(false);
    }
  }, []);

  const handleGrade = useCallback(async (submission) => {
    const entry = gradeForm[submission.id] || {};
    const grade = Number(entry.grade);
    if (entry.grade === '' || !Number.isFinite(grade)) {
      setNotice('Enter a score before saving the grade.');
      return;
    }
    setBusyId(submission.id);
    setNotice(null);
    try {
      await gradeSubmission(submission.id, { grade, feedback: entry.feedback || null });
      await openSubmissions(selected);
      setNotice(`Grade saved for ${submission.student_name || 'learner'}.`);
    } catch (err) {
      setNotice(err.response?.data?.message || err.message || 'Could not save the grade.');
    } finally {
      setBusyId(null);
    }
  }, [gradeForm, selected, openSubmissions]);

  const courseName = useMemo(
    () => courses.find((c) => c.id === selectedCourseId)?.name || courses.find((c) => c.id === selectedCourseId)?.title || '',
    [courses, selectedCourseId]
  );

  return (
    <AdminPage
      title="Assignments"
      subtitle="Create coursework and grade learner submissions"
      loading={loading && !!selectedCourseId}
      error={error}
      onRetry={() => fetchAssignments(selectedCourseId)}
    >
      <div className="dashboard">
        {notice && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              marginBottom: 18,
              borderRadius: 8,
              background: 'rgba(129, 158, 53, 0.12)',
              border: '1px solid rgba(129, 158, 53, 0.4)',
              fontSize: 13
            }}
          >
            <span>{notice}</span>
            <button className="btn secondary" style={{ padding: '4px 10px' }} onClick={() => setNotice(null)}>
              Dismiss
            </button>
          </div>
        )}

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 18 }}>
          <div style={{ minWidth: 240 }}>
            <label style={{ display: 'block', fontSize: 12, marginBottom: 5, color: 'var(--admin-text-muted)' }}>
              Course
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              style={{ ...inputStyle, minWidth: 240 }}
            >
              {courses.length === 0 && <option value="">No courses available</option>}
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.name || c.title} ({c.code || 'Course'})</option>
              ))}
            </select>
          </div>
          <button
            className="btn primary"
            style={{ fontSize: 13 }}
            disabled={!selectedCourseId}
            onClick={() => { setForm(emptyForm); setShowCreate(true); }}
          >
            + New Assignment
          </button>
        </div>

        {/* Assignment list */}
        {!selectedCourseId ? (
          <div className="emptyState">
            <h3>No course selected</h3>
            <p>Create a course first, then post assignments against it.</p>
          </div>
        ) : assignments.length === 0 ? (
          <div className="emptyState">
            <h3>No assignments yet for {courseName || 'this course'}</h3>
            <p>Post your first assignment to start collecting submissions from learners.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {assignments.map((assignment) => (
              <div key={assignment.id} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <h3 style={{ margin: 0, fontSize: 16 }}>{assignment.title}</h3>
                    {assignment.description && (
                      <p style={{ fontSize: 13, color: 'var(--admin-text-secondary)', margin: '6px 0 0 0', whiteSpace: 'pre-wrap' }}>
                        {assignment.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--admin-text-muted)', marginTop: 8, flexWrap: 'wrap' }}>
                      <span>📅 Due: {formatDate(assignment.due_date)}</span>
                      <span>🎯 Max score: {assignment.max_score ?? 100}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <button className="btn primary" style={{ fontSize: 13 }} onClick={() => openSubmissions(assignment)}>
                      Grade submissions
                    </button>
                    <button
                      className="btn secondary"
                      style={{ fontSize: 13, color: '#ff5252' }}
                      onClick={() => handleDelete(assignment)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create assignment modal */}
      {showCreate && (
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
          <div className="card" style={{ width: '92%', maxWidth: 520, padding: 24 }}>
            <h3 style={{ marginTop: 0 }}>New Assignment</h3>
            <p style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginTop: -6 }}>{courseName}</p>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Build a REST API with Express"
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Brief</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What must the learner produce, and how will it be assessed?"
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Due date</label>
                  <input
                    type="date"
                    value={form.due_date}
                    onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Max score</label>
                  <input
                    type="number"
                    min="1"
                    value={form.max_score}
                    onChange={(e) => setForm({ ...form, max_score: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              {notice && <p style={{ fontSize: 13, color: '#ff5252', marginTop: 0 }}>{notice}</p>}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="btn secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" className="btn primary" disabled={saving}>
                  {saving ? 'Creating…' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grading drawer */}
      {selected && (
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
          <div className="card" style={{ width: '94%', maxWidth: 760, padding: 24, maxHeight: '88vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div>
                <h3 style={{ marginTop: 0 }}>{selected.title}</h3>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--admin-text-muted)' }}>
                  {submissions.length} submission{submissions.length === 1 ? '' : 's'} · due {formatDate(selected.due_date)} · out of {selected.max_score ?? 100}
                </p>
              </div>
              <button className="btn secondary" style={{ fontSize: 13 }} onClick={closeSubmissions}>Close</button>
            </div>

            <div style={{ marginTop: 18 }}>
              {loadingSubmissions ? (
                <p style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>Loading submissions…</p>
              ) : submissions.length === 0 ? (
                <div className="emptyState">
                  <h3>No submissions yet</h3>
                  <p>Learner work for this assignment will show up here as it is handed in.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {submissions.map((sub) => {
                    const entry = gradeForm[sub.id] || {};
                    const maxScore = sub.max_score ?? selected.max_score ?? 100;
                    const isGraded = sub.grade !== null && sub.grade !== undefined;

                    return (
                      <div
                        key={sub.id}
                        style={{
                          padding: 14,
                          borderRadius: 8,
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid var(--admin-border-subtle)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                          <div>
                            <strong style={{ fontSize: 14 }}>{sub.student_name || 'Learner'}</strong>
                            <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
                              {sub.student_email}
                              {sub.submitted_at ? ` · submitted ${formatDateTime(sub.submitted_at)}` : ''}
                            </div>
                          </div>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: 20,
                              alignSelf: 'flex-start',
                              background: isGraded ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)',
                              color: isGraded ? '#059669' : '#2563eb'
                            }}
                          >
                            {isGraded ? `Graded ${sub.grade}/${maxScore}` : 'Awaiting grade'}
                          </span>
                        </div>

                        {sub.text_content && (
                          <p style={{ fontSize: 13, whiteSpace: 'pre-wrap', margin: '10px 0 0 0', color: 'var(--admin-text-secondary)' }}>
                            {sub.text_content}
                          </p>
                        )}
                        {sub.file_url && (
                          <a
                            href={sub.file_url}
                            target="_blank"
                            rel="noreferrer"
                            style={{ display: 'inline-block', marginTop: 8, fontSize: 13, color: 'var(--admin-primary)' }}
                          >
                            🔗 Open submitted work
                          </a>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr auto', gap: 10, marginTop: 12, alignItems: 'end' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: 12, marginBottom: 4 }}>Score / {maxScore}</label>
                            <input
                              type="number"
                              min="0"
                              max={maxScore}
                              value={entry.grade ?? ''}
                              onChange={(e) => setGradeForm({ ...gradeForm, [sub.id]: { ...entry, grade: e.target.value } })}
                              style={{ ...inputStyle, padding: '6px 10px' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: 12, marginBottom: 4 }}>Feedback</label>
                            <input
                              type="text"
                              value={entry.feedback ?? ''}
                              onChange={(e) => setGradeForm({ ...gradeForm, [sub.id]: { ...entry, feedback: e.target.value } })}
                              placeholder="What went well, what to improve…"
                              style={{ ...inputStyle, padding: '6px 10px' }}
                            />
                          </div>
                          <button
                            className="btn primary"
                            style={{ fontSize: 13, padding: '7px 14px' }}
                            disabled={busyId === sub.id}
                            onClick={() => handleGrade(sub)}
                          >
                            {busyId === sub.id ? 'Saving…' : 'Save grade'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
