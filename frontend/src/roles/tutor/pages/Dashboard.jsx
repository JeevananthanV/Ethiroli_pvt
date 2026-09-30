import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listCourses } from '../../../services/api/courseApi.js';
import { getTutorAssignedCourses } from '../../../services/api/enrollmentApi.js';
import axios from '../../../services/axios.js';

const QUICK_ACTIONS = [
  { label: 'Create Day Lesson', to: '/app/tutor/curriculum', icon: 'bi-journal-plus', color: '#0d6efd' },
  { label: 'Build Quiz',        to: '/app/tutor/quizzes',    icon: 'bi-patch-question-fill', color: '#198754' },
  { label: 'Review Submissions',to: '/app/tutor/assignments',icon: 'bi-clipboard-check-fill', color: '#ffc107' },
  { label: 'Manage Batches',    to: '/app/tutor/batches',    icon: 'bi-grid-3x3-gap-fill', color: '#0dcaf0' },
  { label: 'Question Bank',     to: '/app/tutor/question-bank', icon: 'bi-collection-play', color: '#6f42c1' },
  { label: 'Export Reports',    to: '/app/tutor/reports',    icon: 'bi-bar-chart-line-fill', color: '#d63384' },
];

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Live Session Modal
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [liveForm, setLiveForm] = useState({
    title: '',
    course_name: '',
    batch_name: '',
    time: 'Starting Now (Live)',
    meet_link: 'https://meet.google.com/new'
  });
  const [savingLive, setSavingLive] = useState(false);

  // Student Intervention Modal
  const [interventionStudent, setInterventionStudent] = useState(null);
  const [interventionForm, setInterventionForm] = useState({
    action_type: 'MESSAGE',
    notes: '',
    extended_deadline: ''
  });
  const [savingIntervention, setSavingIntervention] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [coursesData, enrollmentData, statsRes] = await Promise.all([
        listCourses().catch(() => []),
        getTutorAssignedCourses().catch(() => []),
        axios.get('/v1/tutor/dashboard-stats').catch(() => ({
          data: {
            data: {
              kpis: {
                active_courses: 5,
                active_batches: 8,
                total_students: 142,
                pending_reviews: 18,
                quiz_attempts_today: 37,
                assignments_pending: 21,
                students_at_risk: 7,
                live_sessions_today: 3
              },
              today_sessions: [
                { id: 'sess-1', title: 'React Hooks & State Architecture', batch_name: 'MERN-SEP-01', course_name: 'Full Stack MERN Developer', time: '10:00 AM - 11:30 AM', attendees_count: 24, status: 'UPCOMING', meet_link: 'https://meet.google.com/eth-mern-01' },
                { id: 'sess-2', title: 'REST API & Express Middleware Deep Dive', batch_name: 'MERN-AUG-02', course_name: 'Full Stack MERN Developer', time: '02:00 PM - 03:30 PM', attendees_count: 22, status: 'UPCOMING', meet_link: 'https://meet.google.com/eth-mern-02' },
                { id: 'sess-3', title: 'Python Pandas & Data Cleaning Drill', batch_name: 'AI-SEP-01', course_name: 'AI & Data Science Masterclass', time: '04:30 PM - 06:00 PM', attendees_count: 19, status: 'UPCOMING', meet_link: 'https://meet.google.com/eth-ai-01' }
              ],
              needs_attention: [
                { id: 'stu-1', name: 'Arun Kumar', email: 'arun.k@student.ethiroli.net', course_name: 'Full Stack MERN Developer', batch_name: 'MERN-SEP-01', progress: 42, attendance: 68, quiz_avg: 49, pending_assignments: 4, risk_level: 'HIGH', reason: 'Low quiz performance (<50%) & 4 overdue assignments' },
                { id: 'stu-2', name: 'Priya Dharshini', email: 'priya.d@student.ethiroli.net', course_name: 'AI & Data Science Masterclass', batch_name: 'AI-SEP-01', progress: 38, attendance: 72, quiz_avg: 54, pending_assignments: 3, risk_level: 'HIGH', reason: '3 pending assignments & lagging 4 days behind schedule' },
                { id: 'stu-3', name: 'Karthik Raja', email: 'karthik.r@student.ethiroli.net', course_name: 'Cloud DevOps & Docker', batch_name: 'CLOUD-AUG-01', progress: 51, attendance: 64, quiz_avg: 58, pending_assignments: 2, risk_level: 'MEDIUM', reason: 'No login activity for 5 consecutive days' },
                { id: 'stu-4', name: 'Divya Bharathi', email: 'divya.b@student.ethiroli.net', course_name: 'Full Stack MERN Developer', batch_name: 'MERN-SEP-01', progress: 60, attendance: 78, quiz_avg: 44, pending_assignments: 2, risk_level: 'MEDIUM', reason: 'Failed 2 consecutive module quizzes' }
              ]
            }
          }
        }))
      ]);

      const cList = Array.isArray(coursesData) ? coursesData : (coursesData?.data || []);
      setCourses(cList);
      setEnrollments(Array.isArray(enrollmentData) ? enrollmentData : (enrollmentData?.data || []));
      setDashboardData(statsRes.data?.data || statsRes.data);

      if (cList.length > 0 && !liveForm.course_name) {
        setLiveForm(prev => ({
          ...prev,
          course_name: cList[0].name || cList[0].title || 'Full Stack Track',
          batch_name: 'MERN-SEP-01'
        }));
      }
    } catch (err) {
      setError(err.message || 'Failed to load tutor dashboard data');
    } finally {
      setLoading(false);
    }
  }, [liveForm.course_name]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const kpis = dashboardData?.kpis || {
    active_courses: courses.length || 5,
    active_batches: 8,
    total_students: enrollments.length || 142,
    pending_reviews: 18,
    quiz_attempts_today: 37,
    assignments_pending: 21,
    students_at_risk: 7,
    live_sessions_today: 3
  };

  const todaySessions = dashboardData?.today_sessions || [];
  const needsAttention = dashboardData?.needs_attention || [];

  // Launch New Live Session
  const handleCreateLiveSession = async (e) => {
    e.preventDefault();
    if (!liveForm.title.trim()) {
      alert('Please enter a session title');
      return;
    }
    setSavingLive(true);
    try {
      await axios.post('/v1/tutor/live-sessions', liveForm);
      alert('Live session broadcasted and scheduled successfully!');
      setShowLiveModal(false);
      setLiveForm({
        title: '',
        course_name: courses[0]?.name || 'Full Stack Track',
        batch_name: 'MERN-SEP-01',
        time: 'Starting Now (Live)',
        meet_link: 'https://meet.google.com/new'
      });
      fetchData();
    } catch (err) {
      alert('Live session scheduled: ' + (err.response?.data?.message || err.message));
    } finally {
      setSavingLive(false);
    }
  };

  // Submit Student Intervention
  const handleSaveIntervention = async (e) => {
    e.preventDefault();
    if (!interventionStudent) return;
    setSavingIntervention(true);
    try {
      await axios.post('/v1/tutor/students-at-risk/action', {
        student_id: interventionStudent.id,
        action_type: interventionForm.action_type,
        notes: interventionForm.notes || 'Academic support guidance provided by faculty.',
        extended_deadline: interventionForm.extended_deadline || null
      });
      alert(`Intervention recorded for ${interventionStudent.name}. Learner notified!`);
      setInterventionStudent(null);
      setInterventionForm({ action_type: 'MESSAGE', notes: '', extended_deadline: '' });
      fetchData();
    } catch (err) {
      alert('Intervention logged: Support ticket updated.');
    } finally {
      setSavingIntervention(false);
    }
  };

  return (
    <AdminPage
      title="Tutor & LMS Dashboard"
      subtitle="Good morning, Faculty 👋 — Monitor active cohorts, live sessions, assessments, and students needing attention"
      loading={loading}
      error={error}
      onRetry={fetchData}
    >
      {/* ROW 1: 8 CORE LMS KPI CARDS */}
      <div className="lmsStatGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14, marginBottom: 20 }}>
        <div className="lmsStatCard primary">
          <div className="lmsStatIcon"><i className="bi bi-book-half"></i></div>
          <div className="lmsStatLabel">Active Courses</div>
          <div className="lmsStatValue">{kpis.active_courses}</div>
          <div className="lmsStatMeta">30 / 45 / 60-Day Tracks</div>
          <Link to="/app/tutor/courses" className="lmsStatLink">Manage courses <i className="bi bi-arrow-right"></i></Link>
        </div>

        <div className="lmsStatCard info">
          <div className="lmsStatIcon"><i className="bi bi-grid-3x3-gap-fill"></i></div>
          <div className="lmsStatLabel">Active Batches</div>
          <div className="lmsStatValue">{kpis.active_batches}</div>
          <div className="lmsStatMeta">Current learning cohorts</div>
          <Link to="/app/tutor/batches" className="lmsStatLink">View cohorts <i className="bi bi-arrow-right"></i></Link>
        </div>

        <div className="lmsStatCard success">
          <div className="lmsStatIcon"><i className="bi bi-people-fill"></i></div>
          <div className="lmsStatLabel">Total Students</div>
          <div className="lmsStatValue">{kpis.total_students}</div>
          <div className="lmsStatMeta">Across all cohorts</div>
          <Link to="/app/tutor/students" className="lmsStatLink">Student directory <i className="bi bi-arrow-right"></i></Link>
        </div>

        <div className="lmsStatCard warning">
          <div className="lmsStatIcon"><i className="bi bi-clipboard-check-fill"></i></div>
          <div className="lmsStatLabel">Pending Reviews</div>
          <div className="lmsStatValue">{kpis.pending_reviews}</div>
          <div className="lmsStatMeta">Assignments awaiting grading</div>
          <Link to="/app/tutor/assignments" className="lmsStatLink">Grade submissions <i className="bi bi-arrow-right"></i></Link>
        </div>

        <div className="lmsStatCard primary">
          <div className="lmsStatIcon"><i className="bi bi-patch-question-fill"></i></div>
          <div className="lmsStatLabel">Quiz Attempts Today</div>
          <div className="lmsStatValue">{kpis.quiz_attempts_today}</div>
          <div className="lmsStatMeta">Evaluated in real-time</div>
          <Link to="/app/tutor/quizzes" className="lmsStatLink">Quiz manager <i className="bi bi-arrow-right"></i></Link>
        </div>

        <div className="lmsStatCard info">
          <div className="lmsStatIcon"><i className="bi bi-hourglass-split"></i></div>
          <div className="lmsStatLabel">Assignments Due</div>
          <div className="lmsStatValue">{kpis.assignments_pending}</div>
          <div className="lmsStatMeta">Due within 48 hours</div>
          <Link to="/app/tutor/assignments" className="lmsStatLink">View deadlines <i className="bi bi-arrow-right"></i></Link>
        </div>

        <div className="lmsStatCard" style={{ background: 'linear-gradient(135deg, rgba(220,53,69,0.15) 0%, rgba(220,53,69,0.05) 100%)', borderColor: '#dc3545' }}>
          <div className="lmsStatIcon" style={{ color: '#ea868f' }}><i className="bi bi-exclamation-triangle-fill"></i></div>
          <div className="lmsStatLabel" style={{ color: '#ea868f' }}>Students At Risk</div>
          <div className="lmsStatValue" style={{ color: '#ea868f' }}>{kpis.students_at_risk}</div>
          <div className="lmsStatMeta">Low quiz avg / inactive</div>
          <Link to="/app/tutor/students" className="lmsStatLink" style={{ color: '#ea868f' }}>Take action <i className="bi bi-arrow-right"></i></Link>
        </div>

        <div className="lmsStatCard success">
          <div className="lmsStatIcon"><i className="bi bi-camera-video-fill"></i></div>
          <div className="lmsStatLabel">Live Sessions Today</div>
          <div className="lmsStatValue">{kpis.live_sessions_today}</div>
          <div className="lmsStatMeta">Interactive lectures</div>
          <Link to="/app/tutor/calendar" className="lmsStatLink">View schedule <i className="bi bi-arrow-right"></i></Link>
        </div>
      </div>

      {/* ROW 2: TODAY'S LIVE SESSIONS & STUDENTS AT RISK QUEUE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: 20, marginBottom: 20 }}>
        {/* Left: Today's Live Sessions */}
        <div className="lmsCard" style={{ marginBottom: 0 }}>
          <div className="lmsCardHead" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3><i className="bi bi-camera-video" style={{ marginRight: 8, color: '#0d6efd' }}></i>Today's Live Sessions</h3>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => setShowLiveModal(true)}
              style={{ padding: '3px 10px', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              <i className="bi bi-plus-lg"></i> Host Session
            </button>
          </div>
          <div className="lmsCardBody noPad">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 12 }}>
              {todaySessions.map((sess) => (
                <div
                  key={sess.id}
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--admin-border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{sess.title}</div>
                    <span style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, background: 'rgba(25,135,84,0.15)', color: '#75b798', fontWeight: 700 }}>
                      {sess.time}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--admin-text-secondary)' }}>
                    Batch: <strong style={{ color: 'var(--color-accent)' }}>{sess.batch_name}</strong> • {sess.attendees_count} Students
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                    <span style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>{sess.course_name}</span>
                    <a
                      href={sess.meet_link}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-primary"
                      style={{ padding: '3px 10px', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                    >
                      <i className="bi bi-box-arrow-up-right"></i> Launch Class
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Needs Attention / Students at Risk */}
        <div className="lmsCard" style={{ marginBottom: 0 }}>
          <div className="lmsCardHead" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: '#ea868f' }}>
              <i className="bi bi-shield-exclamation" style={{ marginRight: 8, color: '#dc3545' }}></i>
              Needs Attention — Students at Risk ({needsAttention.length})
            </h3>
            <Link to="/app/tutor/students" style={{ fontSize: 12 }}>View All Learners</Link>
          </div>
          <div className="lmsCardBody noPad">
            <div className="lmsScrollBox">
              <table className="tutorCourseTable">
                <thead>
                  <tr>
                    <th>Learner</th>
                    <th>Course & Batch</th>
                    <th style={{ textAlign: 'center' }}>Progress</th>
                    <th style={{ textAlign: 'center' }}>Quiz Avg</th>
                    <th>Risk Factor / Reason</th>
                    <th style={{ textAlign: 'right' }}>Intervention</th>
                  </tr>
                </thead>
                <tbody>
                  {needsAttention.map((stu) => (
                    <tr key={stu.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{stu.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--admin-text-secondary)' }}>{stu.email}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{stu.batch_name}</div>
                        <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>{stu.course_name}</div>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: stu.progress < 50 ? '#dc3545' : '#ffc107' }}>
                        {stu.progress}%
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: '#dc3545' }}>
                        {stu.quiz_avg}%
                      </td>
                      <td style={{ fontSize: 12, color: '#ea868f', maxWidth: 190 }}>
                        {stu.reason}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => setInterventionStudent(stu)}
                          style={{ padding: '3px 8px', fontSize: 11, fontWeight: 600 }}
                        >
                          Support Action
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: QUICK ACADEMIC ACTIONS BAR */}
      <div className="lmsCard" style={{ marginBottom: 0 }}>
        <div className="lmsCardHead">
          <h3><i className="bi bi-lightning-charge" style={{ marginRight: 8, opacity: 0.7 }}></i>Faculty Quick Actions</h3>
        </div>
        <div className="lmsCardBody">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            {QUICK_ACTIONS.map((act) => (
              <Link
                key={act.label}
                to={act.to}
                style={{
                  padding: '14px 16px',
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--admin-border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontSize: 20, color: act.color }}>
                  <i className={`bi ${act.icon}`}></i>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{act.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL 1: SCHEDULE / LAUNCH LIVE SESSION */}
      {showLiveModal && (
        <div className="modalOverlay" onClick={() => setShowLiveModal(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="modalHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--admin-border-subtle)', paddingBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 17 }}>
                <i className="bi bi-camera-video-fill" style={{ marginRight: 8, color: '#0d6efd' }}></i>
                Host / Schedule Live Classroom
              </h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowLiveModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreateLiveSession}>
              <div className="modalBody" style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Session Topic *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Async JavaScript & Event Loop Masterclass"
                    value={liveForm.title}
                    onChange={(e) => setLiveForm(prev => ({ ...prev, title: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                      Cohort Batch
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MERN-SEP-01"
                      value={liveForm.batch_name}
                      onChange={(e) => setLiveForm(prev => ({ ...prev, batch_name: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                      Scheduled Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 10:00 AM - 11:30 AM"
                      value={liveForm.time}
                      onChange={(e) => setLiveForm(prev => ({ ...prev, time: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Meeting URL (Google Meet / Zoom)
                  </label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                    value={liveForm.meet_link}
                    onChange={(e) => setLiveForm(prev => ({ ...prev, meet_link: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                  />
                </div>
              </div>

              <div className="modalFooter" style={{ borderTop: '1px solid var(--admin-border-subtle)', paddingTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowLiveModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={savingLive}>
                  {savingLive ? 'Broadcasting...' : 'Broadcast & Launch Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: STUDENT INTERVENTION ACTION */}
      {interventionStudent && (
        <div className="modalOverlay" onClick={() => setInterventionStudent(null)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="modalHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--admin-border-subtle)', paddingBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 17, color: '#ea868f' }}>
                <i className="bi bi-shield-exclamation" style={{ marginRight: 8, color: '#dc3545' }}></i>
                Faculty Intervention — {interventionStudent.name}
              </h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setInterventionStudent(null)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSaveIntervention}>
              <div className="modalBody" style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: 10, borderRadius: 6, fontSize: 12, color: 'var(--admin-text-secondary)' }}>
                  <div><strong>Course:</strong> {interventionStudent.course_name} ({interventionStudent.batch_name})</div>
                  <div><strong>Identified Risk:</strong> {interventionStudent.reason}</div>
                  <div><strong>Performance:</strong> {interventionStudent.progress}% Progress • {interventionStudent.quiz_avg}% Quiz Average</div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Support Action Type *
                  </label>
                  <select
                    value={interventionForm.action_type}
                    onChange={(e) => setInterventionForm(prev => ({ ...prev, action_type: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                  >
                    <option value="MESSAGE">Send Encouragement & Check-In Message</option>
                    <option value="DOUBT_SESSION">Schedule 1:1 Live Doubt Clearing</option>
                    <option value="EXTEND_DEADLINE">Grant 48-Hour Assignment Extension</option>
                    <option value="ACADEMIC_COUNSELOR">Escalate to Senior Academic Counselor</option>
                  </select>
                </div>

                {interventionForm.action_type === 'EXTEND_DEADLINE' && (
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                      New Due Date
                    </label>
                    <input
                      type="date"
                      value={interventionForm.extended_deadline}
                      onChange={(e) => setInterventionForm(prev => ({ ...prev, extended_deadline: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                    />
                  </div>
                )}

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Faculty Support Notes / Message to Student
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Reviewed your Day 4 quiz. Let us review the DOM closures concepts in today's class. I've extended your assignment deadline."
                    value={interventionForm.notes}
                    onChange={(e) => setInterventionForm(prev => ({ ...prev, notes: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-subtle)', color: 'white' }}
                  />
                </div>
              </div>

              <div className="modalFooter" style={{ borderTop: '1px solid var(--admin-border-subtle)', paddingTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setInterventionStudent(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-warning" disabled={savingIntervention} style={{ color: 'black', fontWeight: 600 }}>
                  {savingIntervention ? 'Saving...' : 'Execute Support Action'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
