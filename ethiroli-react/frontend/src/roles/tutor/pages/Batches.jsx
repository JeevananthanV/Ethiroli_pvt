import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import lmsApi from '../../../services/api/lmsApi.js';
import courseApi from '../../../services/api/courseApi.js';

export default function Batches() {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [createForm, setCreateForm] = useState({
    course_id: '',
    batch_code: '',
    name: '',
    start_date: '',
    end_date: '',
    max_capacity: 30,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [batchesRes, coursesRes] = await Promise.all([
        lmsApi.getBatches(),
        courseApi.getAll()
      ]);
      const batchList = batchesRes?.data || (Array.isArray(batchesRes) ? batchesRes : []);
      const courseList = coursesRes?.data || (Array.isArray(coursesRes) ? coursesRes : []);
      setBatches(batchList);
      setCourses(courseList);
      if (courseList.length > 0 && !createForm.course_id) {
        setCreateForm(prev => ({ ...prev, course_id: courseList[0].id }));
      }
    } catch (err) {
      setError(err.message || 'Failed to load cohort batches');
    } finally {
      setLoading(false);
    }
  }, [createForm.course_id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMsg('');
    try {
      await lmsApi.createBatch(createForm);
      setSuccessMsg('Academic cohort batch created successfully!');
      setShowCreateModal(false);
      setCreateForm({
        course_id: courses[0]?.id || '',
        batch_code: '',
        name: '',
        start_date: '',
        end_date: '',
        max_capacity: 30,
      });
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to create batch');
    } finally {
      setSubmitting(false);
    }
  };

  const openAttendanceModal = async (batch) => {
    setSelectedBatch(batch);
    setShowAttendanceModal(true);
    try {
      const res = await lmsApi.getBatchAttendance(batch.id, { date: attendanceDate });
      const rows = res?.data || (Array.isArray(res) ? res : []);
      setAttendanceRecords(
        rows.map(r => ({
          student_id: r.student_id,
          student_name: r.student_name,
          student_email: r.student_email,
          status: r.status || 'PRESENT'
        }))
      );
    } catch (err) {
      alert('Failed to load batch attendance: ' + err.message);
    }
  };

  const handleSaveAttendance = async () => {
    setSubmitting(true);
    try {
      await lmsApi.markBatchAttendance(selectedBatch.id, {
        date: attendanceDate,
        records: attendanceRecords.map(r => ({ student_id: r.student_id, status: r.status }))
      });
      setSuccessMsg(`Attendance for ${selectedBatch.name} on ${attendanceDate} saved successfully!`);
      setShowAttendanceModal(false);
    } catch (err) {
      alert('Failed to save attendance: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateStudentStatus = (studentId, status) => {
    setAttendanceRecords(prev =>
      prev.map(r => (r.student_id === studentId ? { ...r, status } : r))
    );
  };

  return (
    <AdminPage
      title="Academic Cohorts & Batches"
      subtitle="Manage student batches, assign instructors, and record daily roll-call attendance"
      loading={loading}
      error={error}
      onRetry={loadData}
    >
      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center mb-4" role="alert">
          <i className="bi bi-check-circle-fill me-2 fs-5"></i>
          <div>{successMsg}</div>
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="mb-0 fw-bold">Active Batches</h5>
          <small className="text-muted">Total {batches.length} cohorts running</small>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowCreateModal(true)}>
          <i className="bi bi-plus-circle"></i>
          <span>Create Batch</span>
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-muted small text-uppercase">
              <tr>
                <th>Batch Code</th>
                <th>Batch Name</th>
                <th>Course</th>
                <th>Instructor</th>
                <th>Timeline</th>
                <th>Enrolled</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    <i className="bi bi-mortarboard fs-2 d-block mb-2"></i>
                    No batches created yet. Click "Create Batch" to start a new academic cohort.
                  </td>
                </tr>
              ) : (
                batches.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <code className="text-primary fw-bold">{b.batch_code}</code>
                    </td>
                    <td className="fw-semibold text-dark">{b.name}</td>
                    <td>{b.course_name || 'Assigned Course'}</td>
                    <td className="text-muted">{b.tutor_name || 'You'}</td>
                    <td className="text-muted small">
                      {new Date(b.start_date).toLocaleDateString()} - {new Date(b.end_date).toLocaleDateString()}
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {b.student_count || 0} / {b.max_capacity}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                        onClick={() => openAttendanceModal(b)}
                      >
                        <i className="bi bi-calendar-check"></i>
                        <span>Roll Call</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Batch Modal */}
      {showCreateModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Create Academic Batch</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Course</label>
                    <select
                      className="form-select"
                      required
                      value={createForm.course_id}
                      onChange={(e) => setCreateForm({ ...createForm, course_id: e.target.value })}
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.code ? `[${c.code}] ` : ''}{c.name || c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Batch Code</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. BATCH-2026-REACT-01"
                      required
                      value={createForm.batch_code}
                      onChange={(e) => setCreateForm({ ...createForm, batch_code: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Cohort / Batch Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Full-Stack Engineering Morning Cohort"
                      required
                      value={createForm.name}
                      onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label fw-semibold">Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        value={createForm.start_date}
                        onChange={(e) => setCreateForm({ ...createForm, start_date: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold">End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        value={createForm.end_date}
                        onChange={(e) => setCreateForm({ ...createForm, end_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Max Seat Capacity</label>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      max="100"
                      value={createForm.max_capacity}
                      onChange={(e) => setCreateForm({ ...createForm, max_capacity: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create Batch'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Roll Call Modal */}
      {showAttendanceModal && selectedBatch && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <div>
                  <h5 className="modal-title fw-bold">Roll Call: {selectedBatch.name}</h5>
                  <small className="text-muted">Batch Code: {selectedBatch.batch_code}</small>
                </div>
                <button type="button" className="btn-close" onClick={() => setShowAttendanceModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <label className="form-label fw-semibold mb-0">Attendance Date:</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                    />
                  </div>
                  <div className="btn-group btn-group-sm">
                    <button
                      className="btn btn-outline-success"
                      onClick={() => setAttendanceRecords(prev => prev.map(r => ({ ...r, status: 'PRESENT' })))}
                    >
                      All Present
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => setAttendanceRecords(prev => prev.map(r => ({ ...r, status: 'ABSENT' })))}
                    >
                      All Absent
                    </button>
                  </div>
                </div>

                <div className="table-responsive border rounded-3" style={{ maxHeight: '350px' }}>
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light text-muted small text-uppercase sticky-top">
                      <tr>
                        <th>Student Name</th>
                        <th>Email</th>
                        <th className="text-end">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRecords.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="text-center py-4 text-muted">
                            No students enrolled in this batch yet.
                          </td>
                        </tr>
                      ) : (
                        attendanceRecords.map((st) => (
                          <tr key={st.student_id}>
                            <td className="fw-semibold text-dark">{st.student_name || 'Student'}</td>
                            <td className="text-muted small">{st.student_email || '-'}</td>
                            <td className="text-end">
                              <div className="btn-group btn-group-sm" role="group">
                                <button
                                  type="button"
                                  className={`btn ${st.status === 'PRESENT' ? 'btn-success' : 'btn-outline-secondary'}`}
                                  onClick={() => updateStudentStatus(st.student_id, 'PRESENT')}
                                >
                                  Present
                                </button>
                                <button
                                  type="button"
                                  className={`btn ${st.status === 'ABSENT' ? 'btn-danger' : 'btn-outline-secondary'}`}
                                  onClick={() => updateStudentStatus(st.student_id, 'ABSENT')}
                                >
                                  Absent
                                </button>
                                <button
                                  type="button"
                                  className={`btn ${st.status === 'HALF_DAY' ? 'btn-warning text-dark' : 'btn-outline-secondary'}`}
                                  onClick={() => updateStudentStatus(st.student_id, 'HALF_DAY')}
                                >
                                  Half Day
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" onClick={() => setShowAttendanceModal(false)}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSaveAttendance} disabled={submitting || attendanceRecords.length === 0}>
                  {submitting ? 'Saving...' : 'Save Roll Call'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
