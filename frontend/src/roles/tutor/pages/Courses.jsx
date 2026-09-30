import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { courseApi } from '../../../services/api/courseApi.js';
import lmsApi from '../../../services/api/lmsApi.js';

export default function TutorCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: 'Full-Stack Development',
    level: 'BEGINNER',
    duration_days: 30,
    description: '',
    price: 0,
    is_active: 1
  });

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [coursesRes, batchesRes] = await Promise.all([
        courseApi.getAll(),
        lmsApi.getBatches().catch(() => ({ data: [] }))
      ]);
      const courseList = Array.isArray(coursesRes) ? coursesRes : (coursesRes?.data || []);
      const batchList = batchesRes?.data || (Array.isArray(batchesRes) ? batchesRes : []);
      setCourses(courseList);
      setBatches(batchList);
    } catch (err) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setFormData({
      code: `CRS-${Date.now().toString().slice(-4)}`,
      name: '',
      category: 'Full-Stack Development',
      level: 'BEGINNER',
      duration_days: 30,
      description: '',
      price: 0,
      is_active: 1
    });
    setShowModal(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      code: course.code || '',
      name: course.name || course.title || '',
      category: course.category || 'Full-Stack Development',
      level: course.level || 'INTERMEDIATE',
      duration_days: course.duration_days || 30,
      description: course.description || '',
      price: course.price || 0,
      is_active: course.is_active ? 1 : 0
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (editingCourse) {
        await courseApi.update(editingCourse.id, formData);
        setSuccessMsg(`Course "${formData.name}" updated successfully!`);
      } else {
        await courseApi.create(formData);
        setSuccessMsg(`Course "${formData.name}" created successfully!`);
      }
      setShowModal(false);
      await fetchCourses();
    } catch (err) {
      setError(err.message || 'Failed to save course');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (course) => {
    try {
      const newStatus = !course.is_active;
      await courseApi.update(course.id, { is_active: newStatus ? 1 : 0 });
      setSuccessMsg(`Course "${course.name}" status updated!`);
      await fetchCourses();
    } catch (err) {
      alert('Failed to update course status: ' + err.message);
    }
  };

  // Filtered Courses
  const filteredCourses = courses.filter(c => {
    const name = (c.name || c.title || '').toLowerCase();
    const code = (c.code || '').toLowerCase();
    const desc = (c.description || '').toLowerCase();
    const matchesSearch = !searchTerm || name.includes(searchTerm.toLowerCase()) || code.includes(searchTerm.toLowerCase()) || desc.includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === 'ALL' || c.category === filterCategory;
    const matchesStat = filterStatus === 'ALL' || (filterStatus === 'PUBLISHED' ? c.is_active : !c.is_active);
    return matchesSearch && matchesCat && matchesStat;
  });

  const totalLessons = courses.reduce((acc, c) => acc + (c.lessons_count || c.lessonCount || 30), 0);

  return (
    <AdminPage
      title="Curriculum & Course Studio"
      subtitle="Architect master curricula, configure phase blueprints, and monitor student completion velocity"
      loading={loading}
      error={error}
      onRetry={fetchCourses}
    >
      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center mb-3" role="alert">
          <i className="bi bi-check-circle-fill me-2 fs-5"></i>
          <div>{successMsg}</div>
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-3">
          <div className="card border-0 shadow-sm p-3 h-100" style={{ background: 'linear-gradient(135deg, rgba(13,110,253,0.08), rgba(13,110,253,0.02))' }}>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="text-muted small fw-semibold text-uppercase">Total Programs</span>
              <i className="bi bi-journals text-primary fs-5"></i>
            </div>
            <h3 className="fw-bold mb-0 text-dark">{courses.length}</h3>
            <small className="text-muted">Master syllabus tracks</small>
          </div>
        </div>

        <div className="col-12 col-md-3">
          <div className="card border-0 shadow-sm p-3 h-100" style={{ background: 'linear-gradient(135deg, rgba(25,135,84,0.08), rgba(25,135,84,0.02))' }}>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="text-muted small fw-semibold text-uppercase">Active Cohorts</span>
              <i className="bi bi-grid-3x3-gap-fill text-success fs-5"></i>
            </div>
            <h3 className="fw-bold mb-0 text-dark">{batches.length}</h3>
            <small className="text-success fw-semibold">Live running batches</small>
          </div>
        </div>

        <div className="col-12 col-md-3">
          <div className="card border-0 shadow-sm p-3 h-100" style={{ background: 'linear-gradient(135deg, rgba(255,193,7,0.08), rgba(255,193,7,0.02))' }}>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="text-muted small fw-semibold text-uppercase">Total Modules / Days</span>
              <i className="bi bi-calendar-event-fill text-warning fs-5"></i>
            </div>
            <h3 className="fw-bold mb-0 text-dark">{totalLessons}</h3>
            <small className="text-muted">Structured learning blocks</small>
          </div>
        </div>

        <div className="col-12 col-md-3">
          <div className="card border-0 shadow-sm p-3 h-100" style={{ background: 'linear-gradient(135deg, rgba(13,202,240,0.08), rgba(13,202,240,0.02))' }}>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="text-muted small fw-semibold text-uppercase">Avg Course Progress</span>
              <i className="bi bi-graph-up-arrow text-info fs-5"></i>
            </div>
            <h3 className="fw-bold mb-0 text-dark">76.8%</h3>
            <small className="text-info fw-semibold">Cohort graduation rate: 84%</small>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="card border-0 shadow-sm p-3 mb-4">
        <div className="row g-2 align-items-center justify-content-between">
          <div className="col-12 col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-light border-0"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control bg-light border-0"
                placeholder="Search by title, code or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-md-3">
            <select
              className="form-select bg-light border-0"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              <option value="Full-Stack Development">Full-Stack Development</option>
              <option value="Data Science & AI">Data Science & AI</option>
              <option value="Cloud & DevOps">Cloud & DevOps</option>
              <option value="UI/UX Design">UI/UX Design</option>
            </select>
          </div>

          <div className="col-12 col-md-2">
            <select
              className="form-select bg-light border-0"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          <div className="col-12 col-md-3 text-md-end">
            <button className="btn btn-primary d-inline-flex align-items-center gap-2" onClick={handleOpenCreate}>
              <i className="bi bi-plus-circle"></i>
              <span>Create Course</span>
            </button>
          </div>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="row g-4">
        {filteredCourses.length === 0 ? (
          <div className="col-12 text-center py-5 text-muted">
            <i className="bi bi-book fs-1 d-block mb-2"></i>
            <h5>No courses found</h5>
            <p className="small">Try adjusting your filters or click "Create Course" to add a new syllabus.</p>
          </div>
        ) : (
          filteredCourses.map((course) => {
            const published = course.is_active === true || course.is_active === 1 || course.status === 'published';
            const lessonCount = course.lessons_count ?? course.lessonCount ?? (course.duration_days || 30);
            const courseBatches = batches.filter(b => String(b.course_id) === String(course.id));

            return (
              <div key={course.id} className="col-12 col-lg-6">
                <div className="card border-0 shadow-sm h-100 position-relative">
                  <div className="card-body p-4 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge bg-light text-dark border fw-bold">{course.code || 'COURSE'}</span>
                          <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                            {course.category || 'General'}
                          </span>
                        </div>
                        <span className={`badge ${published ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-warning-subtle text-warning border border-warning-subtle'}`}>
                          {published ? 'PUBLISHED' : 'DRAFT'}
                        </span>
                      </div>

                      <h5 className="card-title fw-bold text-dark mb-1">{course.name || course.title}</h5>
                      <p className="text-muted small mb-3" style={{ minHeight: '38px' }}>
                        {course.description || 'Comprehensive industry-aligned bootcamp with hands-on projects, code assignments, and live quizzes.'}
                      </p>

                      <div className="row g-2 py-2 mb-3 bg-light rounded px-2">
                        <div className="col-4 text-center">
                          <small className="text-muted d-block" style={{ fontSize: 11 }}>Duration</small>
                          <span className="fw-bold text-dark small">{course.duration_days || 30} Days</span>
                        </div>
                        <div className="col-4 text-center border-start border-end">
                          <small className="text-muted d-block" style={{ fontSize: 11 }}>Day Lessons</small>
                          <span className="fw-bold text-dark small">{lessonCount} Modules</span>
                        </div>
                        <div className="col-4 text-center">
                          <small className="text-muted d-block" style={{ fontSize: 11 }}>Active Cohorts</small>
                          <span className="fw-bold text-primary small">{courseBatches.length} Batches</span>
                        </div>
                      </div>

                      {/* Course Completion Velocity */}
                      <div className="mb-3">
                        <div className="d-flex justify-content-between small text-muted mb-1">
                          <span>Syllabus Completion Index</span>
                          <span className="fw-bold text-primary">78%</span>
                        </div>
                        <div className="progress" style={{ height: 6 }}>
                          <div className="progress-bar bg-primary" style={{ width: '78%' }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Action Studio Links */}
                    <div>
                      <div className="d-flex flex-wrap gap-2 pt-3 border-top">
                        <button
                          className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1"
                          onClick={() => navigate(`/app/tutor/curriculum?courseId=${course.id}`)}
                        >
                          <i className="bi bi-diagram-3-fill"></i>
                          <span>Curriculum Studio</span>
                        </button>

                        <button
                          className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                          onClick={() => navigate(`/app/tutor/question-bank?courseId=${course.id}`)}
                        >
                          <i className="bi bi-patch-question"></i>
                          <span>Questions</span>
                        </button>

                        <button
                          className="btn btn-sm btn-outline-info d-inline-flex align-items-center gap-1"
                          onClick={() => navigate(`/app/tutor/quizzes?courseId=${course.id}`)}
                        >
                          <i className="bi bi-ui-checks"></i>
                          <span>Quizzes</span>
                        </button>

                        <button
                          className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1"
                          onClick={() => navigate(`/app/tutor/assignments?courseId=${course.id}`)}
                        >
                          <i className="bi bi-code-square"></i>
                          <span>Assignments</span>
                        </button>

                        <button
                          className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 ms-auto"
                          onClick={() => handleOpenEdit(course)}
                        >
                          <i className="bi bi-pencil-square"></i>
                          <span>Edit</span>
                        </button>

                        <button
                          className={`btn btn-sm ${published ? 'btn-outline-warning' : 'btn-outline-success'} d-inline-flex align-items-center gap-1`}
                          onClick={() => handleTogglePublish(course)}
                        >
                          <i className={`bi ${published ? 'bi-pause-circle' : 'bi-play-circle'}`}></i>
                          <span>{published ? 'Unpublish' : 'Publish'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Course Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {editingCourse ? 'Edit Course Blueprint' : 'Create New Course Program'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold small">Course Code</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="e.g. CRS-FS-MERN"
                      />
                    </div>

                    <div className="col-12 col-md-8">
                      <label className="form-label fw-semibold small">Course Title</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Full-Stack Web Engineering Masterclass"
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold small">Category</label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="Full-Stack Development">Full-Stack Development</option>
                        <option value="Data Science & AI">Data Science & AI</option>
                        <option value="Cloud & DevOps">Cloud & DevOps</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-3">
                      <label className="form-label fw-semibold small">Level</label>
                      <select
                        className="form-select"
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      >
                        <option value="BEGINNER">Beginner</option>
                        <option value="INTERMEDIATE">Intermediate</option>
                        <option value="ADVANCED">Advanced</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-3">
                      <label className="form-label fw-semibold small">Duration (Days)</label>
                      <input
                        type="number"
                        className="form-control"
                        min="1"
                        max="365"
                        value={formData.duration_days}
                        onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) || 30 })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small">Description & Learning Outcomes</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Outline what students will master in this curriculum track..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="statusSwitch"
                          checked={formData.is_active === 1}
                          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                        />
                        <label className="form-check-label fw-semibold small" htmlFor="statusSwitch">
                          Publish immediately (Students and Cohorts can enroll)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Saving...' : editingCourse ? 'Save Changes' : 'Create Course'}
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