import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function AdminTutors() {
  const [tutors, setTutors] = useState([
    { id: '1', name: 'Dr. R. Ramanathan', email: 'ramanathan@ethiroli.edu', phone: '+91 98401 22334', domain: 'Data Science & Machine Learning', active_batches: 2, total_students: 48, rating: 4.9, status: 'ACTIVE' },
    { id: '2', name: 'S. Karthikeyan', email: 'karthik.s@ethiroli.edu', phone: '+91 97890 33445', domain: 'Full Stack Web Development', active_batches: 3, total_students: 72, rating: 4.8, status: 'ACTIVE' },
    { id: '3', name: 'Priya Sundararajan', email: 'priya.s@ethiroli.edu', phone: '+91 99402 44556', domain: 'UI/UX Product Design', active_batches: 1, total_students: 24, rating: 4.9, status: 'ACTIVE' },
    { id: '4', name: 'M. Vignesh Kumar', email: 'vignesh.k@ethiroli.edu', phone: '+91 98415 55667', domain: 'Cloud Architecture & DevOps', active_batches: 2, total_students: 40, rating: 4.7, status: 'ON_LEAVE' }
  ]);

  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [newTutor, setNewTutor] = useState({
    name: '',
    email: '',
    phone: '',
    domain: 'Full Stack Web Development',
    status: 'ACTIVE'
  });

  const handleCreate = (e) => {
    e.preventDefault();
    setTutors([
      {
        id: String(Date.now()),
        ...newTutor,
        active_batches: 1,
        total_students: 0,
        rating: 5.0
      },
      ...tutors
    ]);
    setShowModal(false);
    setNewTutor({ name: '', email: '', phone: '', domain: 'Full Stack Web Development', status: 'ACTIVE' });
  };

  const filtered = tutors.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q) || t.domain.toLowerCase().includes(q);
    const matchDomain = domainFilter ? t.domain === domainFilter : true;
    return matchSearch && matchDomain;
  });

  return (
    <AdminPage
      title="Faculty & Tutors Management"
      subtitle="Organization-wide faculty directory, domain tracks, active batch assignments, and performance ratings"
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2 shadow-sm" onClick={() => setShowModal(true)}>
          <i className="bi bi-person-plus-fill"></i>
          <span>Add New Tutor</span>
        </button>
      }
    >
      {/* Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Total Instructors</span>
            <h3 className="fw-bold mb-0 mt-1">{tutors.length}</h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Active Teaching Batches</span>
            <h3 className="fw-bold mb-0 mt-1 text-primary">
              {tutors.reduce((sum, t) => sum + t.active_batches, 0)}
            </h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Total Learners Mentored</span>
            <h3 className="fw-bold mb-0 mt-1 text-success">
              {tutors.reduce((sum, t) => sum + t.total_students, 0)}
            </h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Average Student Rating</span>
            <h3 className="fw-bold mb-0 mt-1 text-warning">
              <i className="bi bi-star-fill text-warning me-1"></i>4.8 / 5.0
            </h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card border-0 shadow-sm rounded-3 p-3 mb-4 bg-white">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-8">
            <div className="input-group">
              <span className="input-group-text bg-light border-0"><i className="bi bi-search text-muted"></i></span>
              <input
                type="text"
                className="form-control bg-light border-0"
                placeholder="Search tutor name, email, or domain..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <select
              className="form-select bg-light border-0"
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
            >
              <option value="">All Domains</option>
              <option value="Full Stack Web Development">Full Stack Web Development</option>
              <option value="Data Science & Machine Learning">Data Science & AI</option>
              <option value="UI/UX Product Design">UI/UX Product Design</option>
              <option value="Cloud Architecture & DevOps">Cloud & DevOps</option>
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
                <th>Domain Track</th>
                <th>Active Batches</th>
                <th>Total Students</th>
                <th>Rating</th>
                <th>Status</th>
                <th className="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td className="ps-3">
                    <div className="fw-semibold text-dark">{t.name}</div>
                    <small className="text-muted">{t.email} &bull; {t.phone}</small>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border px-2 py-1">{t.domain}</span>
                  </td>
                  <td>
                    <span className="badge bg-primary bg-opacity-10 text-primary font-monospace">{t.active_batches} Batches</span>
                  </td>
                  <td>
                    <span className="fw-medium text-dark">{t.total_students} Enrolled</span>
                  </td>
                  <td>
                    <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-2 py-1">
                      <i className="bi bi-star-fill me-1"></i>{t.rating}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${t.status === 'ACTIVE' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="text-end pe-3">
                    <button className="btn btn-sm btn-outline-primary me-1" title="Assign Batches">
                      <i className="bi bi-journal-plus me-1"></i>Batches
                    </button>
                    <a href={`mailto:${t.email}`} className="btn btn-sm btn-light border" title="Email Tutor">
                      <i className="bi bi-envelope"></i>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Add Faculty Member</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Faculty Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={newTutor.name}
                        onChange={(e) => setNewTutor({ ...newTutor, name: e.target.value })}
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
                      <label className="form-label small fw-semibold">Domain Track</label>
                      <select
                        className="form-select"
                        value={newTutor.domain}
                        onChange={(e) => setNewTutor({ ...newTutor, domain: e.target.value })}
                      >
                        <option value="Full Stack Web Development">Full Stack Web Development</option>
                        <option value="Data Science & Machine Learning">Data Science & AI</option>
                        <option value="Cloud Architecture & DevOps">Cloud & DevOps</option>
                        <option value="UI/UX Product Design">UI/UX Product Design</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top bg-light">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">Register Faculty</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
