import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function Calendar() {
  const [activeView, setActiveView] = useState('agenda'); // 'agenda' | 'month'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterCategory, setFilterCategory] = useState('ALL');

  const events = [
    {
      id: 'ev-1',
      title: 'React Hooks & State Management Deep Dive',
      category: 'TRAINING',
      date: 'Today, Sep 18, 2026',
      time: '10:00 AM – 11:30 AM',
      color: 'success',
      icon: 'bi-mortarboard',
      meetLink: 'https://meet.google.com/trn-hook-dive',
      description: 'Interactive lecture on useEffect dependency graphs, cleanup handlers, and Redux Toolkit slices.',
      agenda: '1. useEffect nuances\n2. useMemo vs useCallback\n3. Redux Toolkit slices & selectors',
      resources: 'Slides: react-hooks-v19.pdf'
    },
    {
      id: 'ev-2',
      title: 'Mentor 1-on-1 Doubt Clearing with Arun Kumar',
      category: 'MENTOR',
      date: 'Today, Sep 18, 2026',
      time: '04:00 PM – 04:30 PM',
      color: 'primary',
      icon: 'bi-person-video',
      meetLink: 'https://meet.google.com/abc-defg-hij',
      description: 'Private 1-on-1 session to review concurrent JWT refresh implementation and Monorepo structure.',
      agenda: '1. Review PR #39\n2. Solve Axios interceptor race conditions\n3. Task allocation for sprint 2',
      resources: 'Branch: feature/jwt-auth'
    },
    {
      id: 'ev-3',
      title: 'Assignment 3: PostgreSQL Schema & Indexing Due',
      category: 'DEADLINE',
      date: 'Tomorrow, Sep 19, 2026',
      time: '11:59 PM',
      color: 'danger',
      icon: 'bi-clock-history',
      meetLink: '',
      description: 'Final submission deadline for relational database migrations and foreign key constraints.',
      agenda: 'Submit GitHub repo URL and SQL seed files before midnight.',
      resources: 'Assignment 3 Rubric'
    },
    {
      id: 'ev-4',
      title: 'Sprint 2 Project Deliverables Demo & Review',
      category: 'PROJECT',
      date: 'Friday, Sep 25, 2026',
      time: '03:00 PM – 04:00 PM',
      color: 'purple',
      icon: 'bi-kanban',
      meetLink: 'https://meet.google.com/spr-review-meet',
      description: 'Live sprint demo showcasing responsive offcanvas navigation and admin dashboard to project leads.',
      agenda: '1. 10m demo per intern\n2. Mentor Q&A\n3. Backlog refinement for Sprint 3',
      resources: 'Staging URL: https://staging.ethiroli.net'
    },
    {
      id: 'ev-5',
      title: 'Mid-Term 360° Evaluation & Grade Review',
      category: 'EVALUATION',
      date: 'Monday, Sep 28, 2026',
      time: '02:00 PM – 03:00 PM',
      color: 'warning',
      icon: 'bi-award',
      meetLink: 'https://meet.google.com/eval-intern-360',
      description: 'Formal mid-term evaluation review with Director and HR coordinator.',
      agenda: 'Attendance audit, task velocity review, and certificate eligibility milestone check.',
      resources: 'Evaluation Rubric PDF'
    },
    {
      id: 'ev-6',
      title: 'Gandhi Jayanti (Company Holiday)',
      category: 'HOLIDAY',
      date: 'Friday, Oct 02, 2026',
      time: 'All Day',
      color: 'secondary',
      icon: 'bi-flag',
      meetLink: '',
      description: 'National holiday. Office and online portals operate on holiday schedule.',
      agenda: 'Enjoy your day off!',
      resources: ''
    }
  ];

  const filteredEvents = filterCategory === 'ALL'
    ? events
    : events.filter((e) => e.category === filterCategory);

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'TRAINING':
        return <span className="badge bg-success-subtle text-success border border-success-subtle">Training</span>;
      case 'MENTOR':
        return <span className="badge bg-primary-subtle text-primary border border-primary-subtle">Mentor Session</span>;
      case 'DEADLINE':
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle">Deadline</span>;
      case 'PROJECT':
        return <span className="badge bg-purple-subtle text-dark border border-purple-subtle" style={{ backgroundColor: '#f3e8ff' }}>Project Review</span>;
      case 'EVALUATION':
        return <span className="badge bg-warning-subtle text-warning border border-warning-subtle">Evaluation</span>;
      default:
        return <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle">Holiday</span>;
    }
  };

  return (
    <AdminPage
      title="Internship Calendar & Event Schedule"
      subtitle="Track training sessions, mentor 1-on-1s, assignment deadlines, sprint reviews, and company holidays"
    >
      <div className="container-fluid px-0">
        {/* Category Filter Pills & View Switch */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div className="d-flex gap-2 flex-wrap">
            <button
              type="button"
              className={`btn btn-sm ${filterCategory === 'ALL' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setFilterCategory('ALL')}
            >
              All Events ({events.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filterCategory === 'TRAINING' ? 'btn-success text-white' : 'btn-outline-success'}`}
              onClick={() => setFilterCategory('TRAINING')}
            >
              🟢 Training
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filterCategory === 'MENTOR' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilterCategory('MENTOR')}
            >
              🔵 Mentor 1-on-1
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filterCategory === 'DEADLINE' ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => setFilterCategory('DEADLINE')}
            >
              🔴 Deadlines
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filterCategory === 'PROJECT' ? 'btn-info text-white' : 'btn-outline-info'}`}
              onClick={() => setFilterCategory('PROJECT')}
            >
              🟣 Projects
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filterCategory === 'HOLIDAY' ? 'btn-secondary' : 'btn-outline-secondary'}`}
              onClick={() => setFilterCategory('HOLIDAY')}
            >
              ⚪ Holidays
            </button>
          </div>

          <div className="btn-group btn-group-sm">
            <button
              type="button"
              className={`btn ${activeView === 'agenda' ? 'btn-dark' : 'btn-outline-secondary'}`}
              onClick={() => setActiveView('agenda')}
            >
              <i className="bi bi-view-list me-1"></i> Agenda
            </button>
            <button
              type="button"
              className={`btn ${activeView === 'month' ? 'btn-dark' : 'btn-outline-secondary'}`}
              onClick={() => setActiveView('month')}
            >
              <i className="bi bi-calendar3 me-1"></i> Month
            </button>
          </div>
        </div>

        {/* Agenda View */}
        {activeView === 'agenda' && (
          <div className="row g-4">
            <div className="col-lg-7">
              <div className="d-flex flex-column gap-3">
                {filteredEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className={`card border shadow-sm p-3 rounded-3 cursor-pointer ${
                      selectedEvent?.id === ev.id ? 'border-primary border-2 bg-light' : 'bg-white'
                    }`}
                    onClick={() => setSelectedEvent(ev)}
                    style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      {getCategoryBadge(ev.category)}
                      <span className="small text-muted fw-semibold">
                        <i className="bi bi-clock me-1"></i>{ev.time}
                      </span>
                    </div>

                    <h6 className="fw-bold mb-1 text-dark">{ev.title}</h6>
                    <p className="text-muted small mb-2">{ev.description}</p>

                    <div className="d-flex justify-content-between align-items-center border-top pt-2 mt-auto">
                      <span className="small fw-semibold text-primary">
                        <i className="bi bi-calendar-event me-1"></i>{ev.date}
                      </span>
                      {ev.meetLink && (
                        <span className="badge bg-primary text-white small">
                          <i className="bi bi-camera-video me-1"></i>Google Meet
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Event Details Panel */}
            <div className="col-lg-5">
              <div className="card shadow-sm border-0 sticky-top" style={{ top: '1rem' }}>
                <div className="card-header bg-white py-3 border-0">
                  <h6 className="fw-bold mb-0 text-dark">
                    <i className="bi bi-info-circle me-1 text-primary"></i>Event Details
                  </h6>
                </div>
                <div className="card-body p-4 pt-0">
                  {selectedEvent ? (
                    <div>
                      <div className="mb-2">
                        {getCategoryBadge(selectedEvent.category)}
                      </div>
                      <h5 className="fw-bold text-dark mb-2">{selectedEvent.title}</h5>
                      <p className="text-primary fw-semibold small mb-3">
                        <i className="bi bi-calendar-check me-1"></i>{selectedEvent.date} • {selectedEvent.time}
                      </p>

                      <div className="mb-3">
                        <strong className="text-dark small d-block mb-1">Description:</strong>
                        <p className="text-muted small">{selectedEvent.description}</p>
                      </div>

                      <div className="mb-3 p-3 bg-light rounded-3 border">
                        <strong className="text-dark small d-block mb-1">Agenda:</strong>
                        <pre className="mb-0 text-muted small" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                          {selectedEvent.agenda}
                        </pre>
                      </div>

                      {selectedEvent.resources && (
                        <div className="mb-4 small">
                          <strong className="text-dark d-block mb-1">Attached Resources:</strong>
                          <span className="badge bg-light text-secondary border">{selectedEvent.resources}</span>
                        </div>
                      )}

                      {selectedEvent.meetLink ? (
                        <a
                          href={selectedEvent.meetLink}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary w-100 py-2"
                        >
                          <i className="bi bi-camera-video me-2"></i>Join Google Meet Now
                        </a>
                      ) : (
                        <button className="btn btn-outline-secondary w-100 py-2" disabled>
                          No Video Link Required
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-5 text-muted">
                      <i className="bi bi-calendar-event fs-1 d-block mb-2 text-secondary"></i>
                      <p className="small mb-0">Click any event on the left to inspect its agenda, meeting links, and materials.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Month Calendar Overview */}
        {activeView === 'month' && (
          <div className="card shadow-sm border-0 p-4 text-center">
            <h5 className="fw-bold mb-3 text-dark">September 2026 — Master Schedule</h5>
            <p className="text-muted small mb-4">
              All events are synchronized with your Google Calendar and Ethiroli Monorepo sprint schedule.
            </p>
            <div className="row g-3 text-start">
              {events.map((ev) => (
                <div key={ev.id} className="col-md-6 col-lg-4">
                  <div className="p-3 border rounded-3 bg-light">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      {getCategoryBadge(ev.category)}
                      <small className="text-muted">{ev.date}</small>
                    </div>
                    <strong className="d-block small text-dark mb-1">{ev.title}</strong>
                    <span className="small text-muted">{ev.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminPage>
  );
}
