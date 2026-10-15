import React, { useState, useEffect, useCallback } from 'react';
import { localDateKey } from '../../../services/api/financePortalApi.js';
import { formatClock, formatDuration } from '../../../common/utils/timeFormat.js';
import { financePortalApi } from '../../../services/api/financePortalApi.js';

export default function FinancePunchClock() {
  const [clockedIn, setClockedIn] = useState(false);
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [clockInTime, setClockInTime] = useState('');
  const [punchDirection, setPunchDirection] = useState('IN'); // IN → OUT
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [currentTime, setCurrentTime] = useState(() => new Date().toLocaleTimeString());
  const [workMode, setWorkMode] = useState('REMOTE'); // Remote | Office

  // Live tick that advances only while clocked in
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
      if (clockedIn) {
        setDurationSeconds((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [clockedIn]);

  // ---- Punch In ----
  const handleClockIn = async () => {
    await financePortalApi.punchAttendance('CHECK_IN');
    setClockInTime(formatClock(new Date()));
    setClockedIn(true);
    setIsCheckedOut(false);
    setPunchDirection('OUT');
    setDurationSeconds(0);
  };

  // ---- Punch Out (confirmation then actual out) ----
  const handleConfirmCheckout = async () => {
    await financePortalApi.punchAttendance('CHECK_OUT');
    setClockedIn(false);
    setIsCheckedOut(true);
    setPunchDirection('IN');
    // option‑al alert could be shown here
  };

  // ---- UI ----
  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body p-3">
        <div className="row align-items-center g-4">
          {/* Left: mode selector + live clock */}
          <div className="col-md-4 text-center text-md-start">
            <div className="btn-group btn-group-sm mb-2" role="group" aria-label="Work mode">
              <button
                type="button"
                className={`btn ${workMode === 'REMOTE' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setWorkMode('REMOTE')}
                disabled={clockedIn || isCheckedOut}
                title={clockedIn ? 'Work mode is locked once you have clocked in' : 'Work from home'}
              >
                <i className="bi bi-house me-1"></i> Remote
              </button>
              <button
                type="button"
                className={`btn ${workMode === 'OFFICE' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setWorkMode('OFFICE')}
                disabled={clockedIn || isCheckedOut}
                title={clockedIn ? 'Work mode is locked once you have clocked in' : 'Work from the office'}
              >
                <i className="bi bi-building me-1"></i> Office
              </button>
            </div>
            <span className="text-muted small text-uppercase fw-bold d-block">Live Clock</span>
            <h2 className="display-6 fw-bold text-primary mb-1">{currentTime}</h2>
            <span className="badge bg-light text-dark border">
              {new Date().toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}</span>
          </div>

          {/* Middle: duration counter */}
          <div className="col-md-4 text-center border-md-end">
            <span className="text-muted small text-uppercase fw-bold d-block mb-1">
              Working Duration Counter
            </span>
            <h2 className="fw-bold text-success font-monospace mb-2">
              {clockedIn || isCheckedOut ? formatDuration(durationSeconds) : '00h 00m 00s'}
            </h2>
            <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
              <span
                className={`badge px-3 py-1 ${clockedIn ? 'bg-success' : isCheckedOut ? 'bg-secondary' : 'bg-warning text-dark'}`}
              >
                <i className={`bi ${clockedIn ? 'broadcast' : isCheckedOut ? 'check-circle' : 'power'} me-1`}></i>
                {clockedIn
                  ? `Clocked IN at ${clockInTime}`
                  : isCheckedOut
                  ? `Clocked OUT${clockInTime ? ` at ${clockInTime}` : ''}`
                  : 'Not Punched Today'}
              </span>
            </div>
          </div>

          {/* Right: IN / OUT direction + action button */}
          <div className="col-md-4 text-center text-md-end">
            <div className="d-flex flex-column gap-2">
              <div className="btn-group btn-group-sm justify-content-center" role="group" aria-label="Punch direction">
                <button
                  type="button"
                  className={`btn ${punchDirection === 'IN' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setPunchDirection('IN')}
                  disabled={clockedIn || isCheckedOut}
                  title={clockedIn ? 'Already clocked in for today' : isCheckedOut ? 'Today is already completed' : 'Select Clock In'}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i> IN
                </button>
                <button
                  type="button"
                  className={`btn ${punchDirection === 'OUT' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setPunchDirection('OUT')}
                  disabled={!clockedIn}
                  title={!clockedIn ? 'Clock in first before selecting Clock Out' : 'Select Clock Out'}
                >
                  <i className="bi bi-box-arrow-left me-1"></i> OUT
                </button>
              </div>

              {/* Step 2: performs the selected action */}
              <button
                type="button"
                className={`btn btn-lg shadow-sm d-flex align-items-center justify-content-center ${isCheckedOut ? 'btn-secondary' : punchDirection === 'OUT' ? 'btn-danger' : 'btn-success'}`}
                disabled={false} // actionLoading not used here; guard via state if needed
                onClick={() => (punchDirection === 'OUT' ? handleConfirmCheckout() : handleClockIn())}
              >
                <i className={`bi ${punchDirection === 'OUT' ? 'box-arrow-left' : 'box-arrow-in-right'} me-2`}></i>
                {isCheckedOut ? 'Completed for Today' : punchDirection === 'OUT' ? 'Clock Out Now' : 'Clock In Now'}
              </button>

              {/* Leave request shortcut (kept from original attendance page) */}
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => window.alert('Leave modal not wired – implement separately if needed')}
              >
                <i className="bi bi-calendar2-plus me-1"></i> Apply for Leave
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}