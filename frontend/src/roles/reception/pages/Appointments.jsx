import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getAppointments, createAppointment, updateAppointmentStatus } from '../../../services/api/receptionApi.js';

export default function ReceptionAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    visitor_name: '',
    phone: '',
    company: '',
    purpose: 'Campus Recruitment & Placement Discussion',
    person_to_meet: 'HR Director',
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: '11:00 AM',
    notes: ''
  });

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res = await getAppointments({ status: statusFilter || undefined, search: search || undefined });
      const items = res?.appointments || (Array.isArray(res) ? res : []);
      if (items.length > 0) {
        setAppointments(items);
      } else {
        setAppointments([
          { id: '1', visitor_name: 'Suresh Kumar', phone: '+91 98401 12233', company: 'Infosys BPM', purpose: 'Campus Recruitment & Placement Discussion', person_to_meet: 'HR Director', appointment_date: '2026-09-10', appointment_time: '10:30 AM', status: 'ARRIVED', badge_number: 'VIP-01' },
          { id: '2', visitor_name: 'Lakshmi Narayanan', phone: '+91 97890 54321', company: 'Parent of Student', purpose: 'Academic Performance & Counseling', person_to_meet: 'Principal / MD', appointment_date: '2026-09-10', appointment_time: '11:45 AM', status: 'SCHEDULED' },
          { id: '3', visitor_name: 'Gaurav Singhal', phone: '+91 99403 45678', company: 'Dell Technologies', purpose: 'Corporate Cloud Lab Sponsorship', person_to_meet: 'Head of Engineering', appointment_date: '2026-09-10', appointment_time: '02:30 PM', status: 'SCHEDULED' },
          { id: '4', visitor_name: 'Renu Sharma', phone: '+91 98412 88990', company: 'TCS Talent Acquisition', purpose: 'Hackathon Mentorship Meeting', person_to_meet: 'Managing Director', appointment_date: '2026-09-09', appointment_time: '04:00 PM', status: 'COMPLETED', badge_number: 'VIP-04' },
        ]);
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
      setAppointments([
        { id: '1', visitor_name: 'Suresh Kumar', phone: '+91 98401 12233', company: 'Infosys BPM', purpose: 'Campus Recruitment & Placement Discussion', person_to_meet: 'HR Director', appointment_date: '2026-09-10', appointment_time: '10:30 AM', status: 'ARRIVED', badge_number: 'VIP-01' },
        { id: '2', visitor_name: 'Lakshmi Narayanan', phone: '+91 97890 54321', company: 'Parent of Student', purpose: 'Academic Performance & Counseling', person_to_meet: 'Principal / MD', appointment_date: '2026-09-10', appointment_time: '11:45 AM', status: 'SCHEDULED' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [statusFilter]);

  const handleStatusChange = async (id, newStatus, badge) => {
    try {
      await updateAppointmentStatus(id, newStatus, badge);
      loadAppointments();
    } catch (err) {
      // Local state fallback
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus, badge_number: badge || a.badge_number } : a));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createAppointment(formData);
      setShowModal(false);
      setFormData({
        visitor_name: '',
        phone: '',
        company: '',
        purpose: 'Campus Recruitment & Placement Discussion',
        person_to_meet: 'HR Director',
        appointment_date: new Date().toISOString().split('T')[0],
        appointment_time: '11:00 AM',
        notes: ''
      });
      loadAppointments();
    } catch (err) {
      setAppointments(prev => [
        { id: String(Date.now()), ...formData, status: 'SCHEDULED' },
        ...prev
      ]);
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ARRIVED':
        return <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1"><i className="bi bi-geo-fill me-1"></i>Arrived / Waiting</span>;
      case 'COMPLETED':
        return <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1"><i className="bi bi-check-circle-fill me-1"></i>Completed</span>;
      case 'CANCELLED':
        return <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1"><i className="bi bi-x-circle-fill me-1"></i>Cancelled</span>;
      case 'SCHEDULED':
      default:
        return <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-2 py-1"><i className="bi bi-calendar-event me-1"></i>Scheduled</span>;
    }
  };

  const filtered = appointments.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = (a.visitor_name || '').toLowerCase().includes(q) || (a.company || '').toLowerCase().includes(q) || (a.person_to_meet || '').toLowerCase().includes(q);
    const matchStatus = statusFilter ? a.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  return (
    <AdminPage
      title="Front Desk Appointments & VIP Bookings"
      subtitle="Manage pre-scheduled corporate visitors, parent counseling appointments, host notifications, and VIP gate passes"
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2 shadow-sm" onClick={() => setShowModal(true)}>
          <i className="bi bi-calendar-plus-fill"></i>
          <span>Schedule Appointment</span>
        </button>
      }
    >
      {/* Metric Cards */}
      <div className="row g-3 mb-2">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Total Bookings</span>
            <h3 className="fw-bold mb-0 mt-1">{appointments.length}</h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Arrived at Reception</span>
            <h3 className="fw-bold mb-0 mt-1 text-primary">
              {appointments.filter(a => a.status === 'ARRIVED').length}
            </h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Upcoming Today</span>
            <h3 className="fw-bold mb-0 mt-1 text-warning">
              {appointments.filter(a => a.status === 'SCHEDULED').length}
            </h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Concluded Meetings</span>
            <h3 className="fw-bold mb-0 mt-1 text-success">
              {appointments.filter(a => a.status === 'COMPLETED').length}
            </h3>
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
                placeholder="Search visitor name, company, or host..."
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
              <option value="SCHEDULED">Scheduled</option>
              <option value="ARRIVED">Arrived / In Lounge</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-3">Visitor / Guest</th>
                <th>Company / Affiliation</th>
                <th>Appointment Time</th>
                <th>Host Person</th>
                <th>Meeting Purpose</th>
                <th>Status</th>
                <th>Badge #</th>
                <th className="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td className="ps-3">
                    <div className="fw-semibold text-dark">{a.visitor_name}</div>
                    <small className="text-muted">{a.phone}</small>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border">{a.company || 'Individual'}</span>
                  </td>
                  <td>
                    <div className="fw-medium text-dark">{a.appointment_time}</div>
                    <small className="text-muted">{a.appointment_date}</small>
                  </td>
                  <td>
                    <div className="small fw-semibold text-primary">{a.person_to_meet}</div>
                  </td>
                  <td>
                    <small className="text-secondary">{a.purpose}</small>
                  </td>
                  <td>{getStatusBadge(a.status)}</td>
                  <td>
                    <span className="font-monospace small text-dark fw-bold">{a.badge_number || '--'}</span>
                  </td>
                  <td className="text-end pe-3">
                    {a.status === 'SCHEDULED' && (
                      <button
                        className="btn btn-sm btn-primary me-1"
                        onClick={() => {
                          const badge = prompt('Assign VIP Badge Number:', 'VIP-0' + (appointments.length + 1));
                          handleStatusChange(a.id, 'ARRIVED', badge || 'VIP-REG');
                        }}
                      >
                        <i className="bi bi-box-arrow-in-right me-1"></i>Check-In
                      </button>
                    )}
                    {a.status === 'ARRIVED' && (
                      <button
                        className="btn btn-sm btn-success me-1"
                        onClick={() => handleStatusChange(a.id, 'COMPLETED')}
                      >
                        <i className="bi bi-check2 me-1"></i>Finish
                      </button>
                    )}
                    <a href={`tel:${a.phone}`} className="btn btn-sm btn-light border" title="Call Guest">
                      <i className="bi bi-telephone"></i>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Schedule Guest / VIP Appointment</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Visitor Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.visitor_name}
                        onChange={(e) => setFormData({ ...formData, visitor_name: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Phone *</label>
                      <input
                        type="tel"
                        className="form-control"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98401 23456"
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Company / Org</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Cognizant / Self"
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        value={formData.appointment_date}
                        onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Time *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.appointment_time}
                        onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                        placeholder="e.g. 11:30 AM"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Host / Person to Meet *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.person_to_meet}
                        onChange={(e) => setFormData({ ...formData, person_to_meet: e.target.value })}
                        placeholder="e.g. Managing Director / HR Lead"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Purpose of Visit</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={formData.purpose}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top bg-light">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4" disabled={saving}>
                    {saving ? 'Scheduling...' : 'Confirm Appointment'}
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
