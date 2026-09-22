import React, { useEffect, useState } from 'react';
import { getEmployees } from '../../../../services/api/employeeApi.js';

export default function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getEmployees().catch(() => []);
        setEmployees(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load employees:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading employees...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Employees</h2>
          <p className="pageSubtitle">Manage employee records</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {employees.length === 0 ? (
            <div className="emptyState"><h3>No Employees</h3><p>No employees found.</p></div>
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
    </div>
  );
}
