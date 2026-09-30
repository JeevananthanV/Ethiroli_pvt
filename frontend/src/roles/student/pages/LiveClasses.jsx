import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';

const LIVE_SESSIONS = [
  {
    id: 'LIVE-101',
    title: 'React Custom Hooks & Async Lifecycle Deep Dive',
    course: 'Full Stack + AI Web Developer Masterclass',
    tutor: 'Jeeva Karthik (Lead Architect)',
    date: 'Today, Sep 30, 2026',
    time: '10:00 AM – 11:30 AM IST',
    status: 'LIVE_NOW',
    joinUrl: 'https://meet.google.com/eth-live-react',
    recordingUrl: null,
    notes: 'Covering useMemo, useCallback, and building a production-ready useFetch hook with retry logic.',
    attendanceMarked: true,
  },
  {
    id: 'LIVE-102',
    title: 'Node.js Event Loop & Microservices REST Architecture',
    course: 'Full Stack + AI Web Developer Masterclass',
    tutor: 'Senthil Nathan (Senior Backend Engineer)',
    date: 'Tomorrow, Oct 01, 2026',
    time: '10:00 AM – 11:30 AM IST',
    status: 'UPCOMING',
    joinUrl: 'https://meet.google.com/eth-live-node',
    recordingUrl: null,
    notes: 'Prerequisite: Install Docker Desktop and review ES6 async iterators.',
    attendanceMarked: false,
  },
  {
    id: 'LIVE-103',
    title: 'Relational Database Schema Design & SQL Optimization',
    course: 'Full Stack + AI Web Developer Masterclass',
    tutor: 'Dr. Meenakshi Sundaram',
    date: 'Friday, Oct 03, 2026',
    time: '02:00 PM – 03:30 PM IST',
    status: 'UPCOMING',
    joinUrl: 'https://meet.google.com/eth-live-sql',
    recordingUrl: null,
    notes: 'Indexing strategies, query execution plans, and normalization vs denormalization.',
    attendanceMarked: false,
  },
  {
    id: 'LIVE-104',
    title: 'CSS Grid, Flexbox Mastery & Responsive Web Layouts',
    course: 'Full Stack + AI Web Developer Masterclass',
    tutor: 'Pooja Krishnan (UI/UX Lead)',
    date: 'Sep 26, 2026',
    time: '10:00 AM – 11:30 AM IST',
    status: 'COMPLETED',
    joinUrl: null,
    recordingUrl: 'https://cdn.ethiroli.edu/recordings/css-grid-mastery.mp4',
    notes: 'Class recording and slides available. 98% batch attendance recorded.',
    attendanceMarked: true,
  },
  {
    id: 'LIVE-105',
    title: 'JavaScript ES6+ Async/Await & Promises Masterclass',
    course: 'Full Stack + AI Web Developer Masterclass',
    tutor: 'Jeeva Karthik (Lead Architect)',
    date: 'Sep 24, 2026',
    time: '10:00 AM – 11:30 AM IST',
    status: 'COMPLETED',
    joinUrl: null,
    recordingUrl: 'https://cdn.ethiroli.edu/recordings/js-async-await.mp4',
    notes: 'Promise chaining, race conditions, and error boundaries.',
    attendanceMarked: true,
  },
];

