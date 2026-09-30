import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import axios from '../../../services/axios.js';
import { listCourses } from '../../../services/api/courseApi.js';
import lmsApi from '../../../services/api/lmsApi.js';

export default function TutorReports() {
  const [activeReport, setActiveReport] = useState('courses'); // 'courses' | 'batches' | 'students' | 'quizzes' | 'assignments' | 'certificates'
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch Basic Data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [coursesRes, batchesRes] = await Promise.all([
        listCourses().catch(() => []),
        lmsApi.getBatches().catch(() => ({ data: [] }))
      ]);

      setCourses(Array.isArray(coursesRes) ? coursesRes : (coursesRes?.data || []));
      setBatches(Array.isArray(batchesRes?.data) ? batchesRes.data : (Array.isArray(batchesRes) ? batchesRes : []));
    } catch (err) {
      setError(err.message || 'Failed to load report data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Mock Academic Datasets for Reports
  const courseReportData = useMemo(() => [
    { id: 'c-1', name: 'Full Stack MERN Developer (30 Days)', enrollments: 126, active: 98, completed: 22, dropped: 6, avg_progress: 74, avg_quiz: 78, completion_rate: 82 },
    { id: 'c-2', name: 'AI & Data Science Masterclass (45 Days)', enrollments: 84, active: 65, completed: 15, dropped: 4, avg_progress: 68, avg_quiz: 81, completion_rate: 79 },
    { id: 'c-3', name: 'Cloud DevOps & Docker (30 Days)', enrollments: 45, active: 38, completed: 6, dropped: 1, avg_progress: 82, avg_quiz: 85, completion_rate: 89 },
    { id: 'c-4', name: 'UI/UX Design & Figma System (30 Days)', enrollments: 32, active: 28, completed: 3, dropped: 1, avg_progress: 71, avg_quiz: 76, completion_rate: 84 }
  ], []);

  const batchReportData = useMemo(() => [
    { id: 'b-1', code: 'MERN-SEP-01', course: 'Full Stack MERN Developer', students: 25, avg_progress: 74, avg_quiz: 79, attendance: 88, assignments_done: 91, at_risk: 3 },
    { id: 'b-2', code: 'MERN-AUG-02', course: 'Full Stack MERN Developer', students: 24, avg_progress: 92, avg_quiz: 84, attendance: 93, assignments_done: 96, at_risk: 1 },
    { id: 'b-3', code: 'AI-SEP-01', course: 'AI & Data Science Masterclass', students: 20, avg_progress: 62, avg_quiz: 76, attendance: 85, assignments_done: 82, at_risk: 2 },
    { id: 'b-4', code: 'CLOUD-AUG-01', course: 'Cloud DevOps & Docker', students: 18, avg_progress: 88, avg_quiz: 86, attendance: 90, assignments_done: 94, at_risk: 1 }
  ], []);

  const studentReportData = useMemo(() => [
    { id: 's-1', name: 'Arun Kumar', email: 'arun.k@student.ethiroli.net', course: 'Full Stack MERN Developer', progress: 42, phase1: 100, phase2: 40, phase3: 0, quiz_avg: 49, assignments_submitted: '4/8', status: 'AT_RISK' },
    { id: 's-2', name: 'Priya Dharshini', email: 'priya.d@student.ethiroli.net', course: 'Full Stack MERN Developer', progress: 88, phase1: 100, phase2: 100, phase3: 65, quiz_avg: 91, assignments_submitted: '8/8', status: 'ON_TRACK' },
    { id: 's-3', name: 'Karthik Raja', email: 'karthik.r@student.ethiroli.net', course: 'Cloud DevOps & Docker', progress: 76, phase1: 100, phase2: 80, phase3: 50, quiz_avg: 82, assignments_submitted: '7/8', status: 'ON_TRACK' },
    { id: 's-4', name: 'Divya Bharathi', email: 'divya.b@student.ethiroli.net', course: 'AI & Data Science', progress: 54, phase1: 100, phase2: 45, phase3: 20, quiz_avg: 58, assignments_submitted: '5/8', status: 'NEEDS_ATTENTION' },
    { id: 's-5', name: 'Suresh Babu', email: 'suresh.b@student.ethiroli.net', course: 'Full Stack MERN Developer', progress: 96, phase1: 100, phase2: 100, phase3: 90, quiz_avg: 94, assignments_submitted: '8/8', status: 'COMPLETED' }
  ], []);

  const certificateEligibilityData = useMemo(() => [
    { id: 'cert-1', name: 'Suresh Babu', course: 'Full Stack MERN Developer', content_pct: 96, quiz_completion_pct: 92, quiz_avg: 94, assignment_pct: 100, attendance_pct: 92, capstone: 'PASSED', eligible: true },
    { id: 'cert-2', name: 'Priya Dharshini', course: 'Full Stack MERN Developer', content_pct: 90, quiz_completion_pct: 88, quiz_avg: 91, assignment_pct: 100, attendance_pct: 94, capstone: 'PASSED', eligible: true },
    { id: 'cert-3', name: 'Karthik Raja', course: 'Cloud DevOps & Docker', content_pct: 76, quiz_completion_pct: 70, quiz_avg: 82, assignment_pct: 85, attendance_pct: 80, capstone: 'IN_REVIEW', eligible: false },
    { id: 'cert-4', name: 'Arun Kumar', course: 'Full Stack MERN Developer', content_pct: 42, quiz_completion_pct: 40, quiz_avg: 49, assignment_pct: 50, attendance_pct: 68, capstone: 'PENDING', eligible: false }
  ], []);

  // CSV Export Utility
  const handleExportCSV = () => {
    let rows = [];
    let filename = `ethiroli_${activeReport}_report.csv`;

    if (activeReport === 'courses') {
      rows = [
        ['Course Name', 'Total Enrollments', 'Active Students', 'Completed', 'Average Progress (%)', 'Average Quiz Score (%)', 'Completion Rate (%)'],
        ...courseReportData.map(c => [c.name, c.enrollments, c.active, c.completed, `${c.avg_progress}%`, `${c.avg_quiz}%`, `${c.completion_rate}%`])
      ];
    } else if (activeReport === 'batches') {
      rows = [
        ['Batch Code', 'Course', 'Students', 'Avg Progress (%)', 'Avg Quiz (%)', 'Attendance (%)', 'Assignments (%)', 'Students at Risk'],
        ...batchReportData.map(b => [b.code, b.course, b.students, `${b.avg_progress}%`, `${b.avg_quiz}%`, `${b.attendance}%`, `${b.assignments_done}%`, b.at_risk])
      ];
    } else if (activeReport === 'students') {
      rows = [
        ['Student Name', 'Email', 'Course', 'Overall Progress (%)', 'Phase 1', 'Phase 2', 'Phase 3', 'Quiz Avg (%)', 'Assignments', 'Status'],
        ...studentReportData.map(s => [s.name, s.email, s.course, `${s.progress}%`, `${s.phase1}%`, `${s.phase2}%`, `${s.phase3}%`, `${s.quiz_avg}%`, s.assignments_submitted, s.status])
      ];
    } else if (activeReport === 'certificates') {
      rows = [
        ['Student Name', 'Course', 'Content Completion (%)', 'Quiz Completion (%)', 'Quiz Avg (%)', 'Assignment (%)', 'Attendance (%)', 'Capstone Project', 'Eligibility Verdict'],
        ...certificateEligibilityData.map(c => [c.name, c.course, `${c.content_pct}%`, `${c.quiz_completion_pct}%`, `${c.quiz_avg}%`, `${c.assignment_pct}%`, `${c.attendance_pct}%`, c.capstone, c.eligible ? 'ELIGIBLE' : 'PENDING_REQUIREMENTS'])
      ];
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.map(cell => `"${cell}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminPage
      title="Academic Reports & LMS Analytics"
      subtitle="Export and inspect detailed performance, attendance, batch progress, and certificate eligibility"
      loading={loading}
      error={error}
      onRetry={fetchData}
    >
      {/* Report Category Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            className={`btn ${activeReport === 'courses' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveReport('courses')}
          >
            <i className="bi bi-book"></i> Course Reports
          </button>
          <button
            className={`btn ${activeReport === 'batches' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveReport('batches')}
          >
            <i className="bi bi-grid-3x3-gap"></i> Batch Reports
          </button>
          <button
            className={`btn ${activeReport === 'students' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveReport('students')}
          >
            <i className="bi bi-people"></i> Student Progress
          </button>
          <button
            className={`btn ${activeReport === 'certificates' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveReport('certificates')}
          >
            <i className="bi bi-award"></i> Certificate Eligibility
          </button>
        </div>

        <button
          className="btn btn-success"
          onClick={handleExportCSV}
          style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}
        >
          <i className="bi bi-file-earmark-spreadsheet"></i> Export CSV
        </button>
      </div>

      {/* REPORT 1: COURSE REPORTS */}
      {activeReport === 'courses' && (
        <div className="lmsCard">
          <div className="lmsCardHead">
            <h3><i className="bi bi-journals" style={{ marginRight: 8, opacity: 0.7 }}></i>Course Performance Breakdown</h3>
          </div>
          <div className="lmsCardBody noPad">
            <div className="lmsScrollBox">
              <table className="tutorCourseTable">
                <thead>
                  <tr>
                    <th>Course Title</th>
                    <th style={{ textAlign: 'center' }}>Total Enrolled</th>
                    <th style={{ textAlign: 'center' }}>Active</th>
                    <th style={{ textAlign: 'center' }}>Completed</th>
                    <th style={{ textAlign: 'center' }}>Avg Progress</th>
                    <th style={{ textAlign: 'center' }}>Avg Quiz</th>
                    <th style={{ textAlign: 'center' }}>Completion Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {courseReportData.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600 }}>{c.name}</td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>{c.enrollments}</td>
                      <td style={{ textAlign: 'center', color: '#0dcaf0' }}>{c.active}</td>
                      <td style={{ textAlign: 'center', color: '#198754' }}>{c.completed}</td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                          <span style={{ fontWeight: 700 }}>{c.avg_progress}%</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: '#ffc107' }}>{c.avg_quiz}%</td>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: '#198754' }}>{c.completion_rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 2: BATCH REPORTS */}
      {activeReport === 'batches' && (
        <div className="lmsCard">
          <div className="lmsCardHead">
            <h3><i className="bi bi-grid-3x3-gap-fill" style={{ marginRight: 8, opacity: 0.7 }}></i>Cohort Batch Analytics</h3>
          </div>
          <div className="lmsCardBody noPad">
            <div className="lmsScrollBox">
              <table className="tutorCourseTable">
                <thead>
                  <tr>
                    <th>Batch Code</th>
                    <th>Course</th>
                    <th style={{ textAlign: 'center' }}>Students</th>
                    <th style={{ textAlign: 'center' }}>Avg Progress</th>
                    <th style={{ textAlign: 'center' }}>Avg Quiz</th>
                    <th style={{ textAlign: 'center' }}>Attendance</th>
                    <th style={{ textAlign: 'center' }}>Assignments</th>
                    <th style={{ textAlign: 'center' }}>At Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {batchReportData.map((b) => (
                    <tr key={b.id}>
                      <td style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{b.code}</td>
                      <td style={{ color: 'var(--admin-text-secondary)' }}>{b.course}</td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>{b.students}</td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>{b.avg_progress}%</td>
                      <td style={{ textAlign: 'center', color: '#0dcaf0', fontWeight: 700 }}>{b.avg_quiz}%</td>
                      <td style={{ textAlign: 'center', color: '#198754', fontWeight: 700 }}>{b.attendance}%</td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>{b.assignments_done}%</td>
                      <td style={{ textAlign: 'center' }}>
                        {b.at_risk > 0 ? (
                          <span style={{ color: '#dc3545', fontWeight: 700, background: 'rgba(220,53,69,0.15)', padding: '2px 8px', borderRadius: 10 }}>
                            ⚠️ {b.at_risk}
                          </span>
                        ) : (
                          <span style={{ color: '#198754' }}>0</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 3: STUDENT PROGRESS */}
      {activeReport === 'students' && (
        <div className="lmsCard">
          <div className="lmsCardHead">
            <h3><i className="bi bi-person-lines-fill" style={{ marginRight: 8, opacity: 0.7 }}></i>Detailed Student Progress Tracker</h3>
          </div>
          <div className="lmsCardBody noPad">
            <div className="lmsScrollBox">
              <table className="tutorCourseTable">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Course</th>
                    <th style={{ textAlign: 'center' }}>Overall Progress</th>
                    <th style={{ textAlign: 'center' }}>Phase Breakdown</th>
                    <th style={{ textAlign: 'center' }}>Quiz Avg</th>
                    <th style={{ textAlign: 'center' }}>Assignments</th>
                    <th style={{ textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentReportData.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--admin-text-secondary)' }}>{s.email}</div>
                      </td>
                      <td style={{ color: 'var(--admin-text-secondary)', maxWidth: 180 }}>{s.course}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ fontWeight: 700, color: s.progress < 50 ? '#dc3545' : '#198754' }}>
                          {s.progress}%
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', fontSize: 12 }}>
                        P1: {s.phase1}% | P2: {s.phase2}% | P3: {s.phase3}%
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: s.quiz_avg < 60 ? '#dc3545' : '#0dcaf0' }}>
                        {s.quiz_avg}%
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>
                        {s.assignments_submitted}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`statusTag ${s.status === 'COMPLETED' ? 'active' : s.status === 'AT_RISK' ? 'pending' : 'active'}`} style={{
                          background: s.status === 'AT_RISK' ? 'rgba(220,53,69,0.15)' : undefined,
                          color: s.status === 'AT_RISK' ? '#ea868f' : undefined
                        }}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 4: CERTIFICATE ELIGIBILITY */}
      {activeReport === 'certificates' && (
        <div className="lmsCard">
          <div className="lmsCardHead">
            <h3><i className="bi bi-award-fill" style={{ marginRight: 8, opacity: 0.7 }}></i>Certification Rule Audit & Clearance Queue</h3>
          </div>
          <div className="lmsCardBody noPad">
            <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--admin-border-subtle)', fontSize: 12, color: 'var(--admin-text-secondary)' }}>
              <strong>Standard Clearance Rules:</strong> Content $\ge 90\%$ • Quiz Completion $\ge 80\%$ • Quiz Avg $\ge 65\%$ • Assignment $\ge 85\%$ • Attendance $\ge 75\%$ • Capstone Project Passed.
            </div>
            <div className="lmsScrollBox">
              <table className="tutorCourseTable">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Course</th>
                    <th style={{ textAlign: 'center' }}>Content %</th>
                    <th style={{ textAlign: 'center' }}>Quiz %</th>
                    <th style={{ textAlign: 'center' }}>Quiz Avg</th>
                    <th style={{ textAlign: 'center' }}>Assignment %</th>
                    <th style={{ textAlign: 'center' }}>Attendance</th>
                    <th style={{ textAlign: 'center' }}>Capstone</th>
                    <th style={{ textAlign: 'center' }}>Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {certificateEligibilityData.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600 }}>{c.name}</td>
                      <td style={{ color: 'var(--admin-text-secondary)' }}>{c.course}</td>
                      <td style={{ textAlign: 'center', color: c.content_pct >= 90 ? '#198754' : '#dc3545', fontWeight: 700 }}>
                        {c.content_pct}%
                      </td>
                      <td style={{ textAlign: 'center', color: c.quiz_completion_pct >= 80 ? '#198754' : '#dc3545', fontWeight: 700 }}>
                        {c.quiz_completion_pct}%
                      </td>
                      <td style={{ textAlign: 'center', color: c.quiz_avg >= 65 ? '#198754' : '#dc3545', fontWeight: 700 }}>
                        {c.quiz_avg}%
                      </td>
                      <td style={{ textAlign: 'center', color: c.assignment_pct >= 85 ? '#198754' : '#dc3545', fontWeight: 700 }}>
                        {c.assignment_pct}%
                      </td>
                      <td style={{ textAlign: 'center', color: c.attendance_pct >= 75 ? '#198754' : '#dc3545', fontWeight: 700 }}>
                        {c.attendance_pct}%
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: c.capstone === 'PASSED' ? '#198754' : '#ffc107' }}>
                        {c.capstone}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {c.eligible ? (
                          <span style={{ padding: '4px 10px', borderRadius: 12, background: 'rgba(25,135,84,0.15)', color: '#75b798', fontWeight: 700, fontSize: 12 }}>
                            ✓ ELIGIBLE
                          </span>
                        ) : (
                          <span style={{ padding: '4px 10px', borderRadius: 12, background: 'rgba(220,53,69,0.15)', color: '#ea868f', fontWeight: 700, fontSize: 12 }}>
                            PENDING
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
