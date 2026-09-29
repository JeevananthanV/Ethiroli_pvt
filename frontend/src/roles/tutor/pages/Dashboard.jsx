import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listCourses } from '../../../services/api/courseApi.js';
import { getTutorAssignedCourses } from '../../../services/api/enrollmentApi.js';
import lmsApi from '../../../services/api/lmsApi.js';

const QUICK_LINKS = [
  { label: 'Courses',       to: '/app/tutor/courses',       icon: 'bi-book'              },
  { label: 'Curriculum',    to: '/app/tutor/curriculum',    icon: 'bi-journal-code'      },
  { label: 'Students',      to: '/app/tutor/students',      icon: 'bi-people'            },
  { label: 'Assignments',   to: '/app/tutor/assignments',   icon: 'bi-clipboard-check'   },
  { label: 'Question Bank', to: '/app/tutor/question-bank', icon: 'bi-patch-question'    },
  { label: 'Batches',       to: '/app/tutor/batches',       icon: 'bi-grid-3x3-gap'      },
  { label: 'Calendar',      to: '/app/tutor/calendar',      icon: 'bi-calendar3'         },
  { label: 'Forum',         to: '/app/tutor/forum',         icon: 'bi-chat-dots'         },
];

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [openDoubts, setOpenDoubts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [coursesData, enrollmentData, doubtData] = await Promise.all([
        listCourses().catch((err) => ({ __error: err })),
        getTutorAssignedCourses().catch((err) => ({ __error: err })),
        lmsApi.getDoubts({ status: 'OPEN' }).then((res) => res?.data ?? []).catch((err) => ({ __error: err }))
      ]);

      const failures = [coursesData, enrollmentData, doubtData]
        .filter((v) => v && v.__error)
        .map((v) => v.__error.message);
      if (failures.length > 0) throw new Error(failures.join('; '));

      setCourses(Array.isArray(coursesData) ? coursesData : (coursesData?.data || []));
      setEnrollments(Array.isArray(enrollmentData) ? enrollmentData : (enrollmentData?.data || []));
      setOpenDoubts(Array.isArray(doubtData) ? doubtData.length : (doubtData?.data?.length || 0));
    } catch (err) {
      setError(err.message || 'Failed to load tutor dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const activeStudents = new Set(enrollments.map((e) => e.student_id || e.user_id)).size;

  return (
    <AdminPage
      title="Tutor Dashboard"
      subtitle="Monitor your courses, students, and real-time engagement metrics"
      loading={loading}
      error={error}
      onRetry={fetchData}
    >
      {/* KPI Stat Cards */}
      <div className="lmsStatGrid">
        <div className="lmsStatCard primary">
          <div className="lmsStatIcon"><i className="bi bi-book-half"></i></div>
          <div className="lmsStatLabel">Courses Taught</div>
          <div className="lmsStatValue">{courses.length}</div>
          <div className="lmsStatMeta">{courses.length === 1 ? '1 active course' : `${courses.length} active courses`}</div>
          <Link to="/app/tutor/courses" className="lmsStatLink">
            View courses <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        <div className="lmsStatCard success">
          <div className="lmsStatIcon"><i className="bi bi-people-fill"></i></div>
          <div className="lmsStatLabel">Active Students</div>
          <div className="lmsStatValue">{activeStudents}</div>
          <div className="lmsStatMeta">{enrollments.length} total enrollments</div>
          <Link to="/app/tutor/students" className="lmsStatLink">
            Manage students <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        <div className="lmsStatCard info">
          <div className="lmsStatIcon"><i className="bi bi-clipboard-data"></i></div>
          <div className="lmsStatLabel">Total Enrollments</div>
          <div className="lmsStatValue">{enrollments.length}</div>
          <div className="lmsStatMeta">Across all courses</div>
          <Link to="/app/tutor/students" className="lmsStatLink">
            View roster <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        <div className="lmsStatCard warning">
          <div className="lmsStatIcon"><i className="bi bi-question-circle-fill"></i></div>
          <div className="lmsStatLabel">Open Doubts</div>
          <div className="lmsStatValue">{openDoubts}</div>
          <div className="lmsStatMeta">Awaiting your reply</div>
          <Link to="/app/tutor/forum" className="lmsStatLink">
            Answer doubts <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>

      {/* Two-column layout: Course table + Quick Navigation */}
      <div className="lmsTwoCol">
        {/* Courses Table */}
        <div className="lmsCard" style={{ marginBottom: 0 }}>
          <div className="lmsCardHead">
            <h3><i className="bi bi-journals" style={{ marginRight: 8, opacity: 0.7 }}></i>My Courses</h3>
            <Link to="/app/tutor/courses">View All ({courses.length})</Link>
          </div>
          <div className="lmsCardBody noPad">
            {courses.length === 0 ? (
              <div className="lmsEmpty" style={{ border: 'none', borderRadius: 0 }}>
                <i className="bi bi-book lmsEmptyIcon"></i>
                <h4>No courses yet</h4>
                <p>Your assigned courses will appear here once they are linked to your account.</p>
              </div>
            ) : (
              <div className="lmsScrollBox">
                <table className="tutorCourseTable">
                  <thead>
                    <tr>
                      <th>Course Name</th>
                      <th>Code</th>
                      <th style={{ textAlign: 'center' }}>Students</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.slice(0, 6).map((course) => (
                      <tr key={course.id}>
                        <td style={{ fontWeight: 600, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {course.name || 'Untitled Course'}
                        </td>
                        <td>
                          {course.code ? (
                            <span className="courseCode">{course.code}</span>
                          ) : '—'}
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--color-accent)' }}>
                          {enrollments.filter((e) => e.course_id === course.id).length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="lmsCard" style={{ marginBottom: 0 }}>
          <div className="lmsCardHead">
            <h3><i className="bi bi-grid-3x3-gap" style={{ marginRight: 8, opacity: 0.7 }}></i>Quick Navigation</h3>
          </div>
          <div className="lmsCardBody">
            <div className="quickNavGrid">
              {QUICK_LINKS.map((link) => (
                <Link key={link.to} to={link.to} className="quickNavBtn">
                  <i className={`bi ${link.icon}`}></i>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}

