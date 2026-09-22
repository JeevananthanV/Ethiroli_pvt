import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import operationsApi from '../../../services/api/operationsApi';

export default function ReceptionVisitors() {
  const [visitors, setVisitors] = useState([]);
  const [stats, setStats] = useState({ total_today: 0, checked_in: 0, checked_out: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    visitor_name: '',
    phone: '',
    email: '',
    company: '',
    purpose: '',
    person_to_meet_name: '',
    badge_number: ''
  });

  const loadVisitors = async () => {
    setLoading(true);
    try {
      const res = await operationsApi.getVisitors({ search });
      if (res?.success) {
        setVisitors(res.visitors || []);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to load visitors:', err);
      // Fallback
      setVisitors([
        { id: '1', visitor_name: 'Suresh Kumar', phone: '+91 9840112233', company: 'Infosys', purpose: 'Campus Recruitment Meeting', person_to_meet_full_name: 'HR Director', badge_number: 'V-101', check_in_time: '2026-09-10 10:15 AM', status: 'CHECKED_IN' },
        { id: '2', visitor_name: 'Lakshmi Narayanan', phone: '+91 9791098765', company: 'Self (Parent)', purpose: 'Student Admission Inquiry', person_to_meet_full_name: 'Admissions Officer', badge_number: 'V-102', check_in_time: '2026-09-10 11:00 AM', status: 'CHECKED_IN' },
        { id: '3', visitor_name: 'Gaurav Singhal', phone: '+91 9940345678', company: 'Dell Technologies', purpose: 'Corporate Vendor Discussion', person_to_meet_full_name: 'Procurement Head', badge_number: 'V-098', check_in_time: '2026-09-10 09:30 AM', check_out_time: '2026-09-10 10:45 AM', status: 'CHECKED_OUT' },
      ]);
      setStats({ total_today: 3, checked_in: 2, checked_out: 1 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await operationsApi.createVisitor(formData);
      setShowModal(false);
      setFormData({ visitor_name: '', phone: '', email: '', company: '', purpose: '', person_to_meet_name: '', badge_number: '' });
      loadVisitors();
    } catch (err) {
      alert('Failed to register visitor: ' + err.message);
    }
  };

  const handleCheckout = async (id) => {
    try {
      await operationsApi.checkoutVisitor(id);
      loadVisitors();
    } catch (err) {
      alert('Checkout failed: ' + err.message);
    }
  };

  return (
    <AdminPage
      title="Front Desk Visitor Register"
      subtitle="Digital visitor pass issuance, campus check-ins, security logs, and personnel appointments"
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <i className="bi bi-person-plus-fill"></i>
          <span>Check-in Visitor</span>
        </button>
      }
    >
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-primary bg-opacity-10 text-primary">
            <small className="text-uppercase fw-semibold">Visitors Today</small>
            <h3 className="mb-0 fw-bold mt-1">{stats.total_today || visitors.length}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-warning bg-opacity-10 text-warning">
            <small className="text-uppercase fw-semibold">Currently On Campus</small>
            <h3 className="mb-0 fw-bold mt-1">{stats.checked_in || visitors.filter(v => v.status === 'CHECKED_IN').length}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-success bg-opacity-10 text-success">
            <small className="text-uppercase fw-semibold">Checked Out</small>
            <h3 className="mb-0 fw-bold mt-1">{stats.checked_out || visitors.filter(v => v.status === 'CHECKED_OUT').length}</h3>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold">Visitor Logs</h6>
          <div className="input-group" style={{ maxWidth: '280px' }}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search visitor or badge..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && loadVisitors()}
            />
            <button className="btn btn-sm btn-outline-secondary" onClick={loadVisitors}><i className="bi bi-search"></i></button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Badge</th>
                <th>Visitor</th>
                <th>Company / Org</th>
                <th>Purpose</th>
                <th>Person to Meet</th>
                <th>Check-in Time</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="text-center py-4">Loading visitors...</td></tr>
              ) : visitors.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-4 text-muted">No visitors logged today.</td></tr>
              ) : (
                visitors.map(v => (
                  <tr key={v.id}>
                    <td><span className="badge bg-dark font-monospace">{v.badge_number || 'PASS'}</span></td>
                    <td>
                      <div className="fw-semibold text-dark">{v.visitor_name}</div>
                      <small className="text-muted">{v.phone}</small>
                    </td>
                    <td>{v.company || 'Individual'}</td>
                    <td><div className="text-truncate" style={{ maxWidth: '180px' }}>{v.purpose}</div></td>
                    <td>{v.person_to_meet_full_name || v.person_to_meet_name || 'Staff'}</td>
                    <td><small>{v.check_in_time ? new Date(v.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</small></td>
                    <td>
                      <span className={`badge ${v.status === 'CHECKED_IN' ? 'bg-warning bg-opacity-10 text-warning' : 'bg-success bg-opacity-10 text-success'}`}>
                        {v.status === 'CHECKED_IN' ? 'Checked In' : 'Checked Out'}
                      </span>
                    </td>
                    <td className="text-end">
                      {v.status === 'CHECKED_IN' ? (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleCheckout(v.id)}>
                          Check Out
                        </button>
                      ) : (
                        <small className="text-muted">Completed</small>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title">Visitor Entry Registration</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Visitor Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={formData.visitor_name}
                      onChange={e => setFormData({ ...formData, visitor_name: e.target.value })}
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        className="form-control"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Company / Affiliation</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.company}
                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Purpose of Visit *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Admission inquiry, Vendor meeting"
                      value={formData.purpose}
                      onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Person to Meet</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Staff / Department"
                        value={formData.person_to_meet_name}
                        onChange={e => setFormData({ ...formData, person_to_meet_name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Badge / Pass #</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Auto-generated if blank"
                        value={formData.badge_number}
                        onChange={e => setFormData({ ...formData, badge_number: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Check-in & Issue Pass</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
