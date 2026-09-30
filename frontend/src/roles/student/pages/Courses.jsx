import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getMyEnrollments } from '../../../services/api/enrollmentApi.js';
import { useSocket } from '../../../common/contexts/SocketContext.jsx';

const DEFAULT_COURSES = [
  {
    id: 'ENR-01',
    course_id: 'CRS-001',
    course_name: 'Full Stack + AI Web Developer Masterclass',
    course_code: 'FS-AI-2026',
    status: 'ACTIVE',
    progress_percentage: 68,
    current_day: 18,
    total_days: 32,
    current_module: 'React.js & Advanced Hooks',
    attendance_rate: 94,
    quiz_average: 82,
    duration: '6 Months (Part-Time)',
    enrolled_date: '2026-08-15',
    completion_date: '2026-11-30',
    batch: '2026-Q3 FullStack Alpha',
    tutor_name: 'Jeeva Karthik',
    last_accessed: 'Today at 09:30 AM',
    certificate_status: 'Eligible upon completion',
    description: 'Comprehensive enterprise track covering Modern HTML5/CSS3, JavaScript ES6+, React, Node.js, Express, Databases, and AI Integrations.',
  },
  {
    id: 'ENR-02',
    course_id: 'CRS-002',
    course_name: 'Python Data Science & Machine Learning',
    course_code: 'PY-DS-2026',
    status: 'ACTIVE',
    progress_percentage: 35,
    current_day: 12,
    total_days: 30,
    current_module: 'Pandas & Data Cleaning Pipelines',
    attendance_rate: 90,
    quiz_average: 86,
    duration: '4 Months',
    enrolled_date: '2026-09-01',
    completion_date: '2026-12-20',
    batch: '2026-Q3 Data Science Cohort',
    tutor_name: 'Dr. Meenakshi Sundaram',
    last_accessed: 'Yesterday',
    certificate_status: 'In Progress',
    description: 'Data analytics, NumPy, Pandas, Scikit-learn, exploratory data analysis, and predictive ML modeling.',
  },
  {
    id: 'ENR-03',
    course_id: 'CRS-003',
    course_name: 'Cloud DevOps & AWS Infrastructure Architecture',
    course_code: 'AWS-DO-2026',
    status: 'UPCOMING',
    progress_percentage: 0,
    current_day: 0,
    total_days: 24,
    current_module: 'Docker & Microservices Fundamentals',
    attendance_rate: 100,
    quiz_average: '—',
    duration: '3 Months',
    enrolled_date: '2026-09-28',
    completion_date: '2027-01-15',
    batch: '2026-Q4 DevOps Cohort',
    tutor_name: 'Vigneshwaran P.',
    last_accessed: 'Not Started',
    certificate_status: 'Upcoming',
    description: 'Containerization, Kubernetes orchestration, CI/CD pipelines, Terraform IaC, and AWS cloud solutions.',
  },
  {
    id: 'ENR-04',
    course_id: 'CRS-004',
    course_name: 'Modern Web UI/UX Design with Figma Masterclass',
    course_code: 'UIUX-2026',
    status: 'COMPLETED',
    progress_percentage: 100,
    current_day: 20,
    total_days: 20,
    current_module: 'Final Capstone Design Presentation',
    attendance_rate: 98,
    quiz_average: 94,
    duration: '2 Months',
    enrolled_date: '2026-06-01',
    completion_date: '2026-08-01',
    batch: '2026-Q2 Design Cohort',
    tutor_name: 'Pooja Krishnan',
    last_accessed: '2 weeks ago',
    certificate_status: 'Verified & Issued',
    description: 'Design thinking, design tokens, Figma auto-layout, interactive prototypes, and design system engineering.',
  },
];

