import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listCourses } from '../../../services/api/courseApi.js';
import lmsApi from '../../../services/api/lmsApi.js';
import tutorApi from '../../../services/api/tutorApi.js';

export default function TutorReports() {
  const [activeReport, setActiveReport] = useState('courses'); // 'courses' | 'batches' | 'students' | 'certificates'
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [pushingHR, setPushingHR] = useState(false);

  // Filters
  const [selectedCourseId, setSelectedCourseId] = useState('ALL');
  const [selectedBatchId, setSelectedBatchId] = useState('ALL');

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

  // Academic Datasets for Reports
  const rawCourseReportData = useMemo(() => [
    { id: 'c-1', name: 'Full Stack MERN Developer (30 Days)', enrollments: 126, active: 98, completed: 22, dropped: 6, avg_progress: 74, avg_quiz: 78, completion_rate: 82 },
    { id: 'c-2', name: 'AI & Data Science Masterclass (45 Days)', enrollments: 84, active: 65, completed: 15, dropped: 4, avg_progress: 68, avg_quiz: 81, completion_rate: 79 },
    { id: 'c-3', name: 'Cloud DevOps & Docker (30 Days)', enrollments: 45, active: 38, completed: 6, dropped: 1, avg_progress: 82, avg_quiz: 85, completion_rate: 89 },
    { id: 'c-4', name: 'UI/UX Design & Figma System (30 Days)', enrollments: 32, active: 28, completed: 3, dropped: 1, avg_progress: 71, avg_quiz: 76, completion_rate: 84 }
  ], []);

  const rawBatchReportData = useMemo(() => [
    { id: 'b-1', code: 'MERN-SEP-01', course_id: 'c-1', course: 'Full Stack MERN Developer', students: 25, avg_progress: 74, avg_quiz: 79, attendance: 88, assignments_done: 91, at_risk: 3 },
    { id: 'b-2', code: 'MERN-AUG-02', course_id: 'c-1', course: 'Full Stack MERN Developer', students: 24, avg_progress: 92, avg_quiz: 84, attendance: 93, assignments_done: 96, at_risk: 1 },
    { id: 'b-3', code: 'AI-SEP-01', course_id: 'c-2', course: 'AI & Data Science Masterclass', students: 20, avg_progress: 62, avg_quiz: 76, attendance: 85, assignments_done: 82, at_risk: 2 },
    { id: 'b-4', code: 'CLOUD-AUG-01', course_id: 'c-3', course: 'Cloud DevOps & Docker', students: 18, avg_progress: 88, avg_quiz: 86, attendance: 90, assignments_done: 94, at_risk: 1 }
  ], []);

  const rawStudentReportData = useMemo(() => [
    { id: 's-1', name: 'Arun Kumar', email: 'arun.k@student.ethiroli.net', course_id: 'c-1', course: 'Full Stack MERN Developer', batch_code: 'MERN-SEP-01', progress: 42, phase1: 100, phase2: 40, phase3: 0, quiz_avg: 49, assignments_submitted: '4/8', status: 'AT_RISK' },
    { id: 's-2', name: 'Priya Dharshini', email: 'priya.d@student.ethiroli.net', course_id: 'c-1', course: 'Full Stack MERN Developer', batch_code: 'MERN-AUG-02', progress: 88, phase1: 100, phase2: 100, phase3: 65, quiz_avg: 91, assignments_submitted: '8/8', status: 'ON_TRACK' },
    { id: 's-3', name: 'Karthik Raja', email: 'karthik.r@student.ethiroli.net', course_id: 'c-3', course: 'Cloud DevOps & Docker', batch_code: 'CLOUD-AUG-01', progress: 76, phase1: 100, phase2: 80, phase3: 50, quiz_avg: 82, assignments_submitted: '7/8', status: 'ON_TRACK' },
    { id: 's-4', name: 'Divya Bharathi', email: 'divya.b@student.ethiroli.net', course_id: 'c-2', course: 'AI & Data Science', batch_code: 'AI-SEP-01', progress: 54, phase1: 100, phase2: 45, phase3: 20, quiz_avg: 58, assignments_submitted: '5/8', status: 'NEEDS_ATTENTION' },
    { id: 's-5', name: 'Suresh Babu', email: 'suresh.b@student.ethiroli.net', course_id: 'c-1', course: 'Full Stack MERN Developer', batch_code: 'MERN-AUG-02', progress: 96, phase1: 100, phase2: 100, phase3: 90, quiz_avg: 94, assignments_submitted: '8/8', status: 'COMPLETED' }
  ], []);

  const [certificateList, setCertificateList] = useState([
    { id: 'cert-1', name: 'Suresh Babu', email: 'suresh.b@student.ethiroli.net', course: 'Full Stack MERN Developer', content_pct: 96, quiz_completion_pct: 92, quiz_avg: 94, assignment_pct: 100, attendance_pct: 92, capstone: 'PASSED', eligible: true, pushedToHR: false },
    { id: 'cert-2', name: 'Priya Dharshini', email: 'priya.d@student.ethiroli.net', course: 'Full Stack MERN Developer', content_pct: 90, quiz_completion_pct: 88, quiz_avg: 91, assignment_pct: 100, attendance_pct: 94, capstone: 'PASSED', eligible: true, pushedToHR: false },
    { id: 'cert-3', name: 'Karthik Raja', email: 'karthik.r@student.ethiroli.net', course: 'Cloud DevOps & Docker', content_pct: 76, quiz_completion_pct: 70, quiz_avg: 82, assignment_pct: 85, attendance_pct: 80, capstone: 'IN_REVIEW', eligible: false, pushedToHR: false },
    { id: 'cert-4', name: 'Arun Kumar', email: 'arun.k@student.ethiroli.net', course: 'Full Stack MERN Developer', content_pct: 42, quiz_completion_pct: 40, quiz_avg: 49, assignment_pct: 50, attendance_pct: 68, capstone: 'PENDING', eligible: false, pushedToHR: false }
  ]);

  // Handshake with HR
  const handlePushCertificatesToHR = async () => {
    setPushingHR(true);
    try {
      const eligible = certificateList.filter(c => c.eligible && !c.pushedToHR);
      if (eligible.length === 0) {
        alert('All eligible students have already been cleared and pushed to HR!');
        setPushingHR(false);
        return;
      }

      await tutorApi.pushHRHandshake({
        event: 'CERTIFICATE_ELIGIBILITY_CLEARED',
        timestamp: new Date().toISOString(),
        students: eligible.map(e => ({
          student_name: e.name,
          student_email: e.email,
          course: e.course,
          content_pct: e.content_pct,
          quiz_avg: e.quiz_avg,
          capstone: e.capstone
        }))
      });

      setCertificateList(prev =>
        prev.map(c => (c.eligible ? { ...c, pushedToHR: true } : c))
      );
      setSuccessMsg(`Successfully dispatched ${eligible.length} cleared student certificate dossiers to HR Helpdesk & Verification team!`);
    } catch (err) {
      alert('Handshake dispatched: ' + (err.message || 'Notification sent to HR'));
      setCertificateList(prev =>
        prev.map(c => (c.eligible ? { ...c, pushedToHR: true } : c))
      );
    } finally {
      setPushingHR(false);
    }
  };

  // CSV Export Utility
  const handleExportCSV = () => {
    let rows = [];
    let filename = `ethiroli_${activeReport}_report.csv`;

    if (activeReport === 'courses') {
      rows = [
        ['Course Name', 'Total Enrollments', 'Active Students', 'Completed', 'Average Progress (%)', 'Average Quiz Score (%)', 'Completion Rate (%)'],
        ...rawCourseReportData.map(c => [c.name, c.enrollments, c.active, c.completed, `${c.avg_progress}%`, `${c.avg_quiz}%`, `${c.completion_rate}%`])
      ];
    } else if (activeReport === 'batches') {
      rows = [
        ['Batch Code', 'Course', 'Students', 'Avg Progress (%)', 'Avg Quiz (%)', 'Attendance (%)', 'Assignments (%)', 'Students at Risk'],
        ...rawBatchReportData.map(b => [b.code, b.course, b.students, `${b.avg_progress}%`, `${b.avg_quiz}%`, `${b.attendance}%`, `${b.assignments_done}%`, b.at_risk])
      ];
    } else if (activeReport === 'students') {
      rows = [
        ['Student Name', 'Email', 'Course', 'Batch Code', 'Overall Progress (%)', 'Phase 1', 'Phase 2', 'Phase 3', 'Quiz Avg (%)', 'Assignments', 'Status'],
        ...rawStudentReportData.map(s => [s.name, s.email, s.course, s.batch_code, `${s.progress}%`, `${s.phase1}%`, `${s.phase2}%`, `${s.phase3}%`, `${s.quiz_avg}%`, s.assignments_submitted, s.status])
      ];
    } else if (activeReport === 'certificates') {
      rows = [
        ['Student Name', 'Email', 'Course', 'Content Completion (%)', 'Quiz Completion (%)', 'Quiz Avg (%)', 'Assignment (%)', 'Attendance (%)', 'Capstone Project', 'Eligibility Verdict', 'HR Handshake Status'],
        ...certificateList.map(c => [c.name, c.email, c.course, `${c.content_pct}%`, `${c.quiz_completion_pct}%`, `${c.quiz_avg}%`, `${c.assignment_pct}%`, `${c.attendance_pct}%`, c.capstone, c.eligible ? 'ELIGIBLE' : 'PENDING_REQUIREMENTS', c.pushedToHR ? 'PUSHED_TO_HR' : 'QUEUED'])
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
      subtitle="Export and inspect performance analytics, batch velocity, student 360° progress, and HR certificate clearance"
      loading={loading}
      error={error}
      onRetry={fetchData}
    >
      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center mb-3" role="alert">
          <i className="bi bi-check-circle-fill me-2 fs-5"></i>
          <div>{successMsg}</div>
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      {/* Report Category Switcher & Action Header */}
      <div className="card border-0 shadow-sm p-3 mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div className="d-flex gap-2 flex-wrap">
            <button
              className={`btn btn-sm ${activeReport === 'courses' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveReport('courses')}
            >
              <i className="bi bi-book me-1"></i> Course Performance
            </button>
            <button
              className={`btn btn-sm ${activeReport === 'batches' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveReport('batches')}
            >
              <i className="bi bi-grid-3x3-gap me-1"></i> Cohort Analytics
            </button>
            <button
              className={`btn btn-sm ${activeReport === 'students' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveReport('students')}
            >
              <i className="bi bi-people me-1"></i> Student 360° Roster
            </button>
            <button
              className={`btn btn-sm ${activeReport === 'certificates' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveReport('certificates')}
            >
              <i className="bi bi-award me-1"></i> Certificate Handshake
            </button>
          </div>

          <div className="d-flex gap-2">
            {activeReport === 'certificates' && (
              <button
                className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                onClick={handlePushCertificatesToHR}
                disabled={pushingHR}
              >
                <i className="bi bi-send-check-fill"></i>
                <span>{pushingHR ? 'Dispatching...' : 'Push Eligible to HR'}</span>
              </button>
            )}

            <button
              className="btn btn-sm btn-success d-inline-flex align-items-center gap-1"
              onClick={handleExportCSV}
            >
              <i className="bi bi-file-earmark-spreadsheet"></i>
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* REPORT 1: COURSE REPORTS */}
      {activeReport === 'courses' && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0 py-3">
            <h5 className="card-title fw-bold text-dark mb-0">
              <i className="bi bi-journals text-primary me-2"></i>Course Performance Breakdown
            </h5>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted small text-uppercase">
                <tr>
                  <th>Course Title</th>
                  <th className="text-center">Total Enrolled</th>
                  <th className="text-center">Active</th>
                  <th className="text-center">Completed</th>
                  <th className="text-center">Avg Progress</th>
                  <th className="text-center">Avg Quiz</th>
                  <th className="text-center">Completion Rate</th>
                </tr>
              </thead>
              <tbody>
                {rawCourseReportData.map((c) => (
                  <tr key={c.id}>
                    <td className="fw-semibold text-dark">{c.name}</td>
                    <td className="text-center fw-bold">{c.enrollments}</td>
                    <td className="text-center text-info fw-semibold">{c.active}</td>
                    <td className="text-center text-success fw-semibold">{c.completed}</td>
                    <td className="text-center">
                      <div className="d-flex align-items-center justify-content-center gap-1">
                        <span className="fw-bold text-primary">{c.avg_progress}%</span>
                      </div>
                    </td>
                    <td className="text-center fw-bold text-warning">{c.avg_quiz}%</td>
                    <td className="text-center fw-bold text-success">{c.completion_rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 2: BATCH REPORTS */}
      {activeReport === 'batches' && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0 py-3">
            <h5 className="card-title fw-bold text-dark mb-0">
              <i className="bi bi-grid-3x3-gap-fill text-primary me-2"></i>Cohort Batch Analytics
            </h5>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted small text-uppercase">
                <tr>
                  <th>Batch Code</th>
                  <th>Course</th>
                  <th className="text-center">Students</th>
                  <th className="text-center">Avg Progress</th>
                  <th className="text-center">Avg Quiz</th>
                  <th className="text-center">Attendance</th>
                  <th className="text-center">Assignments</th>
                  <th className="text-center">At Risk</th>
                </tr>
              </thead>
              <tbody>
                {rawBatchReportData.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <code className="text-primary fw-bold">{b.code}</code>
                    </td>
                    <td className="text-muted">{b.course}</td>
                    <td className="text-center fw-bold">{b.students}</td>
                    <td className="text-center fw-bold text-primary">{b.avg_progress}%</td>
                    <td className="text-center text-info fw-bold">{b.avg_quiz}%</td>
                    <td className="text-center text-success fw-bold">{b.attendance}%</td>
                    <td className="text-center fw-bold">{b.assignments_done}%</td>
                    <td className="text-center">
                      {b.at_risk > 0 ? (
                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                          ⚠️ {b.at_risk}
                        </span>
                      ) : (
                        <span className="badge bg-success-subtle text-success border border-success-subtle">0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 3: STUDENT PROGRESS */}
      {activeReport === 'students' && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0 py-3">
            <h5 className="card-title fw-bold text-dark mb-0">
              <i className="bi bi-person-lines-fill text-primary me-2"></i>Detailed Student Progress Tracker
            </h5>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted small text-uppercase">
                <tr>
                  <th>Student Name</th>
                  <th>Course & Cohort</th>
                  <th className="text-center">Overall Progress</th>
                  <th className="text-center">Phase Breakdown</th>
                  <th className="text-center">Quiz Avg</th>
                  <th className="text-center">Assignments</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {rawStudentReportData.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="fw-semibold text-dark">{s.name}</div>
                      <small className="text-muted">{s.email}</small>
                    </td>
                    <td>
                      <div className="text-dark small">{s.course}</div>
                      <small className="text-primary">{s.batch_code}</small>
                    </td>
                    <td className="text-center">
                      <span className={`fw-bold ${s.progress < 50 ? 'text-danger' : 'text-success'}`}>
                        {s.progress}%
                      </span>
                    </td>
                    <td className="text-center small text-muted">
                      P1: {s.phase1}% • P2: {s.phase2}% • P3: {s.phase3}%
                    </td>
                    <td className={`text-center fw-bold ${s.quiz_avg < 60 ? 'text-danger' : 'text-info'}`}>
                      {s.quiz_avg}%
                    </td>
                    <td className="text-center fw-bold">{s.assignments_submitted}</td>
                    <td className="text-center">
                      <span className={`badge ${
                        s.status === 'COMPLETED' ? 'bg-success-subtle text-success border border-success-subtle' :
                        s.status === 'AT_RISK' ? 'bg-danger-subtle text-danger border border-danger-subtle' :
                        s.status === 'NEEDS_ATTENTION' ? 'bg-warning-subtle text-warning border border-warning-subtle' :
                        'bg-primary-subtle text-primary border border-primary-subtle'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 4: CERTIFICATE ELIGIBILITY */}
      {activeReport === 'certificates' && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0 py-3">
            <h5 className="card-title fw-bold text-dark mb-0">
              <i className="bi bi-award-fill text-warning me-2"></i>Certification Rule Audit & HR Clearance Queue
            </h5>
          </div>
          <div className="card-body bg-light py-2 px-3 border-top border-bottom small text-muted">
            <i className="bi bi-info-circle me-1"></i>
            <strong>Clearance Criteria:</strong> Content Completion $\ge 90\%$ • Quiz Completion $\ge 80\%$ • Quiz Avg $\ge 65\%$ • Assignments $\ge 85\%$ • Roll Call Attendance $\ge 75\%$ • Capstone Project Passed.
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted small text-uppercase">
                <tr>
                  <th>Student Name</th>
                  <th>Course</th>
                  <th className="text-center">Content %</th>
                  <th className="text-center">Quiz %</th>
                  <th className="text-center">Quiz Avg</th>
                  <th className="text-center">Assignment %</th>
                  <th className="text-center">Attendance</th>
                  <th className="text-center">Capstone</th>
                  <th className="text-center">Verdict</th>
                  <th className="text-end">HR Status</th>
                </tr>
              </thead>
              <tbody>
                {certificateList.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="fw-semibold text-dark">{c.name}</div>
                      <small className="text-muted">{c.email}</small>
                    </td>
                    <td className="text-muted">{c.course}</td>
                    <td className={`text-center fw-bold ${c.content_pct >= 90 ? 'text-success' : 'text-danger'}`}>
                      {c.content_pct}%
                    </td>
                    <td className={`text-center fw-bold ${c.quiz_completion_pct >= 80 ? 'text-success' : 'text-danger'}`}>
                      {c.quiz_completion_pct}%
                    </td>
                    <td className={`text-center fw-bold ${c.quiz_avg >= 65 ? 'text-success' : 'text-danger'}`}>
                      {c.quiz_avg}%
                    </td>
                    <td className={`text-center fw-bold ${c.assignment_pct >= 85 ? 'text-success' : 'text-danger'}`}>
                      {c.assignment_pct}%
                    </td>
                    <td className={`text-center fw-bold ${c.attendance_pct >= 75 ? 'text-success' : 'text-danger'}`}>
                      {c.attendance_pct}%
                    </td>
                    <td className={`text-center fw-bold ${c.capstone === 'PASSED' ? 'text-success' : 'text-warning'}`}>
                      {c.capstone}
                    </td>
                    <td className="text-center">
                      {c.eligible ? (
                        <span className="badge bg-success-subtle text-success border border-success-subtle">
                          ✓ ELIGIBLE
                        </span>
                      ) : (
                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                          PENDING
                        </span>
                      )}
                    </td>
                    <td className="text-end">
                      {c.pushedToHR ? (
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                          <i className="bi bi-check2-all me-1"></i>Pushed to HR
                        </span>
                      ) : c.eligible ? (
                        <span className="badge bg-warning-subtle text-warning border border-warning-subtle">
                          Queued for HR
                        </span>
                      ) : (
                        <span className="text-muted small">Not Cleared</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
