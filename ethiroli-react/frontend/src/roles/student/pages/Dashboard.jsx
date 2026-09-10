import React, { useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { fetchDashboard } from '../../../store/slices/studentsSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { dashboard, loading } = useSelector((state) => state.students || {});

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  const enrollments = Array.isArray(dashboard?.enrollments) ? dashboard.enrollments : [];
  const projects = Array.isArray(dashboard?.projects) ? dashboard.projects : [];
  const completedCount = enrollments.filter((e) => (e.progress || 0) >= 100).length;
  const inProgressCount = enrollments.filter((e) => (e.progress || 0) < 100 && (e.progress || 0) > 0).length;

  return (
    <AdminPage
      title="Student Dashboard"
      subtitle="Your courses, projects, and learning progress"
      loading={loading}
    >
      <div className="dashboard">
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card bg-primary text-white h-100">
              <div className="card-body">
                <h6 className="card-title">Enrolled Courses</h6>
                <h2 className="card-text">{enrollments.length}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-info text-white h-100">
              <div className="card-body">
                <h6 className="card-title">In Progress</h6>
                <h2 className="card-text">{inProgressCount}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success text-white h-100">
              <div className="card-body">
                <h6 className="card-title">Completed</h6>
                <h2 className="card-text">{completedCount}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning text-dark h-100">
              <div className="card-body">
                <h6 className="card-title">Projects Linked</h6>
                <h2 className="card-text">{projects.length}</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="row g-3 mb-4">
          <div className="col-md-12">
            <div className="card h-100">
              <div className="card-header">
                <h6 className="mb-0">Student Portal Navigation</h6>
              </div>
              <div className="card-body">
                <div className="d-flex gap-2 flex-wrap">
                  <Link to="/app/student/courses" className="btn btn-outline-primary">My Courses</Link>
                  <Link to="/app/student/course-player" className="btn btn-outline-info">Course Player</Link>
                  <Link to="/app/student/live-classes" className="btn btn-outline-success">Live Classes</Link>
                  <Link to="/app/student/live-quiz" className="btn btn-outline-warning">Live Quiz</Link>
                </div>
                <div className="mt-3">
                  <div className="d-flex gap-3">
                    <Link to="/app/student/assessments" className="btn btn-outline-secondary">Assessments</Link>
                    <Link to="/app/student/assignments" className="btn btn-outline-secondary">Assignments</Link>
                    <Link to="/app/student/projects" className="btn btn-outline-secondary">Projects</Link>
                    <Link to="/app/student/attendance" className="btn btn-outline-secondary">Attendance</Link>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="d-flex gap-3">
                    <Link to="/app/student/doubts" className="btn btn-outline-secondary">Doubts</Link>
                    <Link to="/app/student/messages" className="btn btn-outline-secondary">Messages</Link>
                    <Link to="/app/student/certificates" className="btn btn-outline-secondary">Certificates</Link>
                    <Link to="/app/student/mindmap" className="btn btn-outline-secondary">Mind Map</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}