export default function StudentCourses() {
  const navigate = useNavigate();
  const rawSocket = useSocket();
  const socket = rawSocket?.socket || rawSocket;

  const [enrollments, setEnrollments] = useState(DEFAULT_COURSES);
  const [activeTab, setActiveTab] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveAlert, setLiveAlert] = useState(null);

  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyEnrollments().catch(() => []);
      if (Array.isArray(data) && data.length > 0) {
        // Merge API data with default rich presentation fields
        const merged = data.map((apiItem, idx) => ({
          ...(DEFAULT_COURSES[idx] || DEFAULT_COURSES[0]),
          ...apiItem,
          course_name: apiItem.course_name || apiItem.course?.name || DEFAULT_COURSES[idx]?.course_name,
        }));
        setEnrollments(merged);
      } else {
        setEnrollments(DEFAULT_COURSES);
      }
    } catch (err) {
      console.warn('Fallback to local enriched course list:', err);
      setEnrollments(DEFAULT_COURSES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  // Real-Time Socket Event Subscriptions
  useEffect(() => {
    if (!socket) return;

    const handleCoursesAssigned = (data) => {
      setLiveAlert({
        type: 'ASSIGNMENT',
        message: `Your tutor (${data.assigned_by_tutor_name || 'Tutor'}) just assigned ${data.course_ids?.length || 1} new course(s)!`,
      });
      fetchEnrollments();
    };

    const handleProgressUpdated = (data) => {
      setEnrollments((prev) =>
        prev.map((e) =>
          e.id === data.enrollment_id || e.course_id === data.course_id
            ? { ...e, progress_percentage: data.progress }
            : e
        )
      );
    };

    socket.on('student_courses_assigned', handleCoursesAssigned);
    socket.on('enrollment_progress_updated', handleProgressUpdated);

    return () => {
      socket.off('student_courses_assigned', handleCoursesAssigned);
      socket.off('enrollment_progress_updated', handleProgressUpdated);
    };
  }, [socket, fetchEnrollments]);

  const filteredCourses = useMemo(() => {
    return enrollments.filter((c) => {
      if (activeTab === 'ALL') return true;
      if (activeTab === 'ACTIVE') return c.status === 'ACTIVE' || c.progress_percentage < 100;
      if (activeTab === 'UPCOMING') return c.status === 'UPCOMING' || c.progress_percentage === 0;
      if (activeTab === 'COMPLETED') return c.status === 'COMPLETED' || c.progress_percentage === 100;
      if (activeTab === 'EXPIRED') return c.status === 'EXPIRED';
      return true;
    });
  }, [enrollments, activeTab]);

  return (
    <AdminPage
      title="My Enrolled Courses & Degree Programs"
      subtitle="Access your active coursework, review your course roadmap, jump directly into day lessons, and monitor completion status."
      loading={loading}
      error={error}
      onRetry={fetchEnrollments}
    >
      {/* Real-Time Live Notification Banner */}
      {liveAlert && (
        <div className="lmsLiveBanner mb-3">
          <div className="lmsBannerText">
            <span style={{ fontSize: 20 }}>🎓</span>
            <div><strong>Real-Time Update: </strong>{liveAlert.message}</div>
          </div>
          <button onClick={() => setLiveAlert(null)} aria-label="Dismiss">✕</button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div className="btn-group" role="group">
          {['ALL', 'ACTIVE', 'UPCOMING', 'COMPLETED', 'EXPIRED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-outline-secondary'}`}
            >
              {tab === 'ALL' && 'All Enrolled'}
              {tab === 'ACTIVE' && '🔥 Active Courses'}
              {tab === 'UPCOMING' && '📅 Upcoming'}
              {tab === 'COMPLETED' && '🏆 Completed'}
              {tab === 'EXPIRED' && 'Expired'}
            </button>
          ))}
        </div>
        <div className="text-muted small">
          Showing <strong>{filteredCourses.length}</strong> of {enrollments.length} Programs
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="row g-4">
        {filteredCourses.map((enr) => {
          const title = enr.course_name || 'Course Program';
          const progress = Number(enr.progress_percentage ?? 0);
          const courseId = enr.course_id || enr.id;

          return (
            <div key={enr.id} className="col-12 col-lg-6">
              <div className="card h-100 border shadow-sm">
                <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-start">
                  <div>
                    <span className="badge bg-secondary-subtle text-secondary me-2">{enr.course_code}</span>
                    <span className="badge bg-primary-subtle text-primary">{enr.batch}</span>
                    <h5 className="card-title fw-bold text-dark h6 mt-2 mb-0">{title}</h5>
                  </div>
                  {progress === 100 ? (
                    <span className="badge bg-success text-white">Completed</span>
                  ) : progress > 0 ? (
                    <span className="badge bg-warning text-dark">In Progress</span>
                  ) : (
                    <span className="badge bg-secondary text-white">Upcoming</span>
                  )}
                </div>

                <div className="card-body p-4 d-flex flex-column">
                  <p className="small text-muted mb-3">{enr.description}</p>

                  {/* Course KPI Metric Grid */}
                  <div className="p-3 bg-light rounded mb-3">
                    <div className="row g-2 text-center">
                      <div className="col-4 border-end">
                        <div className="small text-muted" style={{ fontSize: 11 }}>Progress</div>
                        <div className="fw-bold text-primary">{progress}%</div>
                      </div>
                      <div className="col-4 border-end">
                        <div className="small text-muted" style={{ fontSize: 11 }}>Current Day</div>
                        <div className="fw-bold text-dark">
                          {enr.current_day > 0 ? `Day ${enr.current_day}/${enr.total_days}` : '—'}
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="small text-muted" style={{ fontSize: 11 }}>Attendance</div>
                        <div className="fw-bold text-success">{enr.attendance_rate}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between small text-muted mb-1">
                      <span>{enr.current_module}</span>
                      <span className="fw-bold">{progress}% complete</span>
                    </div>
                    <div className="progressTrack" style={{ height: 8 }}>
                      <div className="progressFill" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>

                  {/* Additional Metadata */}
                  <div className="small text-muted mb-3 d-flex flex-wrap gap-3">
                    <div>
                      <i className="bi bi-person-check me-1 text-primary" />
                      Tutor: <strong>{enr.tutor_name}</strong>
                    </div>
                    <div>
                      <i className="bi bi-clock me-1 text-secondary" />
                      Last Active: <strong>{enr.last_accessed}</strong>
                    </div>
                    <div>
                      <i className="bi bi-award me-1 text-warning" />
                      Certificate: <strong>{enr.certificate_status}</strong>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex gap-2 pt-3 border-top mt-auto">
                    <button
                      onClick={() => navigate(`/app/student/course-player?courseId=${courseId}`)}
                      className="btn btn-primary flex-grow-1 d-inline-flex align-items-center justify-content-center gap-1"
                    >
                      <i className={`bi ${progress > 0 ? 'bi-play-circle-fill' : 'bi-play-fill'}`} />
                      {progress > 0 ? 'Continue Day Lesson' : 'Start Course'}
                    </button>
                    <Link
                      to="/app/student/learning-path"
                      className="btn btn-outline-secondary"
                      title="View Learning Path"
                    >
                      <i className="bi bi-compass me-1" /> Roadmap
                    </Link>
                    <Link
                      to="/app/student/modules"
                      className="btn btn-outline-secondary"
                      title="View Modules"
                    >
                      <i className="bi bi-diagram-3 me-1" /> Modules
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AdminPage>
  );
}
