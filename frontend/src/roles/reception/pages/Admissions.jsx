import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function ReceptionAdmissions() {
  const [admissions, setAdmissions] = useState([
    { id: '1', admission_no: 'ADM-2026-104', student_name: 'Aravind Swamy', phone: '+91 98401 12233', course: 'Full Stack Web Development', batch: 'BATCH-2026-FS01', admitted_date: '2026-09-08', fees_status: 'PAID', docs_verified: true, id_card_printed: true },
    { id: '2', admission_no: 'ADM-2026-105', student_name: 'Divya Bharathi', phone: '+91 97890 54321', course: 'Data Science & AI', batch: 'BATCH-2026-DS02', admitted_date: '2026-09-09', fees_status: 'PARTIAL', docs_verified: true, id_card_printed: false },
    { id: '3', admission_no: 'ADM-2026-106', student_name: 'Kishore Kumar', phone: '+91 99402 34567', course: 'Cloud & DevOps', batch: 'BATCH-2026-CD01', admitted_date: '2026-09-10', fees_status: 'PENDING', docs_verified: false, id_card_printed: false },
    { id: '4', admission_no: 'ADM-2026-107', student_name: 'Sneha Mohan', phone: '+91 98415 67890', course: 'UI/UX Product Design', batch: 'BATCH-2026-UI01', admitted_date: '2026-09-10', fees_status: 'PAID', docs_verified: true, id_card_printed: true },
  ]);

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [printSlip, setPrintSlip] = useState(null);

  const [newAdmission, setNewAdmission] = useState({
    student_name: '',
    phone: '',
    course: 'Full Stack Web Development',
    batch: 'BATCH-2026-FS02',
    fees_status: 'PAID',
    docs_verified: true
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const admNo = `ADM-2026-${100 + admissions.length + 1}`;
    setAdmissions([
      {
        id: String(Date.now()),
        admission_no: admNo,
        ...newAdmission,
        admitted_date: 'Today',
        id_card_printed: false
      },
      ...admissions
    ]);
    setShowModal(false);
    setNewAdmission({
      student_name: '',
      phone: '',
      course: 'Full Stack Web Development',
      batch: 'BATCH-2026-FS02',
      fees_status: 'PAID',
      docs_verified: true
    });
  };

  const filtered = admissions.filter(a => {
    const q = search.toLowerCase();
    return a.student_name.toLowerCase().includes(q) || a.admission_no.toLowerCase().includes(q) || a.course.toLowerCase().includes(q);
  });

  return (
    <AdminPage
      title="Student & Intern Admissions Desk"
      subtitle="Verify student enrollment credentials, manage batch assignments, and issue welcome kits and ID cards"
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2 shadow-sm" onClick={() => setShowModal(true)}>
          <i className="bi bi-person-check-fill"></i>
          <span>Process Admission</span>
        </button>
      }
    >
      {/* Search Bar */}
      <div className="card border-0 shadow-sm rounded-3 p-3 mb-4 bg-white">
        <div className="input-group">
          <span className="input-group-text bg-light border-0"><i className="bi bi-search text-muted"></i></span>
          <input
            type="text"
            className="form-control bg-light border-0"
            placeholder="Search admission number, student name, or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Admissions Table */}
      <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-3">Admission #</th>
                <th>Student / Intern</th>
                <th>Enrolled Course</th>
                <th>Assigned Batch</th>
                <th>Admitted Date</th>
                <th>Fee Status</th>
                <th>Docs Verified</th>
                <th>ID Badge</th>
                <th className="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td className="ps-3">
                    <span className="font-monospace text-primary fw-bold">{a.admission_no}</span>
                  </td>
                  <td>
                    <div className="fw-semibold text-dark">{a.student_name}</div>
                    <small className="text-muted">{a.phone}</small>
                  </td>
                  <td><span className="badge bg-light text-dark border px-2 py-1">{a.course}</span></td>
                  <td><span className="font-monospace small text-primary">{a.batch}</span></td>
                  <td>{a.admitted_date}</td>
                  <td>
                    <span className={`badge ${a.fees_status === 'PAID' ? 'bg-success bg-opacity-10 text-success' : a.fees_status === 'PARTIAL' ? 'bg-warning bg-opacity-10 text-warning' : 'bg-danger bg-opacity-10 text-danger'}`}>
                      {a.fees_status}
                    </span>
                  </td>
                  <td>
                    {a.docs_verified ? (
                      <span className="text-success small"><i className="bi bi-check-circle-fill me-1"></i>Verified</span>
                    ) : (
                      <span className="text-danger small"><i className="bi bi-clock me-1"></i>Pending</span>
                    )}
                  </td>
                  <td>
                    {a.id_card_printed ? (
                      <span className="badge bg-success bg-opacity-10 text-success"><i className="bi bi-check2 me-1"></i>Printed</span>
                    ) : (
                      <span className="badge bg-secondary bg-opacity-10 text-secondary">Queue</span>
                    )}
                  </td>
                  <td className="text-end pe-3">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setPrintSlip(a)}
                    >
                      <i className="bi bi-printer me-1"></i>Welcome Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Process Admission Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Process New Candidate Admission</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Student Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={newAdmission.student_name}
                        onChange={(e) => setNewAdmission({ ...newAdmission, student_name: e.target.value })}
                        placeholder="e.g. Rohith Sundaram"
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Contact Phone *</label>
                      <input
                        type="tel"
                        className="form-control"
                        required
                        value={newAdmission.phone}
                        onChange={(e) => setNewAdmission({ ...newAdmission, phone: e.target.value })}
                        placeholder="+91 98401 23456"
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Assigned Batch</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newAdmission.batch}
                        onChange={(e) => setNewAdmission({ ...newAdmission, batch: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Enrolled Course</label>
                      <select
                        className="form-select"
                        value={newAdmission.course}
                        onChange={(e) => setNewAdmission({ ...newAdmission, course: e.target.value })}
                      >
                        <option value="Full Stack Web Development">Full Stack Web Development</option>
                        <option value="Data Science & Machine Learning">Data Science & AI</option>
                        <option value="Cloud & DevOps Engineering">Cloud & DevOps Engineering</option>
                        <option value="UI/UX Product Design">UI/UX Product Design</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Tuition Fee Status</label>
                      <select
                        className="form-select"
                        value={newAdmission.fees_status}
                        onChange={(e) => setNewAdmission({ ...newAdmission, fees_status: e.target.value })}
                      >
                        <option value="PAID">Full Payment Cleared</option>
                        <option value="PARTIAL">Partial / Installment 1</option>
                        <option value="PENDING">Payment Pending</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Document Verification</label>
                      <select
                        className="form-select"
                        value={newAdmission.docs_verified ? 'YES' : 'NO'}
                        onChange={(e) => setNewAdmission({ ...newAdmission, docs_verified: e.target.value === 'YES' })}
                      >
                        <option value="YES">Verified & Stamped</option>
                        <option value="NO">Pending Submission</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top bg-light">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">Confirm Admission</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Slip / ID Badge Print Modal */}
      {printSlip && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Admission Welcome Slip</h5>
                <button type="button" className="btn-close" onClick={() => setPrintSlip(null)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="p-3 border rounded-3 bg-white text-center shadow-sm">
                  <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                    <div className="rounded-2 bg-primary p-2 text-white">
                      <i className="bi bi-mortarboard-fill fs-5"></i>
                    </div>
                    <h5 className="fw-bold mb-0 text-dark">ETHIROLI ACADEMY</h5>
                  </div>
                  <div className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 mb-3 px-3 py-1">
                    OFFICIAL ADMISSION CONFIRMATION
                  </div>
                  <div className="text-start border-top pt-3 small">
                    <div className="row g-2 mb-2">
                      <div className="col-6 text-muted">Admission No:</div>
                      <div className="col-6 fw-bold font-monospace text-end">{printSlip.admission_no}</div>
                      <div className="col-6 text-muted">Student Name:</div>
                      <div className="col-6 fw-bold text-end">{printSlip.student_name}</div>
                      <div className="col-6 text-muted">Course:</div>
                      <div className="col-6 fw-bold text-end">{printSlip.course}</div>
                      <div className="col-6 text-muted">Assigned Batch:</div>
                      <div className="col-6 fw-bold text-end">{printSlip.batch}</div>
                      <div className="col-6 text-muted">Admission Date:</div>
                      <div className="col-6 text-end">{printSlip.admitted_date}</div>
                      <div className="col-6 text-muted">Fee Status:</div>
                      <div className="col-6 text-end fw-bold text-success">{printSlip.fees_status}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top bg-light">
                <button className="btn btn-outline-secondary" onClick={() => setPrintSlip(null)}>Close</button>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    alert(`Printing Welcome Slip for ${printSlip.student_name}...`);
                    setPrintSlip(null);
                  }}
                >
                  <i className="bi bi-printer me-1"></i> Print Slip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
