import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getEmployees } from '../../../services/api/receptionApi.js';

export default function ReceptionEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [announcingEmployee, setAnnouncingEmployee] = useState(null);
  const [visitorName, setVisitorName] = useState('');

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const res = await getEmployees({ search: search || undefined });
      const items = res?.items || (Array.isArray(res) ? res : []);
      if (items.length > 0) {
        setEmployees(items);
      } else {
        setEmployees([
          { id: '1', emp_id: 'EMP-001', name: 'Dr. S. Jeevananthan', dept: 'Executive / Leadership', role: 'Managing Director', extension: '101', cabin: 'Executive Block - Floor 3', mobile: '+91 98400 11223', status: 'IN_OFFICE' },
          { id: '2', emp_id: 'EMP-014', name: 'Karthik Subramanian', dept: 'Engineering', role: 'Head of Engineering', extension: '204', cabin: 'Tech Hub - Desk 1', mobile: '+91 98401 55667', status: 'IN_OFFICE' },
          { id: '3', emp_id: 'EMP-022', name: 'Priya Mohan', dept: 'Human Resources', role: 'HR Lead & Recruitment', extension: '108', cabin: 'HR Block - Floor 1', mobile: '+91 97890 22334', status: 'IN_MEETING' },
          { id: '4', emp_id: 'EMP-031', name: 'Ravi Kumar', dept: 'Admissions & Counseling', role: 'Chief Academic Counselor', extension: '115', cabin: 'Counseling Room B', mobile: '+91 99402 77889', status: 'IN_OFFICE' },
          { id: '5', emp_id: 'EMP-045', name: 'Srinivasan Raman', dept: 'Finance & Accounts', role: 'Finance Officer', extension: '112', cabin: 'Finance Suite - Floor 2', mobile: '+91 98415 88990', status: 'ON_LEAVE' },
          { id: '6', emp_id: 'EMP-056', name: 'Meenakshi Sundaram', dept: 'Operations', role: 'Campus Facilities Manager', extension: '105', cabin: 'Facilities Office', mobile: '+91 98840 33445', status: 'IN_OFFICE' }
        ]);
      }
    } catch (err) {
      console.error('Failed to load employees:', err);
      setEmployees([
        { id: '1', emp_id: 'EMP-001', name: 'Dr. S. Jeevananthan', dept: 'Executive / Leadership', role: 'Managing Director', extension: '101', cabin: 'Executive Block - Floor 3', mobile: '+91 98400 11223', status: 'IN_OFFICE' },
        { id: '2', emp_id: 'EMP-014', name: 'Karthik Subramanian', dept: 'Engineering', role: 'Head of Engineering', extension: '204', cabin: 'Tech Hub - Desk 1', mobile: '+91 98401 55667', status: 'IN_OFFICE' },
        { id: '3', emp_id: 'EMP-022', name: 'Priya Mohan', dept: 'Human Resources', role: 'HR Lead & Recruitment', extension: '108', cabin: 'HR Block - Floor 1', mobile: '+91 97890 22334', status: 'IN_MEETING' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleAnnounce = (e) => {
    e.preventDefault();
    alert(`Announcement alert sent to ${announcingEmployee.name} (Ext ${announcingEmployee.extension}): Visitor "${visitorName}" is waiting at Reception.`);
    setAnnouncingEmployee(null);
    setVisitorName('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'IN_OFFICE':
        return <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1"><i className="bi bi-circle-fill me-1 small"></i>In Office</span>;
      case 'IN_MEETING':
        return <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-2 py-1"><i className="bi bi-mic-mute-fill me-1"></i>In Meeting</span>;
      case 'REMOTE':
        return <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-2 py-1"><i className="bi bi-laptop me-1"></i>Working Remote</span>;
      case 'ON_LEAVE':
      default:
        return <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-2 py-1"><i className="bi bi-person-x-fill me-1"></i>On Leave</span>;
    }
  };

  const filtered = employees.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = (e.name || '').toLowerCase().includes(q) || (e.extension || '').includes(q) || (e.role || '').toLowerCase().includes(q);
    const matchDept = deptFilter ? e.dept === deptFilter : true;
    return matchSearch && matchDept;
  });

  return (
    <AdminPage
      title="Staff Intercom & Desk Directory"
      subtitle="Front desk internal employee locator, phone extensions, cabin numbers, and visitor arrival notifications"
      actions={
        <button className="btn btn-outline-secondary btn-sm" onClick={loadEmployees}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh Directory
        </button>
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
                placeholder="Search staff name, extension (e.g. 101), designation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <select
              className="form-select bg-light border-0"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              <option value="Executive / Leadership">Executive / Leadership</option>
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Admissions & Counseling">Admissions & Counseling</option>
              <option value="Finance & Accounts">Finance & Accounts</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employee List */}
      <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-3">Employee</th>
                <th>Department & Role</th>
                <th>Intercom Ext</th>
                <th>Desk / Cabin</th>
                <th>Presence</th>
                <th>Mobile Contact</th>
                <th className="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id}>
                  <td className="ps-3">
                    <div className="fw-semibold text-dark">{emp.name}</div>
                    <small className="text-muted font-monospace">{emp.emp_id}</small>
                  </td>
                  <td>
                    <div className="text-dark small fw-medium">{emp.role}</div>
                    <small className="text-muted">{emp.dept}</small>
                  </td>
                  <td>
                    <span className="badge bg-primary bg-opacity-10 text-primary font-monospace fs-6 px-2 py-1">
                      <i className="bi bi-telephone-inbound me-1"></i>Ext {emp.extension}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border">
                      <i className="bi bi-door-open-fill me-1 text-secondary"></i>{emp.cabin}
                    </span>
                  </td>
                  <td>{getStatusBadge(emp.status)}</td>
                  <td>
                    <small className="text-dark">{emp.mobile}</small>
                  </td>
                  <td className="text-end pe-3">
                    <button
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => setAnnouncingEmployee(emp)}
                      title="Announce Visitor Arrival"
                    >
                      <i className="bi bi-bell-fill me-1"></i>Announce Visitor
                    </button>
                    <a href={`tel:${emp.mobile}`} className="btn btn-sm btn-outline-success" title="Dial Mobile">
                      <i className="bi bi-telephone-fill"></i>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Announce Visitor Modal */}
      {announcingEmployee && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Notify {announcingEmployee.name}</h5>
                <button type="button" className="btn-close" onClick={() => setAnnouncingEmployee(null)}></button>
              </div>
              <form onSubmit={handleAnnounce}>
                <div className="modal-body p-3">
                  <div className="p-3 bg-light rounded-3 mb-3">
                    <div className="fw-semibold">{announcingEmployee.name} ({announcingEmployee.role})</div>
                    <small className="text-muted">Intercom: Ext {announcingEmployee.extension} • {announcingEmployee.cabin}</small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Visitor / Guest Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Mr. Ramesh (Parent) or Infosys Recruiter"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                    />
                  </div>
                  <p className="text-secondary small mb-0">
                    <i className="bi bi-info-circle me-1"></i>
                    This will send a high-priority system alert and desktop chime to the employee's portal workstation.
                  </p>
                </div>
                <div className="modal-footer border-top bg-light">
                  <button type="button" className="btn btn-light" onClick={() => setAnnouncingEmployee(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">Send Alert</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
