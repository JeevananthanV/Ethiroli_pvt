import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getMyEnrollments } from '../../../services/api/enrollmentApi.js';
import { useSocket } from '../../../common/contexts/SocketContext.jsx';

export default function StudentCourses() {
  const navigate = useNavigate();
  const rawSocket = useSocket();
  const socket = rawSocket?.socket || rawSocket;

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveAlert, setLiveAlert] = useState(null);

  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyEnrollments().catch(() => []);
      setEnrollments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEnrollments(); }, [fetchEnrollments]);

  // Real-Time Socket Event Subscriptions
  useEffect(() => {
    if (!socket) return;

    const handleCoursesAssigned = (data) => {
      setLiveAlert({
        type: 'ASSIGNMENT',
        message: `Your tutor (${data.assigned_by_tutor_name || 'Tutor'}) just assigned ${data.course_ids?.length || 1} new course(s)!`
      });
      fetchEnrollments();
    };

    const handleProgressUpdated = (data) => {
      setEnrollments((prev) =>
        prev.map((e) =>
          e.id === data.enrollment_id
            ? { ...e, progress_percentage: data.progress }
            : e
        )
      );
    };

    const handleUnenrolled = (data) => {
      setEnrollments((prev) => prev.filter((e) => e.id !== data.enrollment_id));
    };

    socket.on('student_courses_assigned', handleCoursesAssigned);
    socket.on('enrollment_progress_updated', handleProgressUpdated);
    socket.on('student_unenrolled', handleUnenrolled);

    return () => {
      socket.off('student_courses_assigned', handleCoursesAssigned);
      socket.off('enrollment_progress_updated', handleProgressUpdated);
      socket.off('student_unenrolled', handleUnenrolled);
    };
  }, [socket, fetchEnrollments]);

  return (
    <AdminPage
      title="My Courses"
      subtitle="Continue learning from where you left off"
      loading={loading}
      error={error}
      onRetry={fetchEnrollments}
    >
      {/* Real-Time Live Notification Banner */}
      {liveAlert && (
        <div className="lmsLiveBanner">
          <div className="lmsBannerText">
            <span style={{ fontSize: 20 }}>🎓</span>
            <div><strong>Real-Time Update: </strong>{liveAlert.message}</div>
          </div>
          <button onClick={() => setLiveAlert(null)} aria-label="Dismiss">✕</button>
        </div>
      )}

      {enrollments.length === 0 ? (
        <div className="lmsEmpty">
          <i className="bi bi-journal-bookmark lmsEmptyIcon"></i>
          <h4>No courses enrolled yet</h4>
          <p>Browse the course catalog and enroll to start learning, or wait for your tutor to assign coursework.</p>
        </div>
      ) : (
        <div className="courseCardGrid">
          {enrollments.map((enr) => {
            const title    = enr.course_name || enr.course_title || enr.course?.name || 'Course';
            const progress = Number(enr.progress_percentage ?? enr.progress ?? 0);
            const courseCode = enr.course_code || enr.course?.code;
            const courseId   = enr.course_id || enr.courseId;
            const tutorName  = enr.assigned_by_tutor_name;
            const dueDate    = enr.due_date ? new Date(enr.due_date).toLocaleDateString() : null;
            const notes      = enr.notes;

            return (
              <div key={enr.id} className="courseCard">
                <div className="courseCardBanner"></div>
                <div className="courseCardHeader">
                  <div className="courseCardMeta">
                    <h4 className="courseCardTitle">{title}</h4>
                    {courseCode && <span className="courseCode">{courseCode}</span>}
                  </div>
                  {tutorName && (
                    <div className="courseAssignedBy">
                      <i className="bi bi-person-check" style={{ marginRight: 4 }}></i>
                      Assigned by <strong>{tutorName}</strong>
                    </div>
                  )}
                </div>

                <div className="courseCardBody">
                  {notes && (
                    <div className="courseNotes">"{notes}"</div>
                  )}

                  <div>
                    <div className="progressRow">
                      <span>{progress}% complete</span>
                      {dueDate && (
                        <span className="dueLabel">
                          <i className="bi bi-clock"></i> Due {dueDate}
                        </span>
                      )}
                    </div>
                    <div className="progressTrack">
                      <div className="progressFill" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="courseCardFooter">
                  <button
                    onClick={() => navigate(`/app/student/course-player?courseId=${courseId}`)}
                    className="btnResume"
                  >
                    <i className={`bi ${progress > 0 ? 'bi-play-circle' : 'bi-play'}`}></i>
                    {progress > 0 ? 'Resume Class' : 'Start Course'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminPage>
  );
}
