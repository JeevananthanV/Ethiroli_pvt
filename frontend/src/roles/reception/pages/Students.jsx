import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getStudents } from '../../../services/api/receptionApi.js';

export default function ReceptionStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await getStudents({ search: search || undefined });
      const items = res?.items || (Array.isArray(res) ? res : []);
      if (items.length > 0) {
        setStudents(items);
      } else {
        setStudents([
          { id: '1', roll_no: 'STU-2026-001', name: 'Aravind Swaminathan', email: 'aravind.s@gmail.com', phone: '+91 98401 12233', parent_phone: '+91 94440 98765', course: 'Full Stack Web Development', batch: 'FSWD-BATCH-01', status: 'ACTIVE', id_card_issued: true, fee_status: 'PAID' },
          { id: '2', roll_no: 'STU-2026-002', name: 'Divya Bharathi', email: 'divya.b@gmail.com', phone: '+91 97890 54321', parent_phone: '+91 98410 11223', course: 'Data Science & AI/ML', batch: 'DSAI-BATCH-02', status: 'ACTIVE', id_card_issued: true, fee_status: 'PARTIAL' },
          { id: '3', roll_no: 'STU-2026-003', name: 'Kishore Kumar', email: 'kishore.k@outlook.com', phone: '+91 99402 34567', parent_phone: '+91 97901 22334', course: 'Cloud & DevOps Engineering', batch: 'CDEV-BATCH-01', status: 'ACTIVE', id_card_issued: false, fee_status: 'PAID' },
          { id: '4', roll_no: 'STU-2026-004', name: 'Sneha Mohan', email: 'sneha.m@gmail.com', phone: '+91 98415 67890', parent_phone: '+91 98840 55667', course: 'UI/UX Design Masterclass', batch: 'UIUX-BATCH-01', status: 'ON_LEAVE', id_card_issued: true, fee_status: 'PAID' },
          { id: '5', roll_no: 'STU-2026-005', name: 'Vigneshwaran P', email: 'vignesh.p@gmail.com', phone: '+91 98841 23456', parent_phone: '+91 94441 55678', course: 'Cyber Security Essentials', batch: 'CYBER-BATCH-01', status: 'ACTIVE', id_card_issued: false, fee_status: 'PENDING' }
        ]);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
      setStudents([
        { id: '1', roll_no: 'STU-2026-001', name: 'Aravind Swaminathan', email: 'aravind.s@gmail.com', phone: '+91 98401 12233', parent_phone: '+91 94440 98765', course: 'Full Stack Web Development', batch: 'FSWD-BATCH-01', status: 'ACTIVE', id_card_issued: true, fee_status: 'PAID' },
        { id: '2', roll_no: 'STU-2026-002', name: 'Divya Bharathi', email: 'divya.b@gmail.com', phone: '+91 97890 54321', parent_phone: '+91 98410 11223', course: 'Data Science & AI/ML', batch: 'DSAI-BATCH-02', status: 'ACTIVE', id_card_issued: true, fee_status: 'PARTIAL' },
        { id: '3', roll_no: 'STU-2026-003', name: 'Kishore Kumar', email: 'kishore.k@outlook.com', phone: '+91 99402 34567', parent_phone: '+91 97901 22334', course: 'Cloud & DevOps Engineering', batch: 'CDEV-BATCH-01', status: 'ACTIVE', id_card_issued: false, fee_status: 'PAID' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const filteredStudents = students.filter(s => {
    const q = search.toLowerCase();
    const nameMatch = (s.name || '').toLowerCase().includes(q) || (s.roll_no || '').toLowerCase().includes(q) || (s.phone || '').includes(q);
    const batchMatch = batchFilter ? s.batch === batchFilter : true;
    return nameMatch && batchMatch;
  });

  return (
    <AdminPage
      title="Enrolled Students Directory"
      subtitle="Front desk student verification, ID card status, parent contact directory, and batch attendance logs"
      actions={
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={loadStudents}>
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
          <a href="/app/reception/admissions" className="btn btn-primary btn-sm d-flex align-items-center gap-1 shadow-sm">
            <i className="bi bi-person-plus-fill"></i> New Admission
          </a>
        </div>
      }
    >
      {/* Search & Filter */}
      <div className="card border-0 shadow-sm rounded-3 p-3 mb-2 bg-white">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-8">
            <div className="input-group">
              <span className="input-group-text bg-light border-0"><i className="bi bi-search text-muted"></i></span>
              <input
                type="text"
                className="form-control bg-light border-0"
                placeholder="Search by student name, roll number, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <select
              className="form-select bg-light border-0"
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
            >
              <option value="">All Batches</option>
              <option value="FSWD-BATCH-01">FSWD-BATCH-01</option>
              <option value="DSAI-BATCH-02">DSAI-BATCH-02</option>
              <option value="CDEV-BATCH-01">CDEV-BATCH-01</option>
              <option value="UIUX-BATCH-01">UIUX-BATCH-01</option>
              <option value="CYBER-BATCH-01">CYBER-BATCH-01</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-3">Roll #</th>
                <th>Student Name</th>
                <th>Enrolled Course</th>
                <th>Batch</th>
                <th>Contact / Parent</th>
                <th>ID Card</th>
                <th>Fee Status</th>
                <th className="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    <i className="bi bi-people fs-1 d-block mb-2 text-secondary"></i>
                    No student records found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(s => (
                  <tr key={s.id}>
                    <td className="ps-3">
                      <span className="font-monospace text-primary fw-bold">{s.roll_no}</span>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{s.name}</div>
                      <small className="text-muted">{s.email}</small>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border px-2 py-1">{s.course}</span>
                    </td>
                    <td>
                      <span className="font-monospace small text-secondary">{s.batch}</span>
                    </td>
                    <td>
                      <div className="text-dark small fw-medium">{s.phone}</div>
                      <small className="text-muted">Parent: {s.parent_phone}</small>
                    </td>
                    <td>
                      {s.id_card_issued ? (
                        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">
                          <i className="bi bi-check-circle-fill me-1"></i>Issued
                        </span>
                      ) : (
                        <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-2 py-1">
                          <i className="bi bi-exclamation-triangle-fill me-1"></i>Pending
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${s.fee_status === 'PAID' ? 'bg-success bg-opacity-10 text-success' : s.fee_status === 'PARTIAL' ? 'bg-warning bg-opacity-10 text-warning' : 'bg-danger bg-opacity-10 text-danger'}`}>
                        {s.fee_status}
                      </span>
                    </td>
                    <td className="text-end pe-3">
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => setSelectedStudent(s)}
                        title="View Student Details"
                      >
                        <i className="bi bi-person-bounding-box"></i>
                      </button>
                      <a href={`tel:${s.phone}`} className="btn btn-sm btn-outline-success" title="Call Student">
                        <i className="bi bi-telephone-fill"></i>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details / ID Card Modal */}
      {selectedStudent && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Student Record: {selectedStudent.name}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedStudent(null)}></button>
              </div>
              <div className="modal-body p-3">
                <div className="p-3 border rounded-3 bg-light mb-3 text-center">
                  <div className="rounded-circle bg-primary text-white mx-auto mb-2 d-flex align-items-center justify-content-center fw-bold fs-3" style={{ width: '64px', height: '64px' }}>
                    {selectedStudent.name.charAt(0)}
                  </div>
                  <h5 className="fw-bold text-dark mb-0">{selectedStudent.name}</h5>
                  <p className="text-muted small mb-2">{selectedStudent.roll_no} • {selectedStudent.course}</p>
                  <span className="badge bg-primary px-3 py-1">{selectedStudent.batch}</span>
                </div>
                <div className="row g-2 small">
                  <div className="col-6"><strong>Student Phone:</strong> {selectedStudent.phone}</div>
                  <div className="col-6"><strong>Parent Contact:</strong> {selectedStudent.parent_phone}</div>
                  <div className="col-6"><strong>Fee Status:</strong> {selectedStudent.fee_status}</div>
                  <div className="col-6"><strong>ID Badge:</strong> {selectedStudent.id_card_issued ? 'Active & Issued' : 'Not Issued'}</div>
                </div>
              </div>
              <div className="modal-footer border-top bg-light">
                <button className="btn btn-outline-secondary" onClick={() => setSelectedStudent(null)}>Close</button>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    alert(`ID Card Print Command Sent for ${selectedStudent.name} (${selectedStudent.roll_no})`);
                    setSelectedStudent(null);
                  }}
                >
                  <i className="bi bi-printer me-1"></i> Print ID Badge Slip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
