import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import axiosInstance from '../../../services/api/axiosInstance.js';
import { getUsers, createUser, updateUserStatus } from '../../../services/api/userApi.js';
import { courseApi } from '../../../services/api/courseApi.js';
import lmsApi from '../../../services/api/lmsApi.js';

/** Students counted per batch (guarded so a huge install cannot fan out N requests). */
const MAX_BATCH_LOOKUPS = 30;

const unwrap = (res) => res?.data ?? res;

export default function AdminTutors() {
  const [tutors, setTutors] = useState([]);
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batchSizes, setBatchSizes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [handoverTarget, setHandoverTarget] = useState(null);
  const [substituteTutorId, setSubstituteTutorId] = useState('');
  const [handoverLoading, setHandoverLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [newTutor, setNewTutor] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: ''
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, batchesRes, coursesRes] = await Promise.all([
        getUsers({ role: 'TUTOR', limit: 200 }),
        lmsApi.getBatches().catch(() => null),
        courseApi.getAll().catch(() => null)
      ]);

      const userList = unwrap(usersRes);
      const batchList = unwrap(batchesRes) || [];
      const courseList = unwrap(coursesRes) || [];

      setTutors(Array.isArray(userList) ? userList : []);
      setBatches(Array.isArray(batchList) ? batchList : []);
      setCourses(Array.isArray(courseList) ? courseList : []);

      // Batch rosters drive the "learners mentored" metric.
      const trackable = (Array.isArray(batchList) ? batchList : []).slice(0, MAX_BATCH_LOOKUPS);
      if (trackable.length > 0) {
        const sizes = await Promise.all(
          trackable.map((b) =>
            lmsApi
              .getBatchStudents(b.id)
              .then((res) => (unwrap(res) || []).length)
              .catch(() => 0)
          )
        );
        setBatchSizes(
          trackable.reduce((acc, b, i) => {
            acc[b.id] = sizes[i];
            return acc;
          }, {})
        );
      } else {
        setBatchSizes({});
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load faculty');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /** Domain track is derived from the courses actually assigned to the tutor. */
  const tracksFor = (tutorId) =>
    courses.filter((c) => c.tutor_id === tutorId).map((c) => c.name || c.title).filter(Boolean);

  const batchesFor = (tutorId) => batches.filter((b) => b.tutor_id === tutorId);
  const activeBatchesFor = (tutorId) =>
    batchesFor(tutorId).filter((b) => b.is_active === undefined || b.is_active === true || b.is_active === 1);
  const studentsFor = (tutorId) =>
    batchesFor(tutorId).reduce((sum, b) => sum + (batchSizes[b.id] || 0), 0);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const payload = {
        full_name: newTutor.full_name,
        email: newTutor.email,
        phone: newTutor.phone || undefined,
        role: 'TUTOR',
        ...(newTutor.password ? { password: newTutor.password } : {})
      };
      await createUser(payload);
      setFeedback({ type: 'success', message: `${newTutor.full_name} registered as faculty.` });
      setShowModal(false);
      setNewTutor({ full_name: '', email: '', phone: '', password: '' });
      await load();
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || err.message || 'Failed to register faculty.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (tutor) => {
    const nextActive = !(tutor.is_active === undefined ? true : Boolean(tutor.is_active));
    try {
      await updateUserStatus(tutor.id, nextActive ? 'active' : 'inactive');
      setFeedback({
        type: 'success',
        message: `${tutor.full_name} ${nextActive ? 'reactivated' : 'deactivated'}.`
      });
      await load();
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || err.message || 'Failed to update status.'
      });
    }
  };

  const handleExecuteHandover = async (e) => {
    e.preventDefault();
    if (!handoverTarget || !substituteTutorId) return;
    setHandoverLoading(true);
    setFeedback(null);
    try {
      const res = await axiosInstance.post(`/v1/tutors/${handoverTarget.id}/reassign-workload`, {
        substituteTutorId,
        reassignBatches: true,
        reassignCalendarEvents: true,
        reassignTasks: true
      });
      const payload = res?.data || {};
      setFeedback({
        type: 'success',
        message: `Workload transferred successfully! ${payload.batchesReassigned || 0} batches reassigned to the substitute.`
      });
      setHandoverTarget(null);
      setSubstituteTutorId('');
      await load();
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || err.message || 'Failed to reassign workload.'
      });
    } finally {
      setHandoverLoading(false);
    }
  };

  const filtered = tutors.filter((t) => {
    const q = search.toLowerCase();
    const tracks = tracksFor(t.id).join(' ').toLowerCase();
    const matchSearch =
      (t.full_name || '').toLowerCase().includes(q) ||
      (t.email || '').toLowerCase().includes(q) ||
      tracks.includes(q);
    const isActive = t.is_active === undefined ? true : Boolean(t.is_active);
    const matchStatus = statusFilter ? (statusFilter === 'ACTIVE') === isActive : true;
    return matchSearch && matchStatus;
  });

  const totalActiveBatches = tutors.reduce((sum, t) => sum + activeBatchesFor(t.id).length, 0);
  const totalStudents = tutors.reduce((sum, t) => sum + studentsFor(t.id), 0);
  const assignedCourses = courses.filter((c) => c.tutor_id).length;

  return (
    <AdminPage
      title="Faculty & Tutors Management"
      subtitle="Organization-wide faculty directory, course assignments, active batch load, and workload handover"
      loading={loading}
      error={error}
      onRetry={load}
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2 shadow-sm" onClick={() => setShowModal(true)}>
          <i className="bi bi-person-plus-fill"></i>
          <span>Add New Tutor</span>
        </button>
      }
    >
      {feedback && (
        <div className={`alert alert-${feedback.type} alert-dismissible fade show shadow-sm mb-2`} role="alert">
          <div>{feedback.message}</div>
          <button type="button" className="btn-close" onClick={() => setFeedback(null)}></button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="row g-3 mb-2">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Total Instructors</span>
            <h3 className="fw-bold mb-0 mt-1">{tutors.length}</h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Active Teaching Batches</span>
            <h3 className="fw-bold mb-0 mt-1 text-primary">{totalActiveBatches}</h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Learners Mentored</span>
            <h3 className="fw-bold mb-0 mt-1 text-success">{totalStudents}</h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Courses With Assigned Tutor</span>
            <h3 className="fw-bold mb-0 mt-1 text-info">{assignedCourses}</h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card border-0 shadow-sm rounded-3 p-3 mb-2 bg-white">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-8">
            <div className="input-group">
              <span className="input-group-text bg-light border-0"><i className="bi bi-search text-muted"></i></span>
              <input
                type="text"
                className="form-control bg-light border-0"
                placeholder="Search tutor name, email, or assigned course..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <select
              className="form-select bg-light border-0"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-3">Instructor</th>
                <th>Assigned Courses</th>
                <th>Active Batches</th>
                <th>Learners</th>
                <th>Status</th>
                <th className="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    {loading ? 'Loading faculty…' : 'No instructors match the current filters.'}
                  </td>
                </tr>
              )}
              {filtered.map((t) => {
                const tracks = tracksFor(t.id);
                const isActive = t.is_active === undefined ? true : Boolean(t.is_active);
                return (
                  <tr key={t.id}>
                    <td className="ps-3">
                      <div className="fw-semibold text-dark">{t.full_name}</div>
                      <small className="text-muted">{t.email}{t.phone ? ` • ${t.phone}` : ''}</small>
                    </td>
                    <td>
                      {tracks.length === 0 ? (
                        <span className="text-muted small">No course assigned</span>
                      ) : (
                        tracks.map((name) => (
                          <span key={name} className="badge bg-light text-dark border px-2 py-1 me-1">{name}</span>
                        ))
                      )}
                    </td>
                    <td>
                      <span className="badge bg-primary bg-opacity-10 text-primary font-monospace">
                        {activeBatchesFor(t.id).length} Batches
                      </span>
                    </td>
                    <td>
                      <span className="fw-medium text-dark">{studentsFor(t.id)} Enrolled</span>
                    </td>
                    <td>
                      <span className={`badge ${isActive ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`}>
                        {isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="text-end pe-3">
                      <button
                        className="btn btn-sm btn-outline-warning me-1 text-dark"
                        title="Emergency Workload Handover"
                        onClick={() => {
                          setHandoverTarget(t);
                          setSubstituteTutorId('');
                        }}
                      >
                        <i className="bi bi-arrow-left-right me-1"></i>Handover
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary me-1"
                        title={isActive ? 'Deactivate Instructor' : 'Reactivate Instructor'}
                        onClick={() => handleToggleStatus(t)}
                      >
                        <i className={`bi ${isActive ? 'bi-pause-circle' : 'bi-play-circle'} me-1`}></i>
                        {isActive ? 'Suspend' : 'Activate'}
                      </button>
                      <a href={`mailto:${t.email}`} className="btn btn-sm btn-light border" title="Email Tutor">
                        <i className="bi bi-envelope"></i>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Handover Modal */}
      {handoverTarget && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header border-bottom bg-warning bg-opacity-10">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                  <i className="bi bi-arrow-left-right text-warning"></i>
                  Emergency Workload Handover
                </h5>
                <button type="button" className="btn-close" onClick={() => setHandoverTarget(null)}></button>
              </div>
              <form onSubmit={handleExecuteHandover}>
                <div className="modal-body p-3">
                  <div className="alert alert-warning py-2 small mb-3">
                    Reassign all active batches, upcoming live calendar lectures, and intern review tasks from{' '}
                    <strong>{handoverTarget.full_name}</strong> to a verified substitute instructor.
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Absent Instructor</label>
                    <div className="form-control bg-light">
                      {handoverTarget.full_name} ({tracksFor(handoverTarget.id).join(', ') || 'No course assigned'})
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Select Substitute Instructor</label>
                    <select
                      className="form-select"
                      required
                      value={substituteTutorId}
                      onChange={(e) => setSubstituteTutorId(e.target.value)}
                    >
                      <option value="">-- Choose Substitute Faculty --</option>
                      {tutors
                        .filter((t) => t.id !== handoverTarget.id && (t.is_active === undefined || t.is_active))
                        .map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.full_name} ({tracksFor(t.id).join(', ') || 'No course assigned'})
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="border rounded p-3 bg-light small">
                    <div className="fw-semibold text-dark mb-2">Atomic Handover Scope:</div>
                    <div className="form-check mb-1">
                      <input className="form-check-input" type="checkbox" checked readOnly id="hBatch" />
                      <label className="form-check-label" htmlFor="hBatch">
                        Course Batches ({activeBatchesFor(handoverTarget.id).length} Active Batches)
                      </label>
                    </div>
                    <div className="form-check mb-1">
                      <input className="form-check-input" type="checkbox" checked readOnly id="hCal" />
                      <label className="form-check-label" htmlFor="hCal">Future Dynamic Calendar Lecture Occurrences</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked readOnly id="hTasks" />
                      <label className="form-check-label" htmlFor="hTasks">Student Project Evaluations &amp; Intern Mentorship Tasks</label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top bg-light">
                  <button type="button" className="btn btn-light btn-sm" onClick={() => setHandoverTarget(null)}>Cancel</button>
                  <button type="submit" className="btn btn-warning btn-sm px-3" disabled={handoverLoading || !substituteTutorId}>
                    {handoverLoading ? 'Transferring Workload...' : 'Confirm Workload Handover'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Add Faculty Member</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body p-3">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Faculty Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={newTutor.full_name}
                        onChange={(e) => setNewTutor({ ...newTutor, full_name: e.target.value })}
                        placeholder="e.g. Dr. K. Anand"
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        required
                        value={newTutor.email}
                        onChange={(e) => setNewTutor({ ...newTutor, email: e.target.value })}
                        placeholder="tutor@ethiroli.edu"
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Mobile Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={newTutor.phone}
                        onChange={(e) => setNewTutor({ ...newTutor, phone: e.target.value })}
                        placeholder="+91 98401 23456"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Temporary Password</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newTutor.password}
                        onChange={(e) => setNewTutor({ ...newTutor, password: e.target.value })}
                        placeholder="Leave blank to use the platform default"
                      />
                      <div className="form-text">The account is created with role TUTOR and can sign in immediately.</div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top bg-light">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4" disabled={saving}>
                    {saving ? 'Registering...' : 'Register Faculty'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
