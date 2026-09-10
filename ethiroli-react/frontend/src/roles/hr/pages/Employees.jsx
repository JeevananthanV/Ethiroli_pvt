import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listEmployees } from '../../../services/api/employeeApi.js';

export default function HREmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listEmployees().catch(() => []);
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return (
    <AdminPage
      title="Employee Directory"
      subtitle="Manage employee records and designations"
      loading={loading}
      error={error}
      onRetry={fetchEmployees}
    >
      <div className="dashboard">
        {employees.length === 0 ? (
          <div className="emptyState">
            <h3>No employees found</h3>
            <p>Add employees to build your directory.</p>
          </div>
        ) : (
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">All Employees</h3>
            </div>
            <div className="cardBody" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Department</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id}>
                      <td style={{ fontWeight: 600 }}>{emp.full_name || emp.name}</td>
                      <td>{emp.designation || emp.job_title || '—'}</td>
                      <td>{emp.department || '—'}</td>
                      <td>
                        <span className={`statusTag ${emp.is_active !== false ? 'active' : 'inactive'}`}>
                          {emp.is_active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminPage>
  );
}