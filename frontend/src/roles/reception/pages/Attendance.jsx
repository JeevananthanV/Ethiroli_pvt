import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function ReceptionAttendance() {
  const [logs, setLogs] = useState([
    { id: '1', name: 'Aravind Swaminathan', id_number: 'STU-2026-001', category: 'STUDENT', time_in: '08:55 AM', time_out: '--', status: 'ON_TIME', gate: 'Main Campus Gate 1' },
    { id: '2', name: 'Divya Bharathi', id_number: 'STU-2026-002', category: 'STUDENT', time_in: '09:05 AM', time_out: '--', status: 'ON_TIME', gate: 'Main Campus Gate 1' },
    { id: '3', name: 'Raghavan S', id_number: 'INT-2026-041', category: 'INTERN', time_in: '08:50 AM', time_out: '--', status: 'ON_TIME', gate: 'Lab Turnstile 2' },
    { id: '4', name: 'Karthik Subramanian', id_number: 'EMP-014', category: 'EMPLOYEE', time_in: '09:10 AM', time_out: '--', status: 'ON_TIME', gate: 'Staff Entry Gate' },
    { id: '5', name: 'Kishore Kumar', id_number: 'STU-2026-003', category: 'STUDENT', time_in: '09:35 AM', time_out: '--', status: 'LATE', gate: 'Main Campus Gate 1' },
    { id: '6', name: 'Vigneshwaran P', id_number: 'STU-2026-005', category: 'STUDENT', time_in: '09:40 AM', time_out: '--', status: 'LATE', gate: 'Main Campus Gate 1' },
  ]);

  const [scanInput, setScanInput] = useState('');
  const [filter, setFilter] = useState('ALL');

  const handleQuickScan = (e) => {
    e.preventDefault();
    if (!scanInput.trim()) return;

    const newPunch = {
      id: String(Date.now()),
      name: `Badge User (${scanInput.toUpperCase()})`,
      id_number: scanInput.toUpperCase(),
      category: scanInput.toUpperCase().startsWith('EMP') ? 'EMPLOYEE' : scanInput.toUpperCase().startsWith('INT') ? 'INTERN' : 'STUDENT',
      time_in: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      time_out: '--',
      status: 'ON_TIME',
      gate: 'Front Desk Terminal'
    };

    setLogs([newPunch, ...logs]);
    setScanInput('');
  };

  const filteredLogs = logs.filter(l => {
    if (filter === 'ALL') return true;
    return l.category === filter;
  });

  return (
    <AdminPage
      title="Front Desk Gate Attendance Register"
      subtitle="RFID / barcode badge scanner, real-time campus punch-in logs, and late arrival monitoring"
      actions={
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={() => alert('Attendance log downloaded as CSV')}>
            <i className="bi bi-download me-1"></i> Export Daily Log
          </button>
        </div>
      }
    >
      {/* Quick Punch / Scanner Bar */}
      <div className="card border-0 shadow-sm rounded-3 p-3 mb-2 bg-white">
        <form onSubmit={handleQuickScan}>
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-light border-0"><i className="bi bi-upc-scan text-primary fs-5"></i></span>
                <input
                  type="text"
                  className="form-control bg-light border-0"
                  placeholder="Scan RFID badge or enter Roll/ID # (e.g. STU-2026-009, EMP-020)..."
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <button type="submit" className="btn btn-primary w-100 shadow-sm">
                <i className="bi bi-check-circle-fill me-1"></i> Record Campus Punch
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Metrics */}
      <div className="row g-3 mb-2">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Total Check-Ins Today</span>
            <h3 className="fw-bold mb-0 mt-1">{logs.length}</h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Students Present</span>
            <h3 className="fw-bold mb-0 mt-1 text-primary">
              {logs.filter(l => l.category === 'STUDENT').length}
            </h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Staff & Interns</span>
            <h3 className="fw-bold mb-0 mt-1 text-success">
              {logs.filter(l => l.category === 'EMPLOYEE' || l.category === 'INTERN').length}
            </h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-medium">Late Arrivals</span>
            <h3 className="fw-bold mb-0 mt-1 text-warning">
              {logs.filter(l => l.status === 'LATE').length}
            </h3>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="btn-group shadow-sm">
          <button className={`btn btn-sm ${filter === 'ALL' ? 'btn-primary' : 'btn-light'}`} onClick={() => setFilter('ALL')}>
            All ({logs.length})
          </button>
          <button className={`btn btn-sm ${filter === 'STUDENT' ? 'btn-primary' : 'btn-light'}`} onClick={() => setFilter('STUDENT')}>
            Students ({logs.filter(l => l.category === 'STUDENT').length})
          </button>
          <button className={`btn btn-sm ${filter === 'INTERN' ? 'btn-primary' : 'btn-light'}`} onClick={() => setFilter('INTERN')}>
            Interns ({logs.filter(l => l.category === 'INTERN').length})
          </button>
          <button className={`btn btn-sm ${filter === 'EMPLOYEE' ? 'btn-primary' : 'btn-light'}`} onClick={() => setFilter('EMPLOYEE')}>
            Staff ({logs.filter(l => l.category === 'EMPLOYEE').length})
          </button>
        </div>
      </div>

      {/* Attendance Log Table */}
      <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-3">ID Number</th>
                <th>Name</th>
                <th>Category</th>
                <th>Punch In Time</th>
                <th>Punch Out Time</th>
                <th>Punch Status</th>
                <th>Entry Terminal</th>
                <th className="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(l => (
                <tr key={l.id}>
                  <td className="ps-3">
                    <span className="font-monospace text-primary fw-bold">{l.id_number}</span>
                  </td>
                  <td>
                    <div className="fw-semibold text-dark">{l.name}</div>
                  </td>
                  <td>
                    <span className={`badge ${l.category === 'STUDENT' ? 'bg-info bg-opacity-10 text-info' : l.category === 'INTERN' ? 'bg-warning bg-opacity-10 text-warning' : 'bg-success bg-opacity-10 text-success'}`}>
                      {l.category}
                    </span>
                  </td>
                  <td>
                    <span className="fw-medium text-dark"><i className="bi bi-clock me-1 text-muted"></i>{l.time_in}</span>
                  </td>
                  <td>
                    <span className="text-muted">{l.time_out}</span>
                  </td>
                  <td>
                    {l.status === 'LATE' ? (
                      <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1">
                        <i className="bi bi-clock-history me-1"></i>Late Entry
                      </span>
                    ) : (
                      <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">
                        <i className="bi bi-check2 me-1"></i>On Time
                      </span>
                    )}
                  </td>
                  <td>
                    <small className="text-secondary">{l.gate}</small>
                  </td>
                  <td className="text-end pe-3">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => {
                        setLogs(prev => prev.map(p => p.id === l.id ? { ...p, time_out: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : p));
                      }}
                      disabled={l.time_out !== '--'}
                    >
                      {l.time_out !== '--' ? 'Checked Out' : 'Check Out'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  );
}