export default function LiveClasses() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedSession, setSelectedSession] = useState(null);

  const filteredSessions = LIVE_SESSIONS.filter((s) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'LIVE_NOW') return s.status === 'LIVE_NOW';
    if (activeTab === 'UPCOMING') return s.status === 'UPCOMING';
    if (activeTab === 'RECORDINGS') return s.status === 'COMPLETED';
    return true;
  });

  return (
    <AdminPage
      title="Live Classroom & Interactive Sessions"
      subtitle="Join live interactive lectures with industry tutors, access session recordings, and track live class attendance."
    >
      {/* Live Now Highlight Banner */}
      {LIVE_SESSIONS.filter((s) => s.status === 'LIVE_NOW').map((s) => (
        <div key={s.id} className="card border-danger border-2 shadow-sm mb-4 bg-danger bg-opacity-10">
          <div className="card-body p-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <span className="badge bg-danger text-white px-3 py-2 rounded-pill mb-2 d-inline-flex align-items-center gap-2">
                <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" />
                SESSION HAPPENING NOW
              </span>
              <h3 className="h4 fw-bold text-dark mb-1">{s.title}</h3>
              <p className="text-muted small mb-0">
                <i className="bi bi-person-video3 me-1 text-primary" /> Faculty: <strong>{s.tutor}</strong> ·{' '}
                <i className="bi bi-clock me-1 text-secondary" /> {s.time}
              </p>
            </div>
            <div className="d-flex gap-2">
              <a
                href={s.joinUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-danger btn-lg px-4 d-inline-flex align-items-center gap-2 shadow"
              >
                <i className="bi bi-camera-video-fill" /> Join Live Classroom
              </a>
            </div>
          </div>
        </div>
      ))}

      {/* Filter Tabs */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div className="btn-group" role="group">
          {['ALL', 'LIVE_NOW', 'UPCOMING', 'RECORDINGS'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-outline-secondary'}`}
            >
              {tab === 'ALL' && 'All Sessions'}
              {tab === 'LIVE_NOW' && '🔴 Live Now'}
              {tab === 'UPCOMING' && '📅 Upcoming'}
              {tab === 'RECORDINGS' && '📼 Past Recordings'}
            </button>
          ))}
        </div>
        <div className="text-muted small">
          Showing <strong>{filteredSessions.length}</strong> session{filteredSessions.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Session List Grid */}
      <div className="row g-3">
        {filteredSessions.map((session) => (
          <div key={session.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 border shadow-sm">
              <div className="card-header bg-light d-flex justify-content-between align-items-center py-2">
                <span className="badge bg-secondary-subtle text-secondary small">{session.date}</span>
                {session.status === 'LIVE_NOW' && (
                  <span className="badge bg-danger text-white">LIVE NOW</span>
                )}
                {session.status === 'UPCOMING' && (
                  <span className="badge bg-primary-subtle text-primary">UPCOMING</span>
                )}
                {session.status === 'COMPLETED' && (
                  <span className="badge bg-success-subtle text-success">RECORDED</span>
                )}
              </div>

              <div className="card-body d-flex flex-column">
                <h5 className="card-title h6 fw-bold text-dark mb-2">{session.title}</h5>
                <p className="small text-muted mb-2">
                  <i className="bi bi-mortarboard me-1" /> {session.course}
                </p>
                <p className="small text-muted mb-2">
                  <i className="bi bi-person-circle me-1" /> Tutor: <strong>{session.tutor}</strong>
                </p>
                <p className="small text-muted mb-3">
                  <i className="bi bi-clock me-1" /> {session.time}
                </p>
                <div className="small text-muted p-2 bg-light rounded mb-3 flex-grow-1">
                  <strong>Notes:</strong> {session.notes}
                </div>

                <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-auto">
                  {session.attendanceMarked ? (
                    <span className="small text-success">
                      <i className="bi bi-check2-circle me-1" /> Attendance Logged
                    </span>
                  ) : (
                    <span className="small text-muted">
                      <i className="bi bi-hourglass-split me-1" /> Pending Check-in
                    </span>
                  )}

                  {session.status === 'LIVE_NOW' && (
                    <a
                      href={session.joinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-danger d-inline-flex align-items-center gap-1"
                    >
                      <i className="bi bi-camera-video" /> Join
                    </a>
                  )}

                  {session.status === 'UPCOMING' && (
                    <button
                      onClick={() => alert(`Reminder set for ${session.title}`)}
                      className="btn btn-sm btn-outline-primary"
                    >
                      <i className="bi bi-bell me-1" /> Remind Me
                    </button>
                  )}

                  {session.status === 'COMPLETED' && (
                    <button
                      onClick={() => setSelectedSession(session)}
                      className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1"
                    >
                      <i className="bi bi-play-circle" /> Watch
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recording Player Modal */}
      {selectedSession && (
        <Modal
          title={`Class Recording: ${selectedSession.title}`}
          onClose={() => setSelectedSession(null)}
        >
          <div className="p-3">
            <div className="bg-dark rounded p-4 text-center text-white mb-3" style={{ minHeight: 220 }}>
              <i className="bi bi-play-circle-fill text-danger" style={{ fontSize: 56, cursor: 'pointer' }} />
              <div className="mt-2 fw-semibold">Interactive Video Recording Player</div>
              <small className="opacity-75">{selectedSession.tutor} · {selectedSession.date}</small>
            </div>
            <h6>Session Summary & Discussion:</h6>
            <p className="text-muted small">{selectedSession.notes}</p>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setSelectedSession(null)}>
                Close
              </Button>
              <Button variant="primary" onClick={() => alert('Downloading session notes and slides PDF...')}>
                <i className="bi bi-download me-1" /> Download Slides (PDF)
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </AdminPage>
  );
}
