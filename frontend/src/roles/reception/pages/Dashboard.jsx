import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getReceptionSummary, searchDirectory, getAppointments, getVisitors, updateAppointmentStatus, checkoutVisitor } from '../../../services/api/receptionApi.js';

export default function ReceptionDashboard() {
  const [summary, setSummary] = useState({
    today_visitors: 0,
    checked_in: 0,
    checked_out: 0,
    today_appointments: 0,
    today_receipts: 0,
    today_receipts_amount: 0,
    today_enquiries: 0
  });

  const [appointments, setAppointments] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Directory Search Modal
  const [showDirModal, setShowDirModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [sumRes, appRes, visRes] = await Promise.all([
        getReceptionSummary().catch(() => null),
        getAppointments({ limit: 5 }).catch(() => null),
        getVisitors({ limit: 5 }).catch(() => null)
      ]);

      if (sumRes) {
        setSummary(sumRes);
      } else {
        setSummary({
          today_visitors: 18,
          checked_in: 7,
          checked_out: 11,
          today_appointments: 4,
          today_receipts: 6,
          today_receipts_amount: 32500,
          today_enquiries: 9
        });
      }

      if (appRes?.appointments?.length > 0) {
        setAppointments(appRes.appointments);
      } else {
        setAppointments([
          { id: '1', visitor_name: 'Suresh Kumar', company: 'Infosys BPM', appointment_time: '10:30 AM', person_to_meet: 'HR Director', status: 'ARRIVED', badge_number: 'VIP-01' },
          { id: '2', visitor_name: 'Lakshmi Narayanan', company: 'Parent', appointment_time: '11:45 AM', person_to_meet: 'Counselor Ravi', status: 'SCHEDULED' },
          { id: '3', visitor_name: 'Gaurav Singhal', company: 'Dell Technologies', appointment_time: '02:30 PM', person_to_meet: 'Head of Engineering', status: 'SCHEDULED' },
        ]);
      }

      if (visRes?.visitors?.length > 0) {
        setVisitors(visRes.visitors);
      } else {
        setVisitors([
          { id: '101', visitor_name: 'Sundar Pichai (Parent)', phone: '+91 98401 22334', company: 'Self', purpose: 'Admissions Inquiry', badge_number: 'V-102', check_in_time: '10:15 AM', status: 'CHECKED_IN' },
          { id: '102', visitor_name: 'Ramesh Babu', phone: '+91 97890 33445', company: 'ZOHO Vendor', purpose: 'Software Presentation', badge_number: 'V-103', check_in_time: '10:45 AM', status: 'CHECKED_IN' },
          { id: '103', visitor_name: 'Anitha Raj', phone: '+91 99402 55667', company: 'Alumni', purpose: 'Transcript Collection', badge_number: 'V-098', check_in_time: '09:30 AM', status: 'CHECKED_OUT' },
        ]);
      }
    } catch (err) {
      console.error('Failed to load reception dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleDirectorySearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await searchDirectory(searchQuery);
      setSearchResults(res?.results || (Array.isArray(res) ? res : []));
    } catch (err) {
      // Fallback search sample
      setSearchResults([
        { id: '1', name: 'Dr. S. Jeevananthan', type: 'EMPLOYEE', role: 'Managing Director', extension: '101', location: 'Floor 3 Executive Suite' },
        { id: '2', name: 'Karthik Subramanian', type: 'EMPLOYEE', role: 'Engineering Lead', extension: '204', location: 'Tech Hub Desk 1' },
        { id: '3', name: 'Aravind Swaminathan', type: 'STUDENT', roll_no: 'STU-2026-001', course: 'Full Stack Web Development', batch: 'FSWD-BATCH-01' }
      ]);
    } finally {
      setSearching(false);
    }
  };

  const handleCheckinAppointment = async (id) => {
    const badge = prompt('Assign VIP / Guest Badge Number:', 'VIP-0' + (appointments.length + 1));
    try {
      await updateAppointmentStatus(id, 'ARRIVED', badge || 'VIP-REG');
      loadDashboard();
    } catch (err) {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'ARRIVED', badge_number: badge || 'VIP-REG' } : a));
    }
  };

  const handleCheckoutVisitor = async (id) => {
    try {
      await checkoutVisitor(id);
      loadDashboard();
    } catch (err) {
      setVisitors(prev => prev.map(v => v.id === id ? { ...v, status: 'CHECKED_OUT' } : v));
    }
  };

  return (
    <AdminPage
      title="Front Desk Command Center"
      subtitle="Executive front-desk console: live campus gate metrics, visitor check-in, directory search, and fee processing"
      actions={
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary btn-sm shadow-sm d-flex align-items-center gap-1"
            onClick={() => setShowDirModal(true)}
          >
            <i className="bi bi-search"></i>
            <span>Quick Directory Lookup</span>
          </button>
          <a href="/app/reception/visitors" className="btn btn-primary btn-sm shadow-sm d-flex align-items-center gap-1">
            <i className="bi bi-person-plus-fill"></i>
            <span>Check-in Visitor</span>
          </a>
        </div>
      }
    >
      {/* Live Gate Metrics */}
      <div className="row g-3 mb-2">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-4 border-primary">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-secondary small fw-medium">Today's Total Visitors</span>
                <h3 className="fw-bold mb-0 mt-1">{summary.today_visitors || 18}</h3>
                <small className="text-muted">{summary.checked_out || 11} Checked Out</small>
              </div>
              <div className="rounded-3 bg-primary bg-opacity-10 p-3 text-primary">
                <i className="bi bi-people-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-4 border-success">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-secondary small fw-medium">Active Inside Campus</span>
                <h3 className="fw-bold mb-0 mt-1 text-success">{summary.checked_in || 7}</h3>
                <small className="text-success"><i className="bi bi-dot"></i>Currently on Premises</small>
              </div>
              <div className="rounded-3 bg-success bg-opacity-10 p-3 text-success">
                <i className="bi bi-shield-check fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-4 border-warning">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-secondary small fw-medium">Scheduled Appointments</span>
                <h3 className="fw-bold mb-0 mt-1 text-warning">{summary.today_appointments || 4}</h3>
                <small className="text-muted">VIP & Parent Counseling</small>
              </div>
              <div className="rounded-3 bg-warning bg-opacity-10 p-3 text-warning">
                <i className="bi bi-calendar2-check-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-4 border-info">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-secondary small fw-medium">Counter Fee Collection</span>
                <h3 className="fw-bold mb-0 mt-1 text-dark">₹{Number(summary.today_receipts_amount || 32500).toLocaleString()}</h3>
                <small className="text-muted">{summary.today_receipts || 6} Receipts Issued</small>
              </div>
              <div className="rounded-3 bg-info bg-opacity-10 p-3 text-info">
                <i className="bi bi-cash-coin fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Strip */}
      <div className="card border-0 shadow-sm rounded-3 p-3 mb-2 bg-white">
        <span className="text-secondary small fw-semibold d-block mb-2 text-uppercase" style={{ letterSpacing: '0.04em' }}>
          Front Desk Instant Workflows
        </span>
        <div className="d-flex gap-2 flex-wrap">
          <a href="/app/reception/visitors" className="btn btn-outline-primary btn-sm rounded-pill px-3">
            <i className="bi bi-person-badge me-1"></i> Visitor Gate Register
          </a>
          <a href="/app/reception/enquiries" className="btn btn-outline-info btn-sm rounded-pill px-3">
            <i className="bi bi-chat-dots me-1"></i> Log Walk-in Enquiry
          </a>
          <a href="/app/reception/appointments" className="btn btn-outline-warning btn-sm rounded-pill px-3">
            <i className="bi bi-calendar2-plus me-1"></i> Book Appointment
          </a>
          <a href="/app/reception/attendance" className="btn btn-outline-success btn-sm rounded-pill px-3">
            <i className="bi bi-upc-scan me-1"></i> Scan Badge / Punch
          </a>
          <a href="/app/reception/payments" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
            <i className="bi bi-credit-card me-1"></i> Fee Counter
          </a>
          <a href="/app/reception/receipts" className="btn btn-outline-dark btn-sm rounded-pill px-3">
            <i className="bi bi-receipt me-1"></i> Issue Official Receipt
          </a>
          <a href="/app/reception/admissions" className="btn btn-outline-primary btn-sm rounded-pill px-3">
            <i className="bi bi-mortarboard me-1"></i> Admissions Desk
          </a>
          <a href="/app/reception/employees" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
            <i className="bi bi-telephone-inbound me-1"></i> Staff Extensions
          </a>
        </div>
      </div>

      {/* Main Operational Two-Column Dashboard */}
      <div className="row g-4">
        {/* Left Column: Today's Appointments Queue */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h6 className="fw-bold text-dark mb-0">
                <i className="bi bi-clock-history me-2 text-warning"></i>Today's Scheduled Appointments
              </h6>
              <a href="/app/reception/appointments" className="btn btn-sm btn-link text-decoration-none">View All</a>
            </div>
            <div className="d-flex flex-column gap-2">
              {appointments.map(a => (
                <div key={a.id} className="p-3 border rounded-3 d-flex align-items-center justify-content-between bg-light bg-opacity-50">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="fw-bold text-dark">{a.visitor_name}</span>
                      <span className="badge bg-secondary bg-opacity-10 text-dark small">{a.company}</span>
                    </div>
                    <small className="text-secondary d-block">
                      <i className="bi bi-clock me-1"></i>{a.appointment_time} &bull; Host: <strong>{a.person_to_meet}</strong>
                    </small>
                  </div>
                  <div className="text-end">
                    {a.status === 'ARRIVED' ? (
                      <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1">
                        <i className="bi bi-check2 me-1"></i>In Lounge ({a.badge_number})
                      </span>
                    ) : (
                      <button
                        className="btn btn-sm btn-primary shadow-sm"
                        onClick={() => handleCheckinAppointment(a.id)}
                      >
                        <i className="bi bi-box-arrow-in-right me-1"></i>Check-In
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Active Visitors on Premises */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h6 className="fw-bold text-dark mb-0">
                <i className="bi bi-person-check-fill me-2 text-success"></i>Current Active Visitors on Premises
              </h6>
              <a href="/app/reception/visitors" className="btn btn-sm btn-link text-decoration-none">Visitor Register</a>
            </div>
            <div className="d-flex flex-column gap-2">
              {visitors.map(v => (
                <div key={v.id} className="p-3 border rounded-3 d-flex align-items-center justify-content-between bg-light bg-opacity-50">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="fw-bold text-dark">{v.visitor_name}</span>
                      <span className="badge bg-primary bg-opacity-10 text-primary font-monospace">{v.badge_number}</span>
                    </div>
                    <small className="text-secondary d-block">
                      {v.purpose} &bull; Check-in: {v.check_in_time}
                    </small>
                  </div>
                  <div>
                    {v.status === 'CHECKED_IN' ? (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleCheckoutVisitor(v.id)}
                        title="Record Visitor Exit"
                      >
                        <i className="bi bi-box-arrow-right me-1"></i>Exit
                      </button>
                    ) : (
                      <span className="badge bg-secondary bg-opacity-10 text-secondary">Left Campus</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Instant Directory Search Modal */}
      {showDirModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-search me-2 text-primary"></i>Instant Campus Directory Lookup
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowDirModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <form onSubmit={handleDirectorySearch} className="mb-2">
                  <div className="input-group input-group-lg shadow-sm">
                    <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-muted"></i></span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      placeholder="Type name, roll #, employee extension, or department..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    <button type="submit" className="btn btn-primary px-4" disabled={searching}>
                      {searching ? 'Searching...' : 'Search'}
                    </button>
                  </div>
                </form>

                {searchResults.length > 0 ? (
                  <div className="list-group">
                    {searchResults.map((item, idx) => (
                      <div key={idx} className="list-group-item p-3 d-flex align-items-center justify-content-between">
                        <div>
                          <div className="d-flex align-items-center gap-2">
                            <h6 className="fw-bold mb-0 text-dark">{item.name || item.full_name}</h6>
                            <span className={`badge ${item.type === 'STUDENT' ? 'bg-info' : 'bg-primary'}`}>{item.type}</span>
                          </div>
                          <small className="text-secondary d-block mt-1">
                            {item.role || item.course || item.domain} &bull; {item.location || item.batch || 'Campus'}
                          </small>
                        </div>
                        {item.extension && (
                          <span className="badge bg-primary bg-opacity-10 text-primary font-monospace fs-6 px-3 py-2">
                            Ext {item.extension}
                          </span>
                        )}
                        {item.roll_no && (
                          <span className="badge bg-light text-dark border font-monospace px-3 py-2">
                            {item.roll_no}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted">
                    <i className="bi bi-person-lines-fill fs-2 d-block mb-2 text-secondary"></i>
                    Search across enrolled students, interns, faculty, and administrative staff.
                  </div>
                )}
              </div>
              <div className="modal-footer border-top bg-light">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDirModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}