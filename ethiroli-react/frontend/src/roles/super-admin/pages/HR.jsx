import React, { useEffect, useState } from 'react';
import { getEmployees } from '../../services/api/employeeApi.js';
import { getLeaves } from '../../services/api/leaveApi.js';
import { getInterviews } from '../../services/api/interviewApi.js';
import { getInterns } from '../../services/api/internApi.js';

export default function HR() {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [empRes, leaveRes, intRes, internRes] = await Promise.all([
        getEmployees().catch(() => []),
        getLeaves().catch(() => []),
        getInterviews().catch(() => []),
        getInterns().catch(() => []),
      ]);
      setEmployees(Array.isArray(empRes) ? empRes : []);
      setLeaves(Array.isArray(leaveRes) ? leaveRes : []);
      setInterviews(Array.isArray(intRes) ? intRes : []);
      setInterns(Array.isArray(internRes) ? internRes : []);
    } catch (err) {
      console.error('Failed to load HR data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <div className="loading">Loading HR data...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Human Resources</h2>
          <p className="pageSubtitle">Employees, interns, attendance, leaves, and interviews</p>
        </div>
        <div className="pageActions">
          <button onClick={loadData} className="btn">Refresh</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px', marginBottom: '24px' }}>
        <div className="statCard">
          <p className="statLabel">Employees</p>
          <p className="statValue">{employees.length}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Interns</p>
          <p className="statValue">{interns.length}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Pending Leaves</p>
          <p className="statValue">{leaves.filter((l) => l.status === 'pending').length}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Interviews Scheduled</p>
          <p className="statValue">{interviews.length}</p>
        </div>
      </div>
      <div style={{ display: 'grid', gap: '20px' }}>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Employees ({employees.length})</h3></div>
          <div className="cardBody">
            {employees.length === 0 ? (
              <p style={{ color: 'var(--admin-text-secondary)' }}>No employees found.</p>
            ) : (
              <table className="table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id}>
                      <td>{emp.full_name}</td>
                      <td>{emp.email}</td>
                      <td><span className="roleTag">{emp.role}</span></td>
                      <td><span className={`statusTag ${emp.is_active ? 'active' : 'inactive'}`}>{emp.is_active ? 'Active' : 'Inactive'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Recent Leaves ({leaves.length})</h3></div>
          <div className="cardBody">
            {leaves.length === 0 ? (
              <p style={{ color: 'var(--admin-text-secondary)' }}>No leave applications.</p>
            ) : (
              <table className="table">
                <thead><tr><th>Employee</th><th>Type</th><th>Dates</th><th>Status</th></tr></thead>
                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave.id}>
                      <td>{leave.employee_name || leave.employee_id}</td>
                      <td>{leave.leave_type || 'Leave'}</td>
                      <td>{leave.start_date} to {leave.end_date}</td>
                      <td><span className={`statusTag ${leave.status === 'approved' ? 'active' : leave.status === 'rejected' ? 'inactive' : 'pending'}`}>{leave.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
