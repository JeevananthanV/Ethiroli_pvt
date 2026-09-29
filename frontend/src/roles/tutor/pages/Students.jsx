import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getTutorAssignedCourses, getEnrollments, assignCourses } from '../../../services/api/enrollmentApi.js';
import { getUsers } from '../../../services/api/userApi.js';
import { getCourses } from '../../../services/api/courseApi.js';
import { useSocket } from '../../../common/contexts/SocketContext.jsx';

export default function TutorStudents() {
  const rawSocket = useSocket();
  const socket = rawSocket?.socket || rawSocket;

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal & Selection State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Prioritize courses assigned by this tutor; fallback to all visible enrollments
      let rawData = await getTutorAssignedCourses().catch(() => null);
      let list = Array.isArray(rawData) ? rawData : (rawData?.data || []);
      if (!list || list.length === 0) {
        const fallback = await getEnrollments().catch(() => []);
        list = Array.isArray(fallback) ? fallback : (fallback?.data || []);
      }
      setEnrollments(list);
    } catch (err) {
      setError(err.message || 'Failed to load student data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDropdownData = useCallback(async () => {
    try {
      const [studentsRes, coursesRes] = await Promise.all([
        getUsers({ role: 'STUDENT' }).catch(() => []),
        getCourses().catch(() => [])
      ]);
      const studentList = Array.isArray(studentsRes) ? studentsRes : studentsRes?.data || [];
      const courseList = Array.isArray(coursesRes) ? coursesRes : coursesRes?.data || [];
      setStudents(studentList);
      setAvailableCourses(courseList);
    } catch (err) {
      console.warn('Failed to load student or course dropdown list', err);
    }
  }, []);

  useEffect(() => {
    fetchEnrollments();
    fetchDropdownData();
  }, [fetchEnrollments, fetchDropdownData]);

  // Real-Time Socket Event Handling
  useEffect(() => {
    if (!socket) return;

    const handleProgressUpdated = (data) => {
      setEnrollments((prev) =>
        prev.map((enr) =>
          enr.id === data.enrollment_id
            ? { ...enr, progress_percentage: data.progress }
            : enr
        )
      );
    };

    const handleCoursesAssigned = (data) => {
      fetchEnrollments();
      setFeedbackMsg({
        type: 'success',
        text: `Live Sync: ${data.course_ids?.length || 1} course(s) assigned successfully.`
      });
    };

    socket.on('enrollment_progress_updated', handleProgressUpdated);
    socket.on('student_courses_assigned', handleCoursesAssigned);

    return () => {
      socket.off('enrollment_progress_updated', handleProgressUpdated);
      socket.off('student_courses_assigned', handleCoursesAssigned);
    };
  }, [socket, fetchEnrollments]);

  const toggleCourseSelection = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      alert('Please select a student.');
      return;
    }
    if (selectedCourses.length === 0) {
      alert('Please select at least one course.');
      return;
    }

    setAssigning(true);
    setFeedbackMsg(null);
    try {
      await assignCourses({
        student_id: selectedStudent,
        course_ids: selectedCourses,
        due_date: dueDate || null,
        notes: notes || null
      });

      setShowAssignModal(false);
      setSelectedStudent('');
      setSelectedCourses([]);
      setDueDate('');
      setNotes('');
      setFeedbackMsg({
        type: 'success',
        text: `Assigned ${selectedCourses.length} course(s) successfully!`
      });
      fetchEnrollments();
    } catch (err) {
      setFeedbackMsg({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to assign courses.'
      });
    } finally {
      setAssigning(false);
    }
  };

  return (
    <AdminPage
      title="Student Progress & Course Assignments"
      subtitle="Assign personalized courses and monitor real-time learning progress"
      loading={loading}
      error={error}
      onRetry={fetchEnrollments}
    >
      <div>
        {/* Action Bar */}
        <div className="lmsActionBar">
          {feedbackMsg && (
            <div className={`lmsFeedback ${feedbackMsg.type === 'success' ? 'success' : 'error'}`}>
              <i className={`bi ${feedbackMsg.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'}`}></i>
              {feedbackMsg.text}
            </div>
          )}
          <div style={{ marginLeft: 'auto' }}>
            <button
              onClick={() => setShowAssignModal(true)}
              className="btn primary"
            >
              <i className="bi bi-person-plus-fill"></i>
              Assign Courses to Student
            </button>
          </div>
        </div>

        {/* Enrollments Table */}
        {enrollments.length === 0 ? (
          <div className="lmsEmpty">
            <i className="bi bi-people lmsEmptyIcon"></i>
            <h4>No student course assignments found</h4>
            <p>Click "Assign Courses to Student" above to customize learning paths for your students.</p>
          </div>
        ) : (
          <div className="lmsCard" style={{ marginBottom: 0 }}>
            <div className="lmsCardHead">
              <h3><i className="bi bi-people" style={{ marginRight: 8, opacity: 0.7 }}></i>Active Enrolled Students ({enrollments.length})</h3>
            </div>
            <div className="lmsScrollBox">
              <table className="table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Course Code & Title</th>
                    <th>Real-Time Progress</th>
                    <th>Target Due Date</th>
                    <th>Assignment Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((enr) => {
                    const studentName = enr.student_name || enr.user_name || '—';
                    const courseTitle = enr.course_name || enr.course_title || enr.course?.title || '—';
                    const courseCode = enr.course_code || enr.course?.code;
                    const progress = Number(enr.progress_percentage ?? enr.progress ?? 0);
                    const formattedDueDate = enr.due_date ? new Date(enr.due_date).toLocaleDateString() : 'Self-Paced';

                    return (
                      <tr key={enr.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{studentName}</div>
                          {enr.student_email && (
                            <div style={{ fontSize: 12, color: 'var(--admin-text-secondary)' }}>{enr.student_email}</div>
                          )}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{courseTitle}</div>
                          {courseCode && (
                            <span className="courseCode" style={{ fontSize: 11 }}>
                              {courseCode}
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="progressCell">
                            <div className="progressCellBar">
                              <div
                                className="progressCellFill"
                                style={{
                                  width: `${Math.min(progress, 100)}%`,
                                  background: progress >= 100 ? '#10b981' : 'linear-gradient(90deg, var(--base-olive), var(--base-teal))'
                                }}
                              />
                            </div>
                            <span className="progressCellPct">{progress}%</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: 13, color: enr.due_date ? '#d97706' : 'var(--admin-text-secondary)' }}>
                            {formattedDueDate}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: 13, color: 'var(--admin-text-secondary)', fontStyle: enr.notes ? 'italic' : 'normal' }}>
                            {enr.notes || '—'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Assign Courses to Student */}
        {showAssignModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
          >
            <div
              style={{
                background: 'var(--admin-card-bg, #ffffff)',
                color: 'var(--admin-text, #1f2937)',
                borderRadius: 12,
                width: '100%',
                maxWidth: 540,
                padding: 24,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 18 }}>Assign Courses to Student</h3>
                <button
                  onClick={() => setShowAssignModal(false)}
                  style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAssignSubmit}>
                {/* Select Student */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>
                    Select Student *
                  </label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid var(--admin-border-subtle, #d1d5db)',
                      background: 'inherit',
                      color: 'inherit'
                    }}
                  >
                    <option value="">-- Choose a Student --</option>
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.full_name || st.name} ({st.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Multi-Course Checklist */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>
                    Select Course(s) to Assign * ({selectedCourses.length} selected)
                  </label>
                  <div
                    style={{
                      maxHeight: 180,
                      overflowY: 'auto',
                      border: '1px solid var(--admin-border-subtle, #d1d5db)',
                      borderRadius: 6,
                      padding: 8
                    }}
                  >
                    {availableCourses.length === 0 ? (
                      <div style={{ fontSize: 13, color: 'var(--admin-text-secondary)', padding: 8 }}>
                        No courses available.
                      </div>
                    ) : (
                      availableCourses.map((c) => (
                        <label
                          key={c.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '6px 8px',
                            cursor: 'pointer',
                            borderRadius: 4,
                            background: selectedCourses.includes(c.id) ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedCourses.includes(c.id)}
                            onChange={() => toggleCourseSelection(c.id)}
                          />
                          <span style={{ fontSize: 13 }}>
                            <strong>[{c.code || 'CRS'}]</strong> {c.name || c.title}
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                {/* Target Due Date */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>
                    Target Completion Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid var(--admin-border-subtle, #d1d5db)',
                      background: 'inherit',
                      color: 'inherit'
                    }}
                  />
                </div>

                {/* Tutor Notes */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>
                    Tutor Guidance Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Focus on lessons 1 to 4 before the Friday lab session."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid var(--admin-border-subtle, #d1d5db)',
                      background: 'inherit',
                      color: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(false)}
                    className="btn secondary"
                    disabled={assigning}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn primary"
                    disabled={assigning}
                  >
                    {assigning ? 'Assigning...' : 'Assign Courses'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminPage>
  );
}