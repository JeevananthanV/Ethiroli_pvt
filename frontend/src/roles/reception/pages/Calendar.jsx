import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function ReceptionCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('AGENDA');
  const [showModal, setShowModal] = useState(false);

  const [events, setEvents] = useState([
    { id: '1', title: 'Infosys Campus Placement Drive', type: 'DRIVE', time: '10:00 AM - 01:00 PM', location: 'Seminar Hall A', host: 'Placement Cell', status: 'CONFIRMED' },
    { id: '2', title: 'Parent Counseling: Mr. Narayanan', type: 'COUNSELING', time: '11:30 AM - 12:15 PM', location: 'Counseling Room 2', host: 'Ravi Kumar (Chief Counselor)', status: 'CONFIRMED' },
    { id: '3', title: 'Executive Board Review Meeting', type: 'INTERNAL', time: '02:00 PM - 03:30 PM', location: 'Board Room - Floor 3', host: 'Dr. Jeevananthan', status: 'IN_PROGRESS' },
    { id: '4', title: 'Free Weekend Full Stack Demo Session', type: 'DEMO', time: '04:00 PM - 05:30 PM', location: 'Lab 1 Interactive Suite', host: 'Karthik S', status: 'CONFIRMED' },
    { id: '5', title: 'Vendor Discussion: Cloud Server Hardware', type: 'MEETING', time: '05:30 PM - 06:15 PM', location: 'Meeting Pod B', host: 'Procurement Head', status: 'SCHEDULED' }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'MEETING',
    time: '11:00 AM - 12:00 PM',
    location: 'Conference Hall A',
    host: 'Front Desk'
  });

  const handleAddEvent = (e) => {
    e.preventDefault();
    setEvents([...events, { id: String(Date.now()), ...newEvent, status: 'CONFIRMED' }]);
    setShowModal(false);
    setNewEvent({ title: '', type: 'MEETING', time: '11:00 AM - 12:00 PM', location: 'Conference Hall A', host: 'Front Desk' });
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case 'DRIVE': return 'bg-danger bg-opacity-10 text-danger border-danger';
      case 'COUNSELING': return 'bg-warning bg-opacity-10 text-warning border-warning';
      case 'DEMO': return 'bg-success bg-opacity-10 text-success border-success';
      case 'INTERNAL': return 'bg-primary bg-opacity-10 text-primary border-primary';
      default: return 'bg-info bg-opacity-10 text-info border-info';
    }
  };

  return (
    <AdminPage
      title="Front Desk Master Operations Calendar"
      subtitle="Conference hall bookings, placement drive schedules, counseling slots, and campus meeting room manager"
      actions={
        <div className="d-flex gap-2 align-items-center">
          <input
            type="date"
            className="form-control form-control-sm bg-white border shadow-sm"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button className="btn btn-primary btn-sm d-flex align-items-center gap-1 shadow-sm" onClick={() => setShowModal(true)}>
            <i className="bi bi-calendar-plus-fill"></i>
            <span>Book Room / Slot</span>
          </button>
        </div>
      }
    >
      {/* Calendar Quick Stats */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Today's Scheduled Events</span>
            <h3 className="fw-bold mb-0 mt-1">{events.length}</h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Conference Halls Booked</span>
            <h3 className="fw-bold mb-0 mt-1 text-primary">3 of 4</h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Placement / Drives</span>
            <h3 className="fw-bold mb-0 mt-1 text-danger">1 Active</h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Demo & Counseling Sessions</span>
            <h3 className="fw-bold mb-0 mt-1 text-success">2 Slots</h3>
          </div>
        </div>
      </div>

      {/* View Switcher */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold text-dark mb-0">
          <i className="bi bi-calendar3 me-2 text-primary"></i>Daily Schedule for {selectedDate}
        </h6>
        <div className="btn-group shadow-sm">
          <button className={`btn btn-sm ${viewMode === 'AGENDA' ? 'btn-primary' : 'btn-light'}`} onClick={() => setViewMode('AGENDA')}>Agenda</button>
          <button className={`btn btn-sm ${viewMode === 'ROOMS' ? 'btn-primary' : 'btn-light'}`} onClick={() => setViewMode('ROOMS')}>Rooms Status</button>
        </div>
      </div>

      {/* Events Agenda View */}
      {viewMode === 'AGENDA' ? (
        <div className="card border-0 shadow-sm rounded-3 bg-white p-3">
          <div className="d-flex flex-column gap-3">
            {events.map(ev => (
              <div key={ev.id} className="p-3 border rounded-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 hover-shadow transition">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-3 bg-light border p-3 text-center" style={{ minWidth: '95px' }}>
                    <i className="bi bi-clock text-primary fs-5 d-block mb-1"></i>
                    <small className="fw-bold text-dark">{ev.time.split('-')[0]}</small>
                  </div>
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className={`badge border px-2 py-1 ${getBadgeColor(ev.type)}`}>{ev.type}</span>
                      <span className="badge bg-secondary bg-opacity-10 text-secondary">{ev.status}</span>
                    </div>
                    <h6 className="fw-bold text-dark mb-1">{ev.title}</h6>
                    <div className="text-secondary small">
                      <i className="bi bi-geo-alt-fill text-danger me-1"></i>{ev.location} &bull; <i className="bi bi-person-fill ms-2 me-1"></i>Host: {ev.host}
                    </div>
                  </div>
                </div>
                <div className="text-md-end">
                  <span className="badge bg-light text-dark border px-3 py-2 font-monospace">{ev.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Room status grid */
        <div className="row g-3">
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-4 border-danger">
              <h6 className="fw-bold">Seminar Hall A</h6>
              <p className="small text-muted mb-2">Capacity: 120 pax • AV Equipment</p>
              <span className="badge bg-danger bg-opacity-10 text-danger mb-2">OCCUPIED until 1:00 PM</span>
              <p className="small mb-0 text-secondary">Infosys Campus Drive</p>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-4 border-warning">
              <h6 className="fw-bold">Counseling Suite 2</h6>
              <p className="small text-muted mb-2">Capacity: 6 pax • One-on-one</p>
              <span className="badge bg-warning bg-opacity-10 text-warning mb-2">BOOKED 11:30 AM</span>
              <p className="small mb-0 text-secondary">Parent Consultation</p>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-4 border-success">
              <h6 className="fw-bold">Conference Hall B</h6>
              <p className="small text-muted mb-2">Capacity: 40 pax • Smart Board</p>
              <span className="badge bg-success bg-opacity-10 text-success mb-2">AVAILABLE</span>
              <p className="small mb-0 text-secondary">Open for immediate booking</p>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-4 border-primary">
              <h6 className="fw-bold">Executive Board Room</h6>
              <p className="small text-muted mb-2">Capacity: 16 pax • Video Conference</p>
              <span className="badge bg-primary bg-opacity-10 text-primary mb-2">BOOKED 2:00 PM</span>
              <p className="small mb-0 text-secondary">Board Review Meeting</p>
            </div>
          </div>
        </div>
      )}

      {/* Book Room Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Reserve Facility / Room Slot</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleAddEvent}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Event / Meeting Purpose *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        placeholder="e.g. Guest Lecture on Cloud Architecture"
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Select Room *</label>
                      <select
                        className="form-select"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      >
                        <option value="Conference Hall A">Conference Hall A</option>
                        <option value="Conference Hall B">Conference Hall B</option>
                        <option value="Executive Board Room">Executive Board Room</option>
                        <option value="Counseling Room 1">Counseling Room 1</option>
                        <option value="Counseling Room 2">Counseling Room 2</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Event Type</label>
                      <select
                        className="form-select"
                        value={newEvent.type}
                        onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                      >
                        <option value="MEETING">General Meeting</option>
                        <option value="COUNSELING">Student Counseling</option>
                        <option value="DRIVE">Placement Drive</option>
                        <option value="DEMO">Demo Class</option>
                        <option value="INTERNAL">Internal Staff</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Time Slot</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                        placeholder="e.g. 02:00 PM - 03:00 PM"
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Host / Booking Person</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newEvent.host}
                        onChange={(e) => setNewEvent({ ...newEvent, host: e.target.value })}
                        placeholder="e.g. HR Team / Front Desk"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top bg-light">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">Confirm Reservation</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